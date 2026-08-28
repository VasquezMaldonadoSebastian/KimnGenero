import { describe, expect, it } from "vitest";
import indicadoresData from "../../../data/indicadores.json";
import { loadIndicatorSeed } from "./indicatorSeed";

describe("loadIndicatorSeed", () => {
  it("accepts the current object-shaped seed", () => {
    const parsed = loadIndicatorSeed(indicadoresData);

    expect(parsed.format).toBe("object");
    expect(parsed.rawIndicators).toHaveLength(18);
    expect(parsed.rawReports).toHaveLength(1);
  });

  it("accepts the legacy array-shaped seed", () => {
    const parsed = loadIndicatorSeed(indicadoresData.indicadores);

    expect(parsed.format).toBe("array");
    expect(parsed.rawIndicators).toHaveLength(18);
    expect(parsed.rawReports).toHaveLength(0);
  });

  it("rejects indicator entries missing critical fields", () => {
    expect(() =>
      loadIndicatorSeed([
        {
          id: "1",
          nombre: "Sin datos",
          descripcion: "Descripcion",
        },
      ])
    ).toThrow(/Missing required indicator fields/i);
  });

  it("rejects report entries missing required fields", () => {
    expect(() =>
      loadIndicatorSeed({
        indicadores: indicadoresData.indicadores,
        reportesAgrupados: [{ id: "1", titulo: "R" }],
      })
    ).toThrow(/Missing required report fields/i);
  });
});
