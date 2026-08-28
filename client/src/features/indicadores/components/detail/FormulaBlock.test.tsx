import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Indicator } from "@shared/types/indicator-domain";
import FormulaBlock from "./FormulaBlock";

function makeIndicator(overrides: Partial<Indicator> = {}): Indicator {
  return {
    id: "1",
    titulo: "Indicador de Prueba",
    descripcion: "Descripcion",
    iframeSrc: "",
    iframeHeight: 600,
    tipo: "placeholder",
    fuentes: [],
    ultimaActualizacion: "",
    notasMetodologicas: "Notas",
    unidad: "Porcentaje",
    codigo: "IND-001",
    objetivo: "Objetivo",
    formula: "a*b",
    formulaSimplificada: null,
    variables: "a: numerador; b: denominador",
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

describe("FormulaBlock", () => {
  it("renders methodology header", () => {
    render(<FormulaBlock indicador={makeIndicator()} />);
    expect(screen.getByText(/Metodologia/i)).toBeInTheDocument();
  });
});
