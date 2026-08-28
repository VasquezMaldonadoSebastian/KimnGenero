import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../../createApp";
import { InMemoryIndicatorRepository } from "../../../repositories/InMemoryIndicatorRepository";
import { IndicatorService } from "../../../services/indicatorService";
import type { RawIndicator } from "../../../../../shared/types/indicator-domain";

process.env.NODE_ENV = "test";

async function makeApp() {
  const rawIndicators: RawIndicator[] = [
    {
      id: "1",
      codigo: "IND-001",
      nombre: "Indicador 1",
      descripcion: "Descripcion",
      objetivo: "Objetivo",
      area: "Salud",
      enlaceVisualizacion: "https://example.com/powerbi",
      fechaCorte: "2026-01-01",
    },
  ];

  const repo = new InMemoryIndicatorRepository({ indicatorsData: rawIndicators, reportsData: [] });
  await repo.initialize();
  const indicatorService = new IndicatorService(repo);
  return createApp({ indicatorService });
}

describe("GET /health", () => {
  it("returns a lightweight health payload", async () => {
    const app = await makeApp();

    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});

describe("GET /api/indicadores", () => {
  it("returns indicators list", async () => {
    const app = await makeApp();

    const res = await request(app).get("/api/indicadores");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].id).toBe("1");
  });

  it("supports conditional GET with ETag (304)", async () => {
    const app = await makeApp();

    const first = await request(app).get("/api/indicadores");
    expect(first.status).toBe(200);
    const etag = first.headers["etag"];
    expect(etag).toBeTruthy();

    const second = await request(app).get("/api/indicadores").set("If-None-Match", etag);
    expect(second.status).toBe(304);
  });

  it("supports optional pagination via limit/offset", async () => {
    const app = await makeApp();

    const res = await request(app).get("/api/indicadores?limit=1&offset=0");
    expect(res.status).toBe(200);
    expect(res.headers["x-total-count"]).toBe("1");
    expect(res.headers["x-limit"]).toBe("1");
    expect(res.headers["x-offset"]).toBe("0");
    expect(res.body.length).toBe(1);
    expect(res.body[0].id).toBe("1");
  });

  it("supports filtering by area query", async () => {
    const app = await makeApp();

    const ok = await request(app).get("/api/indicadores?area=Salud");
    expect(ok.status).toBe(200);
    expect(ok.body.length).toBe(1);

    const none = await request(app).get("/api/indicadores?area=Otra");
    expect(none.status).toBe(200);
    expect(none.body.length).toBe(0);
  });
});

describe("GET /api/indicadores/:id", () => {
  it("returns a single indicator", async () => {
    const app = await makeApp();

    const res = await request(app).get("/api/indicadores/1");
    expect(res.status).toBe(200);
    expect(res.body.id).toBe("1");
  });

  it("returns unified 404 error payload when missing", async () => {
    const app = await makeApp();

    const res = await request(app).get("/api/indicadores/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body.code).toBe("NOT_FOUND");
    expect(res.body.error).toBe("Indicator not found");
  });
});

describe("GET /api/categorias/:categoryId/indicadores", () => {
  it("rejects invalid categoryId", async () => {
    const app = await makeApp();

    const res = await request(app).get("/api/categorias/invalid%20id/indicadores");
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("VALIDATION_ERROR");
    expect(res.body.error).toBe("Invalid request parameters");
  });
});
