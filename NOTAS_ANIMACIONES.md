# NOTAS — ANIMACIONES KimnGenero (replicar ancestro kimn.uct.cl)

Fecha: 2026-08-22 · Alcance: animaciones de entrada por scroll + micro-interacciones hover
Origen analizado: https://kimn.uct.cl/ (WordPress + Elementor Pro) — ver NOTAS_ANIMACIONES.md §0
Estado: PLAN — sin implementar.

---

## 0. QUÉ USA EL ANCESTRO (kimn.uct.cl, extraído del CSS/HTML reales)

- **Entrada por scroll** (clase Elementor `.animated`): `fadeIn` x36, `fadeInUp` x10, `fadeInDown` x6.
  - `fadeInUp` = `opacity 0→1` + `translate3d(0,100%,0)→none`. `fadeInDown` = desde `translate3d(0,-100%,0)`.
- **Hover**: `grow` = `scale(1.1)` dur .3s (x6, en iconos destacados) y `shrink` = `scale(.9)` (x2).
- **Transiciones generales**: `background/border/color .15s`; `opacity/transform .2s`; `background/box-shadow .2s`.
- El punto clave: el documento **se revela progresivamente al hacer scroll**, con pequeño desfase por sección.

## 0.1 QUÉ YA TIENE KIMNGENERO (auditado: CERO trabajo previo necesario en base)

- `client/src/index.css` YA define `@keyframes fadeIn`, `slideUp` (=fadeInUp), `scaleIn`, utilidades `.animate-slide-up/-fade-in/-scale-in` y `.stagger-1..4`. → **Hoy son dead-code: grep = 0 usos en componentes.**
- `tailwindcss-animate` YA instalado.
- Hover base ya existe en `.kpi-card:hover { translateY(-2px) }` e `Indicadores.tsx` tarjetas con `transition-all hover:shadow-lg`.
- Paleta/colores UCT ya normalizados (tokens + `dimensionColors.ts`). **No se toca color en esta fase.**

**Saltos vacíos a cubrir**: (1) animaciones por SCROLL (hoy son de montaje único), (2) aplicar utilidades que existen pero no se usan, (3) stagger real dentro de grids.

---

## 1. PRINCIPIOS DE DISEÑO

1. **Sin dependencias nuevas** — usa IntersectionObserver nativo + CSS. (Lottie = MEJORA futura, fuera de alcance).
2. **Reutilizar** los keyframes/timing ya presentes (slideUp 0.6s / fadeIn 0.4s / scaleIn 0.35s), no duplicarlos.
3. **Accesibilidad**: respetar `prefers-reduced-motion: reduce` → revelar todo sin animación.
4. **Rendimiento**: un solo IntersectionObserver singleton compartido; `rootMargin` para adelantar el trigger ~10% antes de entrar en viewport; `unobserve` tras revelar (una sola vez).
5. **Consistencia**: mismo mecanismo en toda la app vía componente `<Reveal>` + PageHeader (punto único de inyección en las 7 interiores). Timing único: `--reveal-dur 0.6s`, `--reveal-delay` escalonado 0.08s.
6. **No animar contenido denso de a mucho** (fórmulas, tablas Power BI, glosario completo): reveal en contenedores de sección, no en cada celda.

---

## 2. ARQUITECTURA (3 piezas nuevas)

### 2.1 CSS — `client/src/index.css` (añadir bloque "Scroll reveal")

Se añaden clases de reveal (NO se reusan `.animate-*`, que quedan como utilidades sueltas sin romper nada):

```css
/* ---- Scroll reveal (ancestro kimn.uct.cl: fadeInUp/Down por scroll) ---- */
@media (prefers-reduced-motion: reduce) {
  .kr { opacity: 1 !important; transform: none !important; transition: none !important; }
}
.kr {
  opacity: 0;
  transition: opacity var(--kr-dur, .6s) ease, transform var(--kr-dur, .6s) ease;
  transition-delay: var(--kr-delay, 0ms);
  will-change: opacity, transform;
}
.kr-up    { transform: translateY(24px); }   /* = fadeInUp UCT */
.kr-down  { transform: translateY(-24px); }  /* = fadeInDown UCT */
.kr-fade  { transform: none; }               /* = fadeIn UCT */
.kr-scale { transform: scale(.96); }         /* micro zoom suave */
.kr.is-visible { opacity: 1; transform: none; }
```

