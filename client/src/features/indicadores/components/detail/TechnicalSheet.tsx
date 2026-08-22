import React from "react";
import type { Indicator } from "@shared/types/indicator-domain";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

type TechnicalSheetProps = {
  indicador: Indicator;
};

export default function TechnicalSheet({ indicador }: TechnicalSheetProps) {
  const [openFuentes, setOpenFuentes] = useState(true);
  const [openInfo, setOpenInfo] = useState(false);

  const cobertura = [indicador.area, indicador.dimension].filter(Boolean).join(" — ") || "Por definir";

  return (
    <section className="mb-10 sm:mb-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-brand-dark" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Ficha Tecnica
        </h2>
      </div>

      <div className="mb-3 overflow-hidden rounded-lg bg-white shadow-sm">
        <button
          type="button"
          className="flex min-h-11 w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-brand-pale sm:px-6"
          onClick={() => setOpenFuentes((v) => !v)}
          aria-expanded={openFuentes}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">DB</div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900">Fuente y Responsables</h3>
              <p className="text-xs text-gray-500">Sistemas de origen y roles</p>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openFuentes ? "rotate-180" : ""}`} />
        </button>

        {openFuentes && (
          <div className="space-y-3 border-t border-gray-100 px-4 py-4 sm:px-6">
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-1">Fuente administrativa</p>
              <p className="text-sm text-gray-700">{indicador.fuenteAdministrativa || "Por definir"}</p>
            </div>
            {indicador.fuentes && indicador.fuentes.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">Fuentes de datos</p>
                <ul className="space-y-1">
                  {indicador.fuentes.map((fuente, idx) => (
                    <li key={idx} className="text-sm text-gray-700">
                      • {fuente}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-1">Responsable de calculo</p>
              <p className="text-sm text-gray-700">{indicador.responsableCalculo || "Por asignar"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-1">Responsable de verificacion</p>
              <p className="text-sm text-gray-700">{indicador.responsableVerificar || "Por asignar"}</p>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <button
          type="button"
          className="flex min-h-11 w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-brand-pale sm:px-6"
          onClick={() => setOpenInfo((v) => !v)}
          aria-expanded={openInfo}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">i</div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900">Informacion Tecnica</h3>
              <p className="text-xs text-gray-500">Periodicidad y cobertura</p>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openInfo ? "rotate-180" : ""}`} />
        </button>

        {openInfo && (
          <div className="space-y-3 border-t border-gray-100 px-4 py-4 sm:px-6">
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Unidad</p>
              <p className="text-sm text-gray-600">{indicador.unidad || "Por definir"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Linea base</p>
              <p className="text-sm text-gray-600">{indicador.lineaBase ?? "Por definir"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Periodicidad</p>
              <p className="text-sm text-gray-600">{indicador.frecuenciaMedicion || "Por definir"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Cobertura</p>
              <p className="text-sm text-gray-600">{cobertura}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Estado</p>
              <p className="text-sm text-gray-600">{indicador.estado || "Por definir"}</p>
            </div>
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-3 mt-4">
              <p className="text-xs text-amber-900">
                <strong>Nota:</strong> La calidad de las cifras presentadas es de exclusiva responsabilidad de la institucion productora del indicador.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
