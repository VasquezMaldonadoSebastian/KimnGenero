import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import type { GroupedReport } from "@shared/types/indicator-domain";
import { apiGetJson } from "@/lib/apiClient";

export default function EstadoAgrupado() {
  const [reports, setReports] = useState<GroupedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await apiGetJson<GroupedReport[]>("/api/reportes-agrupados");
        setReports(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const report = reports.find((r) => r.id === "estado-agrupado") ?? reports[0] ?? null;

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-muted flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-surface-muted flex items-center justify-center text-center">
        <div>
          <div className="text-6xl mb-4">!</div>
          <h1 className="text-2xl font-bold mb-2">Error al cargar reportes</h1>
          <p>{error || "No se encontraron reportes agrupados."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="bg-white border-b border-brand-pale">
        <div className="container py-8 sm:py-10">
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-gray-400">
            <a href="/" className="hover:text-brand-primary">
              Inicio
            </a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-brand-primary font-medium">Estado Agrupado</span>
          </nav>
          <h1 className="mb-2 text-3xl font-black text-brand-dark">
            Estado Agrupado de Indicadores
          </h1>
          <p className="max-w-2xl text-gray-600">
            Visualiza el estado consolidado de los indicadores por areas estrategicas y
            dimensiones.
          </p>
        </div>
      </div>

      <div className="container py-6 sm:py-8">
        <div className="mb-8 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="p-3 sm:p-4">
            <div className="w-full overflow-hidden rounded-xl bg-gray-50">
              <iframe
                src={report.iframeSrc}
                title={report.titulo}
                width="100%"
                height="780"
                frameBorder="0"
                allowFullScreen={true}
                className="h-[78vh] min-h-[640px] w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
