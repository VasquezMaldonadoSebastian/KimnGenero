/*
 * IndicadorPage - Pagina dinamica de indicador individual
 * Carga datos de la API y renderiza con el componente IndicadorDetail
 */

import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft } from "lucide-react";
import type { Indicator } from "@shared/types/indicator-domain";
import { apiGetJson } from "@/lib/apiClient";
import Reveal from "@/components/Reveal";
import IndicadorDetail from "../components/IndicadorDetail";

export default function IndicadorPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [indicador, setIndicador] = useState<Indicator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIndicador = async () => {
      try {
        setLoading(true);
        const data = await apiGetJson<Indicator>(`/api/indicadores/${id}`);
        setIndicador(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    loadIndicador();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-base">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mb-4" />
          <p className="text-gray-600">Cargando indicador...</p>
        </div>
      </div>
    );
  }

  if (error || !indicador) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-base">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">!</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar</h1>
          <p className="text-gray-600 mb-6">{error || "Indicador no encontrado"}</p>
          <button
            onClick={() => navigate("/indicadores")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Indicadores
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="sticky top-[72px] z-40 border-b border-gray-200 bg-white/95 backdrop-blur sm:top-16">
        <Reveal as="div" variant="down" className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <button
            onClick={() => navigate("/indicadores")}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 py-2 font-semibold text-brand-primary transition-colors hover:bg-brand-pale hover:text-brand-dark"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Indicadores
          </button>
        </Reveal>
      </div>

      <IndicadorDetail indicador={indicador} />
    </>
  );
}