- Nombre corto `.kr` (= *Kimn Reveal*) para no colisionar con nada.
- El estado "oculto" inicial es `opacity:0` + desplazamiento; al agregar `.is-visible` via IO transiciona. Esto permite reveal real por scroll (a diferencia de `animation … forwards` que corre en montaje).
- `.stagger-N` existentes: se reemplazan por `--kr-delay` inline (más granular).
- **No borrar** `.animate-*`/keyframes por ahora (pueden quedar en uso futuro + tests); se marcan en comment como candidatos a fusión.

### 2.2 Hook singleton — `client/src/hooks/useReveal.ts` (NUEVO)

```ts
import { useEffect } from "react";
let observer: IntersectionObserver | null = null;
function getObserver(): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            observer!.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
  }
  return observer;
}
export function useReveal(rootEl?: Parameters<typeof getObserver>[0]) {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return; // SSR guard
    // Respeta reduced-motion: revela todo al toque.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll("[data-kr]").forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const nodes = (rootEl ? rootEl.querySelectorAll("[data-kr]") : document.querySelectorAll("[data-kr]"))
      .forEach((el) => getObserver().observe(el));
  }, [rootEl]);
}
```

- Un único observer a nivel módulo (perf). `unobserve` al revelar → las animaciones corren **una sola vez** (igual que UCT/Elementor).
- Se llama desde cada página (efecto sobre su propio DOM, respetando lazy-load). Alternativa simple: un `useReveal()` en `App` que rescanee en cada cambio de ruta. Se elige la versión por página (más determinista con Suspense/lazy).

### 2.3 Componente — `client/src/components/Reveal.tsx` (NUEVO)

```tsx
import { forwardRef, type CSSProperties, type ElementType, type ReactNode } from "react";

type RevealProps = {
  as?: ElementType;          // "div" | "section" | "li" | "span" (default "div")
  variant?: "up" | "down" | "fade" | "scale"; // default "up"
  delay?: number;            // ms (0.08 * index para stagger)
  className?: string;
  children: ReactNode;
};

export default function Reveal({ as: Tag = "div", variant = "up", delay = 0, className = "", children }: RevealProps) {
  const cls = `kr kr-${variant}${className ? " " + className : ""}`;
  const style: CSSProperties = delay > 0 ? ({ ["--kr-delay" as string]: `${delay}ms` } as CSSProperties) : undefined;
  return <Tag data-kr className={cls} style={style}>{children}</Tag>;
}
```

*(En la implementación real fijar bien el custom property `--kr-delay`, no el typo `--kr-dal` del boceto.)*

---

## 3. FASES DE IMPLEMENTACIÓN (cada una edita → verifica → commit/push)

> Regla: avanzar por fase, NO acumular commits sin pushear.

### FASE A — Infraestructura de reveal
**Cambios**:
1. `client/src/index.css`: añadir bloque "Scroll reveal" (§2.1).
2. `client/src/hooks/useReveal.ts`: crear hook singleton (§2.2).
3. `client/src/components/Reveal.tsx`: crear componente (§2.3).
**Verificación**: `npm run check` (tsc) · `npm test` (vitest 44/44) · `npm run build` · utilidades `.kr` presentes en CSS compilado.
**Commit**: `feat(anim): infraestructura scaffold reveal por scroll (CSS + hook useReveal + componente Reveal)`

### FASE B — PageHeader + Home + hover (el "90% del parecido")
**Cambios**:
1. `PageHeader.tsx`: envolver el bloque (`.border-b.border-brand-pale`) en `<Reveal variant="down">` → **cubre las 7 páginas interiores de un golpe** (Indicadores, IndicadorDetail banda, EstadoAgrupado, Metodología, Glosario, Contacto, Calendario, KimnIA): header baja suave = fadeInDown UCT.
2. `Home.tsx` (landing sin PageHeader) — entradas escalonadas:
   - Hero: eyebrow + h1 `<Reveal variant="down">`, subtítulo + CTAs `<Reveal variant="up">` stagger.
   - Fila de 4 `MetricCard`: `<Reveal variant="up" delay>` por índice.
   - Sección "Datos para la igualdad": heading `<Reveal variant="up">`, el mosaico de 8 `ResourceCard`: `<Reveal variant="scale">` stagger.
   - Sección cita/blockquote + CTA "Ir a indicadores": `<Reveal variant="up">`.
3. **Hover micro-interacciones** (grow UCT `scale(1.1)`, .3s):
   - `ResourceCard` Home: agregar `transition-transform` + `hover:scale-[1.03]` (además del `hover:brightness-95` que ya tiene). Añadir `will-change` NO — solo transition.
   - `.kpi-card` ya tiene `translateY(-2px)`; estandarizar timing a `transform .25s ease` (tooltip). 
   - Iconos de redes `SocialIcons.tsx` / `FooterUCT.tsx`: `transition-transform hover:scale-110` (= grow UCT, .3s).
   - Botones: conservar `transition-colors`; añadir `transition-all` si se quiere scale, opcional.
   - Tarjetas `Indicadores.tsx` ya tienen `transition-all hover:shadow-lg`: añadir `hover:-translate-y-1` para el lift.
