import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Indicator } from "@shared/types/indicator-domain";
import Hero from "./Hero";

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

describe("Hero", () => {
  it("renders title and metadata", () => {
    render(<Hero indicador={makeIndicator()} />);
    expect(screen.getByText("Indicador de Prueba")).toBeInTheDocument();
    expect(screen.getByText(/Indicador IND-001/i)).toBeInTheDocument();
  });
});
