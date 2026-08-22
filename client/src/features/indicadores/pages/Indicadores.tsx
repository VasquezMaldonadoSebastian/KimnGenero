/*
 * Indicadores - Listado de indicadores
 * Design: Grid de tarjetas con enlaces a cada indicador individual
 * Colors: tokens del tema global (surface-muted bg, white cards, brand-primary accents)
 */

import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { Filter, Search } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import type { Indicator } from "@shared/types/indicator-domain";
import { apiGetJson } from "@/lib/apiClient";
import { getDimensionColor, getDimensionResource } from "../dimensionColors";
import { useIndicatorsContext } from "../../../contexts/IndicatorsContext";

export default function Indicadores() {
  const { indicators, loading, error } = useIndicatorsContext();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterArea, setFilterArea] = useState("todos");
  const [filterDimension, setFilterDimension] = useState("todos");
  const [visibleIndicators, setVisibleIndicators] = useState<Indicator[]>([]);
  const [loadingFiltered, setLoadingFiltered] = useState(false);
  const [filtersReady, setFiltersReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dimensionParam = params.get("dimension");
    const areaParam = params.get("area");
    if (dimensionParam) setFilterDimension(dimensionParam);
    if (areaParam) setFilterArea(areaParam);
  }, []);

  useEffect(() => {
    const loadFiltered = async () => {
      try {
        setLoadingFiltered(true);
        const qs = new URLSearchParams();
        if (filterArea !== "todos") qs.set("area", filterArea);
        if (filterDimension !== "todos") qs.set("dimension", filterDimension);

        const path = qs.toString() ? `/api/indicadores?${qs.toString()}` : "/api/indicadores";
        const data = await apiGetJson<Indicator[]>(path);
        setVisibleIndicators(data);
      } catch {
        setVisibleIndicators(indicators);
      } finally {
        setLoadingFiltered(false);
        setFiltersReady(true);
      }
    };

    if (!loading && !error) {
      loadFiltered();
    }
  }, [filterArea, filterDimension, indicators, loading, error]);

  const areas = useMemo(() => {
    const uniqueAreas = Array.from(
      new Set(indicators.map((ind) => ind.area).filter((area): area is string => !!area))
    ).sort();
    return ["todos", ...uniqueAreas];
  }, [indicators]);

  const dimensiones = useMemo(() => {
    const uniqueDimensions = Array.from(
      new Set(indicators.map((ind) => ind.dimension).filter((d): d is string => !!d))
    ).sort();
    return ["todos", ...uniqueDimensions];
  }, [indicators]);

  const filtrados = useMemo(() => {
    const base = filtersReady || loadingFiltered ? visibleIndicators : indicators;
    const q = searchTerm.trim().toLowerCase();
    if (!q) return base;

    return base.filter((ind) => {
      return (
        ind.titulo?.toLowerCase().includes(q) ||
        ind.codigo?.toLowerCase().includes(q) ||
        ind.descripcion?.toLowerCase().includes(q)
      );
    });
  }, [visibleIndicators, indicators, searchTerm, filtersReady, loadingFiltered]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterArea("todos");
    setFilterDimension("todos");
    setLocation("/indicadores");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-muted flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-muted flex items-center justify-center text-center">
        <div>
          <div className="text-6xl mb-4">!</div>
          <h1 className="text-2xl font-bold mb-2">Error al cargar</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-muted">
      <PageHeader
        breadcrumb={[{ label: "Indicadores" }]}
        title="Sistema de Indicadores de Género"
        subtitle={`Explora los ${indicators.length} indicadores del observatorio institucional.`}
      />

      <div className="container py-6 sm:py-8">
        {loadingFiltered && <div className="mb-4 text-sm text-gray-500">Cargando filtros...</div>}

        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1.35fr)_minmax(0,0.8fr)_minmax(0,0.8fr)]">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-brand-pale py-3 pl-10 pr-4 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="min-h-11 flex-1 rounded-lg border border-brand-pale px-4 py-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            >
              <option value="todos">Todas las areas</option>
              {areas.filter((a) => a !== "todos").map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterDimension}
              onChange={(e) => setFilterDimension(e.target.value)}
              className="min-h-11 flex-1 rounded-lg border border-brand-pale px-4 py-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            >
              <option value="todos">Todas las dimensiones</option>
              {dimensiones.filter((d) => d !== "todos").map((dimension) => (
                <option key={dimension} value={dimension}>
                  {dimension}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filtrados.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtrados.map((indicador: Indicator) => {
              const color = getDimensionColor(indicador.dimension);
              const resource = getDimensionResource(indicador.dimension);
              return (
                <Link key={indicador.id} href={`/indicador/${indicador.id}`} className="group h-full">
                  <div className="h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg">
                    <div
                      className="p-4"
                      style={{
                        backgroundColor: color.bg,
                        borderBottom: `2px solid ${color.border}`,
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span
                            className="flex h-11 w-11 items-center justify-center rounded-xl shadow-sm"
                            style={{ backgroundColor: color.text }}
                            aria-hidden="true"
                          >
                            {resource?.iconSrc ? (
                              <img
                                src={resource.iconSrc}
                                alt=""
                                className="h-8 w-8 object-contain"
                              />
                            ) : (
                              <span className="text-[11px] font-black text-white">{indicador.id}</span>
                            )}
                          </span>
                          <span
                            className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide"
                            style={{ backgroundColor: color.text, color: "white" }}
                          >
                            {indicador.codigo}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-gray-500">
                          {indicador.frecuenciaMedicion}
                        </span>
                      </div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">
                        Área
                      </p>
                      <p className="text-xs text-gray-600">{indicador.area}</p>
                      <p className="mt-3 text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">
                        Dimensión
                      </p>
                      <p className="text-xs text-gray-600">{indicador.dimension}</p>
                    </div>
                    <div className="p-5">
                      <h3 className="mb-2 text-xl font-black leading-tight text-brand-dark group-hover:text-brand-primary">
                        {indicador.titulo}
                      </h3>
                      <p className="mb-4 text-sm text-gray-600 line-clamp-3">
                        {indicador.descripcion}
                      </p>
                      <div
                        className="flex min-h-11 w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
                        style={{ backgroundColor: color.text }}
                      >
                        Ver indicador
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-brand-pale bg-white py-16 text-center">
            <div className="text-5xl mb-4">?</div>
            <h3 className="text-lg font-bold mb-2">No se encontraron indicadores</h3>
            <button
              onClick={handleClearFilters}
              className="mt-4 min-h-11 rounded-lg bg-brand-primary px-6 py-3 font-semibold text-white"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
