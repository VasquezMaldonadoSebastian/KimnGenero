import { describe, expect, it } from "vitest";
import path from "node:path";
import os from "node:os";
import fs from "node:fs";
import { SqliteIndicatorRepository } from "./SqliteIndicatorRepository";
import type { RawIndicator } from "../../../shared/types/indicator-domain";

function makeRawIndicator(overrides: Partial<RawIndicator> = {}): RawIndicator {
  return {
    id: "1",
    codigo: "IND-001",
    nombre: "Indicador 1",
    descripcion: "Descripcion 1",
    objetivo: "Objetivo 1",
    area: "Salud",
    dimension: "Dim 1",
    enlaceVisualizacion: "https://example.com/powerbi",
    fechaCorte: "2026-01-01",
    ...overrides,
  };
}

describe("SqliteIndicatorRepository", () => {
  it("creates missing directories for dbPath", async () => {
    const baseDir = path.join(os.tmpdir(), `KimnGenero-sqlite-${Date.now()}-${Math.random()}`);
    const dbPath = path.join(baseDir, "nested", "indicators.sqlite");

    expect(fs.existsSync(path.dirname(dbPath))).toBe(false);

    const repo = new SqliteIndicatorRepository({
      dbPath,
      seedIndicators: [makeRawIndicator()],
      seedReports: [],
    });

    await repo.initialize();

    expect(fs.existsSync(path.dirname(dbPath))).toBe(true);
    expect(fs.existsSync(dbPath)).toBe(true);
    expect(repo.getIndicators().length).toBe(1);
  });

  it("is idempotent when initialize is called multiple times", async () => {
    const dbPath = path.join(
      os.tmpdir(),
      `KimnGenero-sqlite-idempotent-${Date.now()}-${Math.random()}.sqlite`
    );

    const repo = new SqliteIndicatorRepository({
      dbPath,
      seedIndicators: [makeRawIndicator()],
      seedReports: [],
    });

    await Promise.all([repo.initialize(), repo.initialize(), repo.initialize()]);

    expect(repo.getIndicators().length).toBe(1);
    expect(repo.getIndicator("1")?.codigo).toBe("IND-001");
  });

  it("rejects dbPath that points to an existing directory", async () => {
    const dirPath = path.join(
      os.tmpdir(),
      `KimnGenero-sqlite-dirpath-${Date.now()}-${Math.random()}`
    );
    fs.mkdirSync(dirPath, { recursive: true });

    const repo = new SqliteIndicatorRepository({
      dbPath: dirPath,
      seedIndicators: [makeRawIndicator()],
      seedReports: [],
    });

    await expect(repo.initialize()).rejects.toThrow(/directory/i);
  });

  it("does not overwrite an existing database on re-initialization with different seed", async () => {
    const dbPath = path.join(
      os.tmpdir(),
      `KimnGenero-sqlite-seed-${Date.now()}-${Math.random()}.sqlite`
    );

    const repoA = new SqliteIndicatorRepository({
      dbPath,
      seedIndicators: [makeRawIndicator({ nombre: "Original" })],
      seedReports: [],
    });
    await repoA.initialize();

    const repoB = new SqliteIndicatorRepository({
      dbPath,
      seedIndicators: [makeRawIndicator({ id: "1", nombre: "New Seed" })],
      seedReports: [],
    });
    await repoB.initialize();

    expect(repoB.getIndicator("1")?.titulo).toBe("Original");
  });
});

