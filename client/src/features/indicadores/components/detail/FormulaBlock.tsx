import React from "react";
import type { Indicator } from "@shared/types/indicator-domain";
import { ChevronDown, ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

type FormulaBlockProps = {
  indicador: Indicator;
};

function safeFormulaForDisplay(formula: string) {
  return formula.replace(/\*/g, "\\times");
}

export default function FormulaBlock({ indicador }: FormulaBlockProps) {
  const [open, setOpen] = useState(true);

  const tieneInstructivo =
    Boolean(indicador.instructivoCalculo) &&
    indicador.instructivoCalculo !== "falta" &&
    indicador.instructivoCalculo !== "A la espera de validacion" &&
    indicador.instructivoCalculo !== "-" &&
    indicador.instructivoCalculo !== "None";

  const instructivoEsUrl = tieneInstructivo && indicador.instructivoCalculo.startsWith("http");

  const formulaMostrar = indicador.formulaSimplificada || indicador.formula || "Por definir";
  const formulaLarga = formulaMostrar.length > 150;

  const variablesParsed = useMemo(() => {
    const raw = indicador.variables;
    if (!raw) return [];
    return raw
      .split(";")
      .map((chunk) => chunk.trim())
      .filter(Boolean)
      .map((variable) => {
        const [simbolo, ...resto] = variable.split(":");
        const descripcion = resto.join(":").trim();
        return { simbolo: simbolo?.trim() ?? "", descripcion };
      })
      .filter((v) => v.simbolo && v.descripcion);
  }, [indicador.variables]);

  return (
    <div className="mb-3 overflow-hidden rounded-lg bg-white shadow-sm">
      <button
        type="button"
        className="flex min-h-11 w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-brand-pale sm:px-6"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-pale text-brand-primary">
            fx
          </div>
          <div className="text-left">
            <h3 className="font-bold text-brand-dark">Metodologia</h3>
            <p className="text-xs text-gray-500">Formula de calculo e instructivo</p>
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="space-y-4 border-t border-gray-100 px-4 py-4 sm:px-6">
          <div>
            <p className="mb-2 text-xs font-semibold text-gray-500">FORMULA MATEMATICA</p>
            <div className="overflow-hidden rounded-lg border border-indigo-200 bg-indigo-50 p-4">
              {formulaLarga && (
                <p className="mb-2 font-semibold text-indigo-900">Nota: formula simplificada</p>
              )}
              <div className="overflow-x-auto">
                <Latex>{`$$${safeFormulaForDisplay(formulaMostrar)}$$`}</Latex>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold text-gray-500">VARIABLES</p>
            {variablesParsed.length > 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="mb-3 text-sm font-bold text-brand-dark">Variables de la formula:</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  {variablesParsed.map((v, index) => (
                    <li key={index} className="flex flex-col gap-2 rounded-md border border-gray-100 bg-gray-50 p-3 sm:flex-row sm:items-center">
                      <span className="min-w-[60px] rounded bg-brand-pale px-3 py-1 text-center font-bold text-brand-primary">
                        <Latex>{`$${v.simbolo}$`}</Latex>
                      </span>
                      <span className="leading-relaxed">{v.descripcion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="mb-3 text-sm font-bold text-brand-dark">Donde:</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-3">
                    <span className="font-bold text-brand-primary">-</span>
                    <span>
                      <strong>Numerador:</strong> Cantidad de elementos que cumplen el criterio de evaluacion.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-brand-primary">-</span>
                    <span>
                      <strong>Denominador:</strong> Total de elementos evaluados en el periodo.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-brand-primary">-</span>
                    <span>
                      <strong>x 100:</strong> Factor de conversion a porcentaje (%).
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {indicador.notasMetodologicas && (
            <div>
              <p className="mb-2 text-xs font-semibold text-gray-500">NOTAS METODOLOGICAS</p>
              <p className="text-sm leading-relaxed text-gray-600">{indicador.notasMetodologicas}</p>
            </div>
          )}

          {tieneInstructivo ? (
            <div>
              <p className="mb-2 text-xs font-semibold text-gray-500">INSTRUCTIVO DETALLADO</p>
              {instructivoEsUrl ? (
                <a
                  href={indicador.instructivoCalculo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline"
                >
                  Ver documento de instructivo <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <p className="text-sm italic text-gray-600">{indicador.instructivoCalculo}</p>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-amber-300 bg-amber-100 p-3 text-xs text-amber-800">
              <p>
                <strong>Instructivo:</strong> En proceso de validacion
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
