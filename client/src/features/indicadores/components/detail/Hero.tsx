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
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-dark via-brand-dark to-brand-primary py-12 sm:py-16">
      <div className="pointer-events-none absolute -top-48 -right-24 hidden h-[500px] w-[500px] rounded-full bg-white/4 sm:block" />
      <div className="pointer-events-none absolute -bottom-24 left-12 hidden h-[300px] w-[300px] rounded-full bg-white/4 sm:block" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-6 inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
          <span>Indicador {indicador.codigo || "S/N"}</span>
          <span className="text-white/60">|</span>
          <span>{indicador.area || "Sin categoria"}</span>
          <span className="text-white/60">|</span>
          <span>Corte: {formatFechaCorte(indicador.fechaCorte)}</span>
        </div>

        <h1
          className="mb-4 text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          {indicador.titulo}
        </h1>

        <p className="mb-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
          {indicador.descripcion}
        </p>

        {indicador.objetivo && (
          <div className="mb-8 max-w-2xl rounded-lg border border-white/15 bg-white/10 p-4 text-white/90">
            <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
              Objetivo
            </p>
            <p className="text-sm leading-relaxed">{indicador.objetivo}</p>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            onClick={handleExplore}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-6 py-3 font-bold text-brand-dark transition-all hover:shadow-lg sm:w-auto"
            title="Explorar datos del indicador"
          >
            Explorar Datos
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border-2 border-white/40 bg-transparent px-6 py-3 font-semibold text-white transition-all hover:bg-white/12 sm:w-auto"
            title="Descargar reporte en PDF"
          >
            Descargar Reporte
          </button>
        </div>
      </div>
    </section>
  );
}