**Verificación**: `npm run check` · `npm test` (actualizar tests de PageHeader/Home si rompe snapshot) · `npm run build` · grep-verify `data-kr`/`.kr` presentes en Home y interiores.
**Commit**: `feat(anim): reveal scroll en PageHeader+Home y hover grow (grow/shrink UCT)`

### FASE C — Grids listados con stagger real (moderado)
**Cambios** (envolver tarjetas individuales en `<Reveal variant="up" delay={(i % N) * 80}>` con N según columnas del grid):
1. `Indicadores.tsx` (~l.170): cada tarjeta de `filtrados.map` → `<Reveal as="div" delay>`; cap `delay = min(6, i)*80` para no demorar listas largas. Nueva clave de re-render al filtrar: remontar reveal por cambio de `filtrados` (useEffect dependiente del length para re-observar — revisar §2.2 para reset por filtro).
2. `EstadoAgrupado.tsx`: tarjetas de estado (ok/update/late) → `<Reveal>` stagger.
3. `Metodologia.tsx`: grids de `etapas` (~192), `estandares` (~217), `ambitos` (~235), `principios` (~306) + títulos de sección → `<Reveal>`.
4. `Glosario.tsx`: categorías (~141) + tarjetas de términos (~162). Atención: con búsqueda activa no re-animar desde cero; solo reveal al montar.
**Importante (reset por filtro)**: en listas que cambian (Indicadores/Glosario con búsqueda), el elemento revelado no debe re-correr ni dejar items nuevos invisibles. Solución: `revealKey` (string, p.ej. `filtrados.length + dimension`) en el `useReveal`/contenedor para re-observar al cambiar. Ver §4-PITFALL.
**Verificación**: `npm run check` · `npm test` · `npm run build` · manual: filtrar /indicadores y /buscar glosario mantiene tarjetas visibles.
**Commit**: `feat(anim): stagger real en grids de indicadores, estado, metodologia y glosario`

---

## 4. PITFALLS / DECISIONES REVISADAS

- **Anim rejection en cambio de filtro**: si el contenedor re-renderiza, `[data-kr]` nuevos quedan `opacity:0` sin observer → BUG. Mitigación: `useReveal` acepta `key` y re-observe el subárbol al cambiar; o en listas filtrar solo no re-fabricar el nodo del item ya revelado (usar `delay` estable y no key que remonte). **Decisión**: en cada mapa usar `useReveal(containerRef)` con dependencia del filtro; el hook verifica si un `[data-kr]` ya tiene `is-visible` por misma posición y lo conserva (guard por índice o por id del item).
- **Reduced motion**: todo `[data-kr]` recibe `is-visible` al instante (CSS + JS). No animar jamás navegación/scroll crítico.
- **No animar el `<Suspense fallback>`** ni Power BI iframes (Calendario/indicador interactivo): contexto pesado se mantiene estático.
- **Lottie / iconos "vivo"**: fuera de alcance (requieren `lottie-web` + assets que no existen). Se documenta como mejora futura, NO se mockea.
- **Timing**: dur fija `0.6s` (coincide con slideUp actual y dura ± UCT). Stagger `80ms` (Elementor usa ~100-200ms; 80 es sutil y rápido).
- **Tests**: PageHeader/Home pueden tener `act`/snapshot que ya renderizan contenido; si un snapshot exige el contenido visible al render, ajustar los tests a `is-visible` (mock de IO o clase por defecto en entorno de test). No romper los 44 existentes.

---

## 5. CRITERIO DE ÉXITO (medible)

- Al abrir una página, el header baja suave (fadeInDown) y cada sección/tarjeta aparece al alcanzar el scroll con stagger — igual que kimn.uct.cl.
- Iconos/logos "crecen" (scale) al hover (.3s); tarjetas hacen lift.
- Con `prefers-reduced-motion`, todo visible sin animación.
- Cero regresiones: tsc ✓ · vitest 44/44 ✓ · build ✓ · 0 hex/colores nuevos (no tocar tema).

## 6. MEJORAS FUTURAS (FUERA DE ALCANCE — no mockear)
- Logo KIMN animado (Lottie JSON) — requiere `lottie-web` como dep nueva + asset.
- Iconos "EN VIVO" parpadeantes — descartado (ruido en app de datos).
- Reveal de imágenes con lazy-load — posible mejora de rendimiento, fase optativa.
