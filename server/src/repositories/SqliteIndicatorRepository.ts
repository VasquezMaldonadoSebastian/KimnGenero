import path from "path";
import { createRequire } from "node:module";
import fs from "node:fs";
import type {
  GroupedReport,
  Indicator,
  IndicatorCategory,
  RawGroupedReport,
  RawIndicator,
} from "../../../shared/types/indicator-domain";
import type { IndicatorRepository } from "./IndicatorRepository";
import { groupIndicatorsByArea, mapItem } from "../services/normalizers";

type DatabaseSync = import("node:sqlite").DatabaseSync;
type DatabaseSyncCtor = typeof import("node:sqlite").DatabaseSync;

const require = createRequire(import.meta.url);
let cachedDatabaseSyncCtor: DatabaseSyncCtor | null = null;

function getDatabaseSyncCtor(): DatabaseSyncCtor {
  if (cachedDatabaseSyncCtor) return cachedDatabaseSyncCtor;
  // Vitest/Vite sometimes fails to resolve `node:sqlite` as a builtin module.
  // Loading it via `require` avoids bundler resolution and delegates to Node.
  cachedDatabaseSyncCtor = require("node:sqlite").DatabaseSync as DatabaseSyncCtor;
  return cachedDatabaseSyncCtor;
}

type SqliteIndicatorRepositoryOptions = {
  dbPath: string;
  seedIndicators: RawIndicator[];
  seedReports?: RawGroupedReport[];
};

export class SqliteIndicatorRepository implements IndicatorRepository {
  private readonly options: SqliteIndicatorRepositoryOptions;
  private db: DatabaseSync | null = null;
  private initialized = false;
  private initializePromise: Promise<void> | null = null;

  private indicators: Indicator[] = [];
  private categories: IndicatorCategory[] = [];
  private groupedReports: GroupedReport[] = [];

  constructor(options: SqliteIndicatorRepositoryOptions) {
    this.options = options;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    if (this.initializePromise) return this.initializePromise;

    this.initializePromise = this.doInitialize().finally(() => {
      this.initializePromise = null;
    });

    return this.initializePromise;
  }

  private async doInitialize(): Promise<void> {
    const dbPath = this.options.dbPath;
    const resolvedDbPath =
      dbPath === ":memory:"
        ? dbPath
        : path.isAbsolute(dbPath)
          ? dbPath
          : path.resolve(process.cwd(), dbPath);

    if (resolvedDbPath !== ":memory:") {
      const dir = path.dirname(resolvedDbPath);
      if (dir && dir !== "." && !fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(resolvedDbPath) && fs.statSync(resolvedDbPath).isDirectory()) {
        throw new Error("SQLite dbPath points to a directory");
      }
    }

    const DatabaseSync = getDatabaseSyncCtor();
    this.db = new DatabaseSync(resolvedDbPath);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS indicators (
        id TEXT PRIMARY KEY,
        json TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS grouped_reports (
        id TEXT PRIMARY KEY,
        json TEXT NOT NULL
      );
    `);

    const countStmt = this.db.prepare("SELECT COUNT(*) as c FROM indicators");
    const row = countStmt.get() as { c: number };
    if (row.c === 0) {
      const insertIndicator = this.db.prepare("INSERT INTO indicators (id, json) VALUES (?, ?)");
      for (const raw of this.options.seedIndicators) {
        const mapped = mapItem(raw);
        insertIndicator.run(mapped.id, JSON.stringify(mapped));
      }

      const insertReport = this.db.prepare("INSERT INTO grouped_reports (id, json) VALUES (?, ?)");
      for (const report of this.options.seedReports ?? []) {
        insertReport.run(report.id, JSON.stringify(report));
      }
    }

    this.reloadFromDb();
    this.initialized = true;
  }

  private reloadFromDb() {
    if (!this.db) return;
    // Ensure deterministic ordering so API responses don't depend on SQLite internal iteration order.
    const indicatorsRows = this.db
      .prepare("SELECT json FROM indicators ORDER BY id")
      .all() as Array<{ json: string }>;
    this.indicators = indicatorsRows.map((r) => JSON.parse(r.json) as Indicator);

    this.categories = groupIndicatorsByArea(this.indicators);

    const reportsRows = this.db
      .prepare("SELECT json FROM grouped_reports ORDER BY id")
      .all() as Array<{ json: string }>;
    this.groupedReports = reportsRows.map((r) => JSON.parse(r.json) as GroupedReport);
  }

  getIndicators(): Indicator[] {
    return this.indicators;
  }

  getIndicator(id: string): Indicator | undefined {
    return this.indicators.find((ind) => ind.id === id);
  }

  getCategories(): IndicatorCategory[] {
    return this.categories;
  }

  getIndicatorsByCategory(categoryId: string): Indicator[] {
    const category = this.categories.find((cat) => cat.id === categoryId);
    return category ? category.indicadores : [];
  }

  getGroupedReports(): GroupedReport[] {
    return this.groupedReports;
  }
}
