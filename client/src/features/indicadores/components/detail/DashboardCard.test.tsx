import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Indicator } from "@shared/types/indicator-domain";
import DashboardCard from "./DashboardCard";

function makeIndicator(overrides: Partial<Indicator> = {}): Indicator {
  return {
    id: "1",
    titulo: "Indicador de Prueba",
    descripcion: "Descripcion",
    iframeSrc: "https://example.com/embed",
    iframeHeight: 600,
    tipo: "powerbi",
    fuentes: [],
    ultimaActualizacion: "",
    notasMetodologicas: "",
    unidad: "Porcentaje",
    codigo: "IND-001",
    objetivo: "Objetivo",
    formula: "",
    formulaSimplificada: null,
    variables: null,
    frecuenciaMedicion: "Anual",
    estado: "Activo",
    lineaBase: null,
    dimension: "Dimension",
    area: "Salud",
    fuenteAdministrativa: "Fuente",
    responsableCalculo: "Resp",
    responsableVerificar: "Resp V",
    fechaCorte: "2026-01-01",
    instructivoCalculo: "",
    ...overrides,
  };
}

describe("DashboardCard", () => {
  it("renders dashboard iframe when iframeSrc exists", () => {
    render(<DashboardCard indicador={makeIndicator()} />);
    expect(screen.getByTitle("Dashboard")).toBeInTheDocument();
  });
});
