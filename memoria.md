# KimnGenero — Memoria del proyecto (contexto raíz)

> Este archivo es el punto de entrada de contexto. Léelo antes de inspeccionar código
> o reportar estado. El detalle por trabajo vive en los NOTAS_*.md (enlazados abajo),
> no en la memoria inyectada del agente.

## Qué es
Plataforma web del **Observatorio de Indicadores de Género** de la Universidad Católica de
Temuco (UCT). Publica indicadores desagregados por sexo; hereda estética/contenido del
sistema institucional que vive en https://kimn.uct.cl/.

## Repo / stack / deploy
- Path local: `C:\Repositorio Proyectos\KimnGenero`
- GitHub: `VasquezMaldonadoSebastian/KimnGenero` (rama `main`)
- Stack: React 19 + Vite + wouter + Express + TypeScript + Tailwind CSS 4 (`@theme inline`)
- Base de datos local: SQLite (docs/SQLITE_OPERATIONS.md) · API server en `server/`
- Deploy: **Render, manual** ("Deploy latest commit" desde el dashboard). Antes de deployar,
  verificar local con `npm run build`.
- Commands: `npm run check` (tsc) · `npm run test` (vitest) · `npm run build` · `npm run dev`

## Diseño (TEMA GLOBAL normalizado — estable, no tocar sin plan)
- **Un solo tema global**, sin excepciones por página (salvo el hero del detalle de indicador).
- Azul institucional ÚNICO `#0176DE` (brand-primary = acción) + navy `#03122E` (brand-dark = estructura).
- Superficies: `surface-base` de fondo, tarjetas SIEMPRE blancas, bandas `surface-alt` (`#E8F2FF`).
- Cero hex hardcodeados fuera de `index.css` / `dimensionColors.ts` (0 usos verificados).
- Colores de dimensión en tripletes AA solo en chips/badges + banda de 8-16px (ver 2.4 en NOTAS_TEMA_GLOBAL).
- Tipografías: Montserrat (display) + Inter (UI/body) + Roboto (barra superior UCT).
- Detalle completo: **`NOTAS_TEMA_GLOBAL.md`** (paleta, variación por tipo de página, decisiones).

## Animaciones (SCROLL REVEAL — replicando kimn.uct.cl)
- Mecanismo propio, sin dependencias: CSS `.kr*` (index.css) + hook `useReveal`/`observeRevealEl`
  (client/src/hooks/useReveal.ts) + componente `<Reveal>` (client/src/components/Reveal.tsx).
- IntersectionObserver singleton; anima una vez por elemento; respeta prefers-reduced-motion.
- Aplicado: PageHeader (7 interiores, fadeInDown) · Home (hero, MetricCards, mosaico, secciones)
  · /indicadores · /metodologia · /glosario (stagger). Hover grow/lift en iconos, ResourceCards, tarjetas.
- Detalle completo + fases + pitfall de filtro: **`NOTAS_ANIMACIONES.md`**

## Estado actual (2026-08-22)
- Tema global: ✅ completado y en `main` (NOTAS_TEMA_GLOBAL.md).
- Animaciones: ✅ completado (fases A/B/C en `main`: commits cd30b23, a1be120, b155eee).
- **PENDIENTE**: redeploy manual en Render ("Deploy latest commit") para ver el resultado en producción.
- Rama limpia, todo pusheado a `origin/main`.

## Convenciones del proyecto
- En planes por fases: "continúa" = avanzar a la siguiente fase (editar + verificar + commit/push).
- Git push inmediato después de cada commit (no acumular).
- Auditorías/informes NO se commitean al repo del producto (entregar como resumen en chat).
- Persistir estado y avance en NOTAS_*.md en el workspace, nunca en memoria inyectada.
