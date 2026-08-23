/**
 * PageHeader — Encabezado de página compartido (tema global KimnGenero).
 * Normaliza el "inicio de página" de TODAS las páginas interiores:
 * white surface + borde brand-pale + breadcrumb + (eyebrow) + h1 + subtítulo.
 * Opcional: banda superior de color (bandColor) — único uso de color de fondo
 * por dimensión en el detalle de indicador individual (NOTAS_TEMA_GLOBAL.md §3).
 */
import { Fragment, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import Reveal from "@/components/Reveal";

type Crumb = { label: string; href?: string };

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  /** Migas sin "Inicio" (se antepone automáticamente). Nivel actual = último ítem sin href. */
  breadcrumb?: Crumb[];
  /** Kicker opcional (ícono + etiqueta) para páginas de contenido/documentación. */
  eyebrow?: { icon?: ReactNode; label: string };
  /** Banda superior (detalle de indicador): hex sólido de la dimensión. */
  bandColor?: string;
};

export default function PageHeader({
  title,
  subtitle,
  breadcrumb,
  eyebrow,
  bandColor,
}: PageHeaderProps) {
  const crumbs =
    breadcrumb && breadcrumb.length > 0
      ? [{ label: "Inicio", href: "/" }, ...breadcrumb]
      : undefined;

  return (
    <Reveal as="div" variant="down" className="border-b border-brand-pale bg-white">
      {bandColor && <div className="h-2 w-full" style={{ backgroundColor: bandColor }} />}
      <div className="container py-8 sm:py-10">{crumbs && (
          <nav
            className="mb-4 flex items-center gap-1.5 text-xs text-gray-400"
            aria-label="Miga de pan"
          >
            {crumbs.map((c, i) => (
              <Fragment key={`${c.label}-${i}`}>
                {i > 0 && <ChevronRight className="h-3 w-3" />}
                {c.href ? (
                  <a href={c.href} className="transition-colors hover:text-brand-primary">
                    {c.label}
                  </a>
                ) : (
                  <span className="font-medium text-brand-primary">{c.label}</span>
                )}
              </Fragment>
            ))}
          </nav>
        )}

        {eyebrow && (
          <div className="mb-2 flex items-center gap-2">
            {eyebrow.icon}
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
              {eyebrow.label}
            </span>
          </div>
        )}

        <h1 className="mb-2 text-3xl font-black text-brand-dark">{title}</h1>

        {subtitle && <p className="max-w-2xl text-gray-600">{subtitle}</p>}
      </div>
    </Reveal>
  );
}