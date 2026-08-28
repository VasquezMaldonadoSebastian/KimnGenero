/**
 * dimensionColors.ts — Punto único de color por dimensión (tema global KimnGenero).
 *
 * Familias canónicas alineadas con page2-resources.ts (íconos oficiales por dimensión).
 * Cada dimensión = triplete { bg (pastel), border (familia clara), text (fuerte) }:
 *  - text sobre bg pastel: contraste AA >= 4.5:1
 *  - text como relleno con texto blanco encima: contraste AA >= 4.5:1
 *
 * Uso: solo este módulo decide el color de una dimensión. Prohibido hex sueltos
 * de dimensión en componentes (Fase 4/5 de NOTAS_TEMA_GLOBAL.md).
 */
import { page2Resources, type Page2ResourceCard } from "@/lib/page2-resources";

export type DimColor = {
  bg: string;
  border: string;
  text: string;
};

/** Claves normalizadas (sin acentos, minúsculas) — mismas reglas que producía Indicadores.tsx */
export const DIMENSION_COLORS: Record<string, DimColor> = {
  "1.- institucionalizacion": {
    bg: "#E8F2FF",
    border: "#B3D9FF",
    text: "#173F8A",
  },
  "2.- violencia de genero": {
    bg: "#D1FAE5",
    border: "#A7F3D0",
    text: "#065F46",
  },
  "3.- corresponsabilidad en los cuidados": {
    bg: "#FEE2E2",
    border: "#FECACA",
    text: "#B91C1C",
  },
  "4.- trayectorias laborales": {
    bg: "#F1F1F3",
    border: "#D6D6DA",
    text: "#3F3F46",
  },
  "5.- trayectorias educativas": {
    bg: "#EDE9FE",
    border: "#C4B5FD",
    text: "#5B21B6",
  },
  "6.- modelo educativo con perspectiva de genero": {
    bg: "#FFEDD5",
    border: "#FED7AA",
    text: "#C2410C",
  },
  "7.- participacion equilibrada en la divulgacion cientifica": {
    bg: "#FEF3C7",
    border: "#FDE68A",
    text: "#92400E",
  },
  "8.- visibilizacion del aporte de las mujeres en las areas de conocimiento": {
    bg: "#EAEAEA",
    border: "#C9C9C9",
    text: "#232323",
  },
};

export const DEFAULT_COLOR: DimColor = {
  bg: "#F0F9FF",
  border: "#BAE6FD",
  text: "#0369A1",
};

export const normalizeDimensionKey = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

/** Triplete de color para una dimensión (por nombre normalizado). */
export function getDimensionColor(dimension: string | undefined): DimColor {
  if (!dimension) return DEFAULT_COLOR;
  return DIMENSION_COLORS[normalizeDimensionKey(dimension)] ?? DEFAULT_COLOR;
}

/** Recurso oficial (ícono + color) de la dimensión, si existe en page2-resources. */
export function getDimensionResource(
  dimension: string | undefined
): Page2ResourceCard | undefined {
  if (!dimension) return undefined;
  const key = normalizeDimensionKey(dimension);
  return page2Resources.find(
    (resource) => normalizeDimensionKey(resource.dimension) === key
  );
}