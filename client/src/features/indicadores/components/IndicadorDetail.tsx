import React, { lazy, Suspense } from "react";
import type { Indicator } from "@shared/types/indicator-domain";
import DashboardCard from "./detail/DashboardCard";
import Hero from "./detail/Hero";
import { getDimensionColor } from "../dimensionColors";
import TechnicalSheet from "./detail/TechnicalSheet";

// Lazy load FormulaBlock para reducir bundle size (KaTeX es pesado)
const FormulaBlock = lazy(() => import("./detail/FormulaBlock"));

interface IndicadorDetailProps {
  indicador: Indicator;
}

export default function IndicadorDetail({ indicador }: IndicadorDetailProps) {
  return (
    <div className="min-h-screen bg-surface-base">
      <div
        className="h-2 w-full"
        style={{ backgroundColor: getDimensionColor(indicador.dimension).text }}
      />
      <Hero indicador={indicador} />
      <div
        className="h-8 w-full bg-surface-base sm:h-12"
        style={{ clipPath: "ellipse(55% 100% at 50% 0%)", marginTop: "-1px" }}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <DashboardCard indicador={indicador} />
        <Suspense fallback={<div className="mb-3 rounded-lg bg-white p-4 shadow-sm">Cargando fórmula...</div>}>
          <FormulaBlock indicador={indicador} />
        </Suspense>
        <TechnicalSheet indicador={indicador} />
      </div>
    </div>
  );
}
