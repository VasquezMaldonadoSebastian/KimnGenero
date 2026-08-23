/**
 * useReveal — scroll reveal (ancestro kimn.uct.cl).
 *
 * Observa `[data-kr]` dentro de `root` (o todo el documento si no se pasa) y les
 * añade `.is-visible` cuando entran al viewport, transicionando así opacity/transform
 * definidos en `index.css` (.kr). Usa UNA sola IntersectionObserver singleton y
 * hace `unobserve` tras revelar → la animación corre una sola vez por elemento.
 *
 * Respeta `prefers-reduced-motion`: en ese modo añade `.is-visible` al instante.
 *
 * `deps` permite re-observar al cambiar filtros/búsquedas (Fase C): elementos ya
 * visibles se conservan, solo se observan los `[data-kr]` nuevos sin `is-visible`.
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

export function useReveal(
  root?: Element | null,
  deps: unknown[] = [],
) {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const container: Element | Document = root ?? document;
    const nodes = container.querySelectorAll("[data-kr]");

    // Reduced motion: mostrar todo sin animar.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    nodes.forEach((el) => {
      if (!el.classList.contains("is-visible")) getObserver().observe(el);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root, ...deps]);
}
