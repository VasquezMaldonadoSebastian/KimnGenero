import React from "react";
import type { Indicator } from "@shared/types/indicator-domain";
import { Download, Expand, Info, RefreshCw, Share2 } from "lucide-react";
import { useMemo, useRef } from "react";
import { toast } from "sonner";
import Reveal from "@/components/Reveal";

type DashboardCardProps = {
  indicador: Indicator;
};

export default function DashboardCard({ indicador }: DashboardCardProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const tieneIframe = Boolean(indicador.iframeSrc && indicador.iframeSrc.length > 0);
  const fuente = indicador.fuenteAdministrativa || "Por definir";
  const titulo = useMemo(() => {
    if (!tieneIframe) return "Visualizacion Pendiente";
    return indicador.titulo;
  }, [indicador.titulo, tieneIframe]);

  const handleRefresh = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    iframe.src = iframe.src;
    toast.success("Dashboard actualizado.");
  };

  const handleFullscreen = async () => {
    const iframe = iframeRef.current;
    if (!iframe?.requestFullscreen) {
      toast.info("Pantalla completa no disponible en este navegador.");
      return;
    }
    try {
      await iframe.requestFullscreen();
    } catch {
      toast.error("No fue posible activar pantalla completa.");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: indicador.titulo,
          text: indicador.descripcion,
          url: window.location.href,
        });
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("URL copiada al portapapeles.");
        return;
      }

      toast.info("Compartir no disponible en este navegador.");
    } catch {
      toast.error("No fue posible compartir el enlace.");
    }
  };

  const handleDownload = () => {
    toast.info("Descarga en desarrollo.");
  };

  return (
    <div className="mb-10 sm:mb-12">
      {/* Toolbar (sin caja/sombra): título + fuente + acciones */}
      <Reveal as="div" variant="up" className="mb-4 flex flex-col gap-3 border-b border-brand-pale pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className={`mt-1.5 w-3 h-3 rounded-full ${tieneIframe ? "bg-status-ok" : "bg-status-update"}`} />
          <div>
            <div className="font-semibold text-brand-dark" style={{ fontFamily: "Montserrat, sans-serif" }}>
              {titulo}
            </div>
            <div className="text-xs text-gray-500">Fuente: {fuente}</div>
          </div>
        </div>
        {tieneIframe && (
          <div className="flex gap-2">
            <button onClick={handleRefresh} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2 transition-colors hover:bg-brand-pale" title="Actualizar dashboard">
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
            <button onClick={handleFullscreen} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2 transition-colors hover:bg-brand-pale" title="Pantalla completa">
              <Expand className="w-4 h-4 text-gray-600" />
            </button>
            <button onClick={handleShare} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2 transition-colors hover:bg-brand-pale" title="Compartir">
              <Share2 className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}
      </Reveal>

      {/* Iframe sin marco: a borde completo sobre surface-base, sin sombra ni recuadro */}
      <div className="relative h-[72vh] min-h-[420px] w-full bg-surface-base md:h-[75vh] md:min-h-[700px]">
        {tieneIframe ? (
          <iframe
            ref={iframeRef}
            title="Dashboard"
            width="100%"
            height="100%"
            src={
              indicador.tipo === "powerbi"
                ? indicador.iframeSrc.includes("?")
                  ? `${indicador.iframeSrc}&navContentPaneEnabled=false`
                  : `${indicador.iframeSrc}?navContentPaneEnabled=false`
                : indicador.iframeSrc
            }
            frameBorder="0"
            allowFullScreen={true}
            className="block h-full w-full"
            style={{ display: "block" }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-pale">
              <span className="text-4xl">Dashboard</span>
            </div>
            <h3 className="mb-3 text-xl font-bold text-gray-600" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Visualizacion por Configurar
            </h3>
            <p className="mb-6 max-w-md text-center text-gray-500">
              Este indicador aun no cuenta con una visualizacion interactiva. La integracion del dashboard esta en proceso.
            </p>
            <div className="rounded-lg border border-brand-pale bg-white p-4 text-sm text-gray-600">
              <strong>Responsable de calculo:</strong> {indicador.responsableCalculo || "Por asignar"}
            </div>
          </div>
        )}
      </div>

      {tieneIframe && (
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2 text-xs text-gray-600">
            <Info className="w-4 h-4 text-brand-primary" />
            Los datos se actualizan siguiendo el cronograma institucional de indicadores.
          </span>
          <button onClick={handleDownload} className="inline-flex min-h-11 min-w-11 items-center justify-center self-start rounded-lg p-2 transition-colors hover:bg-gray-200" title="Descargar">
            <Download className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
}
