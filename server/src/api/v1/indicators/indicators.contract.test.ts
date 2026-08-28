import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../../createApp";
import type { RawGroupedReport, RawIndicator } from "../../../../../shared/types/indicator-domain";
import { InMemoryIndicatorRepository } from "../../../repositories/InMemoryIndicatorRepository";
import { SqliteIndicatorRepository } from "../../../repositories/SqliteIndicatorRepository";
import { IndicatorService } from "../../../services/indicatorService";
import path from "node:path";
import os from "node:os";

process.env.NODE_ENV = "test";

function makeSeed() {
  const rawIndicators: RawIndicator[] = [
    {
      id: "1",
      codigo: "IND-001",
      nombre: "Indicador 1",
      descripcion: "Descripcion 1",
      objetivo: "Objetivo 1",
      area: "Salud",
      dimension: "Dim 1",
      enlaceVisualizacion: "https://example.com/powerbi",
      fechaCorte: "2026-01-01",
    },
    {
      id: "2",
      codigo: "IND-002",
      nombre: "Indicador 2",
      descripcion: "Descripcion 2",
      objetivo: "Objetivo 2",
      area: "Educacion",
      dimension: "Dim 2",
      enlaceVisualizacion: "",
      fechaCorte: "2026-01-02",
    },
  ];

  const rawReports: RawGroupedReport[] = [
    {
      id: "r1",
      titulo: "Reporte 1",
      descripcion: "Descripcion",
      iframeSrc: "https://example.com/report",
      tipo: "powerbi",
    },
  ];

  return { rawIndicators, rawReports };
}

async function makeApps() {
  const { rawIndicators, rawReports } = makeSeed();

  const memoryRepo = new InMemoryIndicatorRepository({
    indicatorsData: rawIndicators,
    reportsData: rawReports,
  });
  await memoryRepo.initialize();

  const sqliteRepo = new SqliteIndicatorRepository({
    dbPath: path.join(os.tmpdir(), `KimnGenero-contract-${Date.now()}-${Math.random()}.sqlite`),
    seedIndicators: rawIndicators,
    seedReports: rawReports,
  });
  await sqliteRepo.initialize();

  const memoryApp = createApp({ indicatorService: new IndicatorService(memoryRepo) });
  const sqliteApp = createApp({ indicatorService: new IndicatorService(sqliteRepo) });

  return { memoryApp, sqliteApp };
}

function sortById<T extends { id: string }>(items: T[]) {
  return [...items].sort((a, b) => a.id.localeCompare(b.id));
}

describe("Repository contract (memory vs sqlite)", () => {
  it("GET /api/indicadores returns same payload", async () => {
    const { memoryApp, sqliteApp } = await makeApps();

    const mem = await request(memoryApp).get("/api/indicadores");
    const sql = await request(sqliteApp).get("/api/indicadores");

    expect(mem.status).toBe(200);
    expect(sql.status).toBe(200);
    expect(sortById(mem.body)).toEqual(sortById(sql.body));
  });

  it("GET /api/indicadores supports ?area filter consistently", async () => {
    const { memoryApp, sqliteApp } = await makeApps();

    const mem = await request(memoryApp).get("/api/indicadores?area=Salud");
    const sql = await request(sqliteApp).get("/api/indicadores?area=Salud");

    expect(mem.status).toBe(200);
    expect(sql.status).toBe(200);
    expect(mem.body.length).toBe(1);
    expect(sql.body.length).toBe(1);
    expect(mem.body[0].id).toBe("1");
    expect(sql.body[0].id).toBe("1");
  });

  it("GET /api/indicadores supports optional pagination consistently", async () => {
    const { memoryApp, sqliteApp } = await makeApps();

    const mem = await request(memoryApp).get("/api/indicadores?limit=1&offset=0");
    const sql = await request(sqliteApp).get("/api/indicadores?limit=1&offset=0");

    expect(mem.status).toBe(200);
    expect(sql.status).toBe(200);
    expect(mem.headers["x-total-count"]).toBe(sql.headers["x-total-count"]);
    expect(mem.headers["x-limit"]).toBe(sql.headers["x-limit"]);
    expect(mem.headers["x-offset"]).toBe(sql.headers["x-offset"]);
    expect(mem.body.length).toBe(1);
    expect(sql.body.length).toBe(1);
    expect(mem.body[0].id).toBe(sql.body[0].id);
  });

  it("GET /api/indicadores/:id returns same payload", async () => {
    const { memoryApp, sqliteApp } = await makeApps();

    const mem = await request(memoryApp).get("/api/indicadores/1");
    const sql = await request(sqliteApp).get("/api/indicadores/1");

    expect(mem.status).toBe(200);
    expect(sql.status).toBe(200);
    expect(mem.body).toEqual(sql.body);
  });

  it("GET /api/indicadores/:id missing uses unified 404 payload", async () => {
    const { memoryApp, sqliteApp } = await makeApps();

    const mem = await request(memoryApp).get("/api/indicadores/does-not-exist");
    const sql = await request(sqliteApp).get("/api/indicadores/does-not-exist");

    expect(mem.status).toBe(404);
    expect(sql.status).toBe(404);
    expect(mem.body).toEqual(sql.body);
    expect(mem.body.code).toBe("NOT_FOUND");
    expect(mem.body.error).toBe("Indicator not found");
    expect(mem.body.message).toBe("Indicator not found");
  });

  it("GET /api/categorias returns same payload (order-insensitive)", async () => {
    const { memoryApp, sqliteApp } = await makeApps();

    const mem = await request(memoryApp).get("/api/categorias");
    const sql = await request(sqliteApp).get("/api/categorias");

    expect(mem.status).toBe(200);
    expect(sql.status).toBe(200);
    expect(sortById(mem.body)).toEqual(sortById(sql.body));
  });

  it("GET /api/categorias/:categoryId/indicadores returns same payload", async () => {
    const { memoryApp, sqliteApp } = await makeApps();

    const mem = await request(memoryApp).get("/api/categorias/salud/indicadores");
    const sql = await request(sqliteApp).get("/api/categorias/salud/indicadores");

    expect(mem.status).toBe(200);
    expect(sql.status).toBe(200);
    expect(sortById(mem.body)).toEqual(sortById(sql.body));
  });

  it("GET /api/categorias/:categoryId/indicadores rejects invalid categoryId consistently", async () => {
    const { memoryApp, sqliteApp } = await makeApps();

    const mem = await request(memoryApp).get("/api/categorias/invalid%20id/indicadores");
    const sql = await request(sqliteApp).get("/api/categorias/invalid%20id/indicadores");

    expect(mem.status).toBe(400);
    expect(sql.status).toBe(400);
    expect(mem.body).toEqual(sql.body);
    expect(mem.body.code).toBe("VALIDATION_ERROR");
    expect(mem.body.error).toBe("Invalid request parameters");
    expect(mem.body.message).toBe("Invalid request parameters");
  });

  it("GET /api/reportes-agrupados returns same payload (order-insensitive)", async () => {
    const { memoryApp, sqliteApp } = await makeApps();

    const mem = await request(memoryApp).get("/api/reportes-agrupados");
    const sql = await request(sqliteApp).get("/api/reportes-agrupados");

    expect(mem.status).toBe(200);
    expect(sql.status).toBe(200);
    expect(sortById(mem.body)).toEqual(sortById(sql.body));
  });
});
