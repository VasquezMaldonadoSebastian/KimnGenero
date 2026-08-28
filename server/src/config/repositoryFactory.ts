import path from "path";
import type { RawGroupedReport, RawIndicator } from "../../../shared/types/indicator-domain";
import type { IndicatorRepository } from "../repositories/IndicatorRepository";
import { InMemoryIndicatorRepository } from "../repositories/InMemoryIndicatorRepository";
import { SqliteIndicatorRepository } from "../repositories/SqliteIndicatorRepository";

type RepositoryKind = "memory" | "sqlite";

function getRepoKind(): RepositoryKind {
  const v = (process.env.INDICATOR_REPOSITORY ?? "memory").toLowerCase();
  if (v === "sqlite") return "sqlite";
  return "memory";
}

export function createIndicatorRepository(options: {
  rawIndicators: RawIndicator[];
  rawReports: RawGroupedReport[];
}): IndicatorRepository {
  const kind = getRepoKind();

  if (kind === "sqlite") {
    const dbPath = process.env.SQLITE_DB_PATH ?? path.join("data", "indicators.sqlite");
    return new SqliteIndicatorRepository({
      dbPath,
      seedIndicators: options.rawIndicators,
      seedReports: options.rawReports,
    });
  }

  return new InMemoryIndicatorRepository({
    indicatorsData: options.rawIndicators,
    reportsData: options.rawReports,
  });
}

