import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Indicator } from "@shared/types/indicator-domain";
import TechnicalSheet from "./TechnicalSheet";

function makeIndicator(overrides: Partial<Indicator> = {}): Indicator {
  return {
    id: "1",
    titulo: "Indicador de Prueba",
    descripcion: "Descripcion",
    iframeSrc: "",
    iframeHeight: 600,
    tipo: "placeholder",
    fuentes: ["Fuente 1"],
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
    fuenteAdministrativa: "Fuente Admin",
    responsableCalculo: "Resp",
    responsableVerificar: "Resp V",
    fechaCorte: "2026-01-01",
    instructivoCalculo: "",
    ...overrides,
  };
}

describe("TechnicalSheet", () => {
  it("renders technical sheet header", () => {
    render(<TechnicalSheet indicador={makeIndicator()} />);
    expect(screen.getByText(/Ficha Tecnica/i)).toBeInTheDocument();
  });
});
