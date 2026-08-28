import type { Indicator, IndicatorCategory, RawIndicator } from "../../../shared/types/indicator-domain";

export type ResolveIframeResult = {
  iframeSrc: string;
  tipo: "powerbi" | "placeholder";
};

export function resolveIframe(item: RawIndicator): ResolveIframeResult {
  const enlace = item.enlaceVisualizacion || item["Enlace visualizacion"] || "";
  if (!enlace || enlace === "None" || enlace === "Visible" || enlace === "falta" || enlace === "-") {
    return { iframeSrc: "", tipo: "placeholder" };
  }
  if (!enlace.includes("powerbi")) {
    return { iframeSrc: "", tipo: "placeholder" };
  }
  return { iframeSrc: enlace, tipo: "powerbi" };
}

export function mapItem(item: RawIndicator): Indicator {
  const { iframeSrc, tipo } = resolveIframe(item);

  return {
    id: (item.id ?? item.nro ?? item.ID ?? item["Nro indicador"])?.toString() ?? "",
    codigo: item.codigo ?? item["Código del indicador"] ?? "",
    titulo: item.nombre ?? item["Nombre del indicador"] ?? "",
    descripcion: item.descripcion ?? item["Descripción"] ?? "",
    objetivo: item.objetivo ?? item["Objetivo del Indicador"] ?? "",

    formula: item.formula ?? item["Formula del cálculo"] ?? "",
    formulaSimplificada: item.formulaSimplificada ?? item["Formula simplificada"] ?? null,
    variables: item.variables ?? null,

    iframeSrc,
    iframeHeight: 600,
    tipo,

    unidad: item.unidadMedida ?? item["Unidad de medida"] ?? "",
    frecuenciaMedicion: item.frecuenciaMedicion ?? item["Frecuencia de Medición"] ?? "",
    estado: item.estado ?? item["Estado del Indicador"] ?? "",
    lineaBase: !item.lineaBase || item.lineaBase === "None" ? null : item.lineaBase,
    dimension: item.dimension ?? item["Dimensión"] ?? "",
    area: item.area ?? item["Área"] ?? "",
    fechaCorte: item.fechaCorte ?? item["Fecha de Corte"] ?? "",

    fuentes: item.fuente ? [item.fuente] : item["Fuente de Dato"] ? [item["Fuente de Dato"]] : [],
    fuenteAdministrativa: item.fuenteAdministrativa ?? item["Fuente administrativa"] ?? "",
    responsableCalculo: item.responsableCalculo ?? item["Responsable de Calculo"] ?? "",
    responsableVerificar: item.responsableVerificar ?? item["Responsable de verificar"] ?? "",
    instructivoCalculo: item.instructivoCalculo ?? item["Instructivo de Cálculo"] ?? "",

    ultimaActualizacion: item.fechaCorte ?? item["Fecha de Corte"] ?? "",
    notasMetodologicas: item.notasMetodologicas ?? item.formula ?? item["Formula del cálculo"] ?? "",
  };
}

export function slugifyCategory(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-*|-*$/g, "");
}

export function groupIndicatorsByArea(indicators: Indicator[]): IndicatorCategory[] {
  const categoryMap = new Map<string, IndicatorCategory>();
  for (const ind of indicators) {
    const area = ind.area;
    if (!area) continue;
    if (!categoryMap.has(area)) {
      categoryMap.set(area, {
        id: slugifyCategory(area),
        label: area,
        icono: "",
        descripcion: `Indicadores relacionados con ${area.toLowerCase()}`,
        indicadores: [],
      });
    }
    categoryMap.get(area)!.indicadores.push(ind);
  }
  return Array.from(categoryMap.values());
}

export function groupByCategory(data: RawIndicator[]): IndicatorCategory[] {
  return groupIndicatorsByArea(data.map(mapItem));
}
