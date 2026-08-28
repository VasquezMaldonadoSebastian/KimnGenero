import { describe, expect, it } from "vitest";
import type { RawIndicator } from "../../../shared/types/indicator-domain";
import { groupByCategory, mapItem, resolveIframe } from "./normalizers";

describe("resolveIframe", () => {
  it("returns placeholder when empty or sentinel values", () => {
    const item: RawIndicator = { enlaceVisualizacion: "" };
    expect(resolveIframe(item)).toEqual({ iframeSrc: "", tipo: "placeholder" });

    const item2: RawIndicator = { enlaceVisualizacion: "None" };
    expect(resolveIframe(item2)).toEqual({ iframeSrc: "", tipo: "placeholder" });
  });

  it("returns Power BI type for valid Power BI urls", () => {
    const powerbi: RawIndicator = { enlaceVisualizacion: "https://foo.powerbi.com/view" };
    expect(resolveIframe(powerbi).tipo).toBe("powerbi");
  });

  it("uses placeholder for unsupported visualization providers", () => {
    const unsupported: RawIndicator = { enlaceVisualizacion: "https://example.com/views/x" };
    expect(resolveIframe(unsupported)).toEqual({ iframeSrc: "", tipo: "placeholder" });
  });
});

describe("mapItem", () => {
  it("maps heterogenous fields", () => {
    const raw: RawIndicator = {
      ID: "10",
      "Código del indicador": "COD-10",
      "Nombre del indicador": "Nombre",
      "Descripción": "Desc",
      "Área": "Area X",
      "Dimensión": "Dim X",
      "Unidad de medida": "Unidad",
      "Frecuencia de Medición": "Mensual",
      "Estado del Indicador": "Oficializado",
      "Fuente de Dato": "Fuente 1",
      "Formula del cálculo": "a*b",
      "Fecha de Corte": "2026-01-01",
    };

    const mapped = mapItem(raw);
    expect(mapped.id).toBe("10");
    expect(mapped.codigo).toBe("COD-10");
    expect(mapped.titulo).toBe("Nombre");
    expect(mapped.descripcion).toBe("Desc");
    expect(mapped.area).toBe("Area X");
    expect(mapped.dimension).toBe("Dim X");
    expect(mapped.fuentes).toEqual(["Fuente 1"]);
  });

  it("uses placeholder iframe when missing link", () => {
    const raw: RawIndicator = { id: "1", nombre: "X", area: "A", enlaceVisualizacion: "" };
    const mapped = mapItem(raw);
    expect(mapped.tipo).toBe("placeholder");
    expect(mapped.iframeSrc).toBe("");
  });
});

describe("groupByCategory", () => {
  it("groups by area and ignores empty category", () => {
    const data: RawIndicator[] = [
      { id: "1", nombre: "A", area: "Salud" },
      { id: "2", nombre: "B", area: "Salud" },
      { id: "3", nombre: "C", area: "" },
    ];

    const categories = groupByCategory(data);
    expect(categories.length).toBe(1);
    expect(categories[0].label).toBe("Salud");
    expect(categories[0].indicadores.length).toBe(2);
  });
});
