/**
 * useReveal / observeRevealEl — scroll reveal (ancestro kimn.uct.cl).
 *
 * Mecanismo de revelado por scroll: añade `.is-visible` cuando el elemento entra
 * al viewport, transicionando opacity/transform definidos en `index.css` (.kr).
 * Usa UNA sola IntersectionObserver singleton y hace unobserve tras revelar →
 * la animación corre una sola vez por elemento.
 *
 * Respeta `prefers-reduced-motion`: en ese modo añade `.is-visible` al instante.
 *
 * - `observeRevealEl(el)`: observa un elemento suelto (se usa en el componente
 *   `<Reveal>` vía callback ref; auto-registro robusto ante lazy-load/Suspense
 *   y re-renders por filtro — los items nuevos se observan solos al montar).
 * - `useReveal(root, deps)`: barre `[data-kr]` dentro de `root` (o todo el
 *   documento) y los observa; útil para contenido marcado con data-kr directo.
 */
import { useEffect } from "react";

let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            observer!.unobserve(el);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
  }
  return observer;
}

/** Observa un único elemento y lo revela al entrar al viewport (o ya, si reduce-motion). */
export function observeRevealEl(el: Element) {
  if (typeof IntersectionObserver === "undefined") {
    el.classList.add("is-visible");
    return;
  }
  if (el.classList.contains("is-visible")) return;

  const reduced =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    el.classList.add("is-visible");
    return;
  }

  getObserver().observe(el);
}

/** Barre [data-kr] dentro de un container (o todo el documento) y los observa. */
export function useReveal(root?: Element | null, deps: unknown[] = []) {
  useEffect(() => {
    const container: Element | Document = root ?? document;
    container.querySelectorAll("[data-kr]").forEach(observeRevealEl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root, ...deps]);
}
