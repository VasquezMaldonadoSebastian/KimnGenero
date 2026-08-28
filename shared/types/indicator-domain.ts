export interface Indicator {
  id: string;
  titulo: string;
  descripcion: string;
  iframeSrc: string;
  iframeHeight: number;
  tipo: "powerbi" | "placeholder";
  fuentes: string[];
  ultimaActualizacion: string;
  notasMetodologicas: string;
  unidad: string;
  codigo: string;
  objetivo: string;
  formula: string;
  formulaSimplificada: string | null;
  variables: string | null;
  frecuenciaMedicion: string;
  estado: string;
  lineaBase: string | number | null;
  dimension: string;
  area: string;
  fuenteAdministrativa: string;
  responsableCalculo: string;
  responsableVerificar: string;
  fechaCorte: string;
  instructivoCalculo: string;
}

export interface IndicatorCategory {
  id: string;
  label: string;
  icono: string;
  descripcion: string;
  indicadores: Indicator[];
}

export interface GroupedReport {
  id: string;
  titulo: string;
  descripcion: string;
  iframeSrc: string;
  tipo: string;
}

export interface RawIndicator {
  id?: string | number;
  nro?: string | number;
  ID?: string;
  "Nro indicador"?: string;
  codigo?: string;
  "Código del indicador"?: string;
  nombre?: string;
  "Nombre del indicador"?: string;
  descripcion?: string;
  "Descripción"?: string;
  objetivo?: string;
  "Objetivo del Indicador"?: string;
  formula?: string;
  "Formula del cálculo"?: string;
  formulaSimplificada?: string;
  "Formula simplificada"?: string;
  variables?: string;
  enlaceVisualizacion?: string | null;
  "Enlace visualizacion"?: string;
  unidadMedida?: string;
  "Unidad de medida"?: string;
  frecuenciaMedicion?: string;
  "Frecuencia de Medición"?: string;
  estado?: string;
  "Estado del Indicador"?: string;
  lineaBase?: string | number | null;
  dimension?: string;
  "Dimensión"?: string;
  area?: string;
  "Área"?: string;
  fechaCorte?: string | null;
  "Fecha de Corte"?: string;
  fuente?: string;
  "Fuente de Dato"?: string;
  fuenteAdministrativa?: string;
  "Fuente administrativa"?: string;
  responsableCalculo?: string;
  "Responsable de Calculo"?: string;
  responsableVerificar?: string;
  "Responsable de verificar"?: string;
  instructivoCalculo?: string;
  "Instructivo de Cálculo"?: string;
  notasMetodologicas?: string;
}

export interface RawGroupedReport {
  id: string;
  titulo: string;
  descripcion: string;
  iframeSrc: string;
  tipo: string;
}
