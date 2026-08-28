import React, { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
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
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center text-center">
        <div>
          <div className="text-6xl mb-4">!</div>
          <h1 className="text-2xl font-bold mb-2">Error al cargar reportes</h1>
          <p>{error || "No se encontraron reportes agrupados."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-base">
      <PageHeader
        breadcrumb={[{ label: "Estado Agrupado" }]}
        title="Estado Agrupado de Indicadores"
        subtitle="Visualiza el estado consolidado de los indicadores por áreas estratégicas y dimensiones."
      />

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
