import React from "react";
import type { Indicator } from "@shared/types/indicator-domain";
import { toast } from "sonner";

function formatFechaCorte(fechaCorte: string) {
  if (!fechaCorte) return "Por definir";
  const dt = new Date(fechaCorte);
  if (Number.isNaN(dt.getTime())) return fechaCorte;
  return dt.toLocaleDateString("es-CL");
}

type HeroProps = {
  indicador: Indicator;
};

export default function Hero({ indicador }: HeroProps) {
  const handleExplore = () => {
    toast.info("Explorar datos: funcionalidad en desarrollo.");
  };

  const handleDownload = () => {
    toast.info("Descargar reporte: funcionalidad en desarrollo.");
  };

  return (
    <section className="border-b border-brand-pale bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-4 inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-brand-pale bg-brand-pale px-3 py-2 text-xs font-semibold uppercase tracking-wider text-brand-dark">
          <span>Indicador {indicador.codigo || "S/N"}</span>
          <span className="text-gray-400">|</span>
          <span>{indicador.area || "Sin categoria"}</span>
          <span className="text-gray-400">|</span>
          <span>Corte: {formatFechaCorte(indicador.fechaCorte)}</span>
        </div>

        <h1
          className="mb-4 text-3xl font-black leading-tight text-brand-dark sm:text-4xl md:text-5xl"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          {indicador.titulo}
        </h1>

        <p className="mb-6 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
          {indicador.descripcion}
        </p>

        {indicador.objetivo && (
          <div className="mb-8 max-w-2xl rounded-lg border border-brand-pale bg-brand-pale/60 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-primary">
              Objetivo
            </p>
            <p className="text-sm leading-relaxed text-gray-700">{indicador.objetivo}</p>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            onClick={handleExplore}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-primary px-6 py-3 font-bold text-white transition-colors hover:bg-brand-dark sm:w-auto"
            title="Explorar datos del indicador"
          >
            Explorar Datos
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border-2 border-brand-primary bg-transparent px-6 py-3 font-semibold text-brand-primary transition-colors hover:bg-brand-pale sm:w-auto"
            title="Descargar reporte en PDF"
          >
            Descargar Reporte
          </button>
        </div>
      </div>
    </section>
  );
}
