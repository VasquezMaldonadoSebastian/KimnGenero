/**
 * Reveal — wrapper de scroll reveal (ancestro kimn.uct.cl).
 *
 * Envuelve contenido con `data-kr` + clase `.kr-<variant>` y se auto-registra en
 * el observer singleton (via callback ref) → se revela al entrar al viewport.
 * Robusto ante lazy-load/Suspense y re-renders por filtro (los items nuevos se
 * observan solos al montar). `delay` se aplica como `--kr-delay` (stagger).
 *
 * Uso: <Reveal variant="up" delay={index * 80}>…</Reveal>
 */
import type { CSSProperties, ElementType, ReactNode } from "react";
import { observeRevealEl } from "@/hooks/useReveal";

type RevealProps = {
  /** Tag raíz (default "div"). */
  as?: ElementType;
  /** Dirección/estilo de entrada: up (fadeInUp UCT) | down | fade | scale. */
  variant?: "up" | "down" | "fade" | "scale";
  /** Retardo en ms (stagger en grids). */
  delay?: number;
  className?: string;
  children?: ReactNode;
};

export default function Reveal({
  as: Tag = "div",
  variant = "up",
  delay = 0,
  className = "",
  children,
}: RevealProps) {
  const style: CSSProperties | undefined =
    delay > 0 ? ({ "--kr-delay": `${delay}ms` } as CSSProperties) : undefined;
  const cls = `kr kr-${variant}${className ? ` ${className}` : ""}`;

  return (
    <Tag
      data-kr
      className={cls}
      style={style}
      ref={(el: HTMLElement | null) => {
        if (el) observeRevealEl(el);
      }}
    >
      {children}
    </Tag>
  );
}
