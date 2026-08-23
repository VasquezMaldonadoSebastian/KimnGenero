# Lineamientos de UX/UI y Sistema de Diseño

## Objetivo

Definir estándares visuales y de interacción para asegurar consistencia en `KimnGenero`, facilitar el desarrollo del frontend en React y sostener una experiencia accesible para usuarios del observatorio.

## Alcance

- Cubre tokens de diseño: color, tipografía y espaciado.
- Cubre el uso de la librería de componentes base.
- Cubre patrones de visualización de datos e indicadores.
- No cubre la implementación detallada de CSS ni la arquitectura completa del frontend.
- La guía operativa completa del sitio (navegación → actualización → paleta) es `docs/GUIA_SITIO.md`.

## 1. Tokens de diseño

Todos los valores viven en `client/src/index.css` (tokens) y `client/src/features/indicadores/dimensionColors.ts` (tripletes de dimensión). **Cero hex hardcodeados en componentes.**

### Paleta institucional

- **Color principal** `--color-brand-primary: #0176DE` — acciones primarias, enlaces, foco visual, botones, KPIs. Es el ÚNICO azul de interacción.
- **Estructura** `--color-brand-dark: #03122E` — títulos de página (PageHeader), navbar activa, superficies oscuras.
- **Apoyo** `--color-brand-light: #173F8A` (hover/links oscuros) · `--color-brand-pale: #E8F2FF` (superficies alternas, inputs, bordes claros) · `--color-brand-mid: #B3D9FF` (familia clara) · `--color-brand-accent: #FEC60D` (acento UCT sobre navy).
- **Superficies** `surface-base` (fondo `oklch(0.98 0.01 250)` ≈ `#F4F9FF`), `surface-alt` (= brand-pale), `surface-strong` (= brand-dark). Tarjetas **siempre blancas**.
- **Texto** `text-secondary #5F6368` (5.72:1) · `text-muted #6B7280` (4.57:1) · `text-dark #4A4A4A` · `text-light #71717A`.
- **Estados** `status-ok #27AE60` · `status-update #F59E0B` · `status-late #D8002D` — solo dots/badges no-texto (no usarlos como texto: fallan AA).

### Colores por dimensión en indicadores

`client/src/features/indicadores/dimensionColors.ts` es el **punto único de color por dimensión** (reemplazó al antiguo `COLOR_MAP` de `Indicadores.tsx` — no existe).

Reglas:

- cada dimensión usa un triplete `{ bg, border, text }` con contraste AA ≥ 4.5:1 verificado (ver tabla en `docs/GUIA_SITIO.md` §3.3).
- el color de dimensión se usa **solo** en chips/badges y en la banda superior de 8-16px del detalle.
- **excepción documentada**: las 8 tarjetas de dimensión del Home usan el color como fondo completo (identidad de la landing; texto blanco pasa AA).
- no agregar nuevas dimensiones sin definir triplete en `dimensionColors.ts` y familia en `page2-resources.ts`.
- separar conceptualmente color de dimensión y color de estado.

### Tipografía y espaciado

- **Montserrat** en títulos/bloques destacados (display) · **Inter** para UI/body · **Roboto** solo en la barra superior UCT.
- Escala: display 36/44 · h1 30/38 · h2 24/32 · h3 18/26 · body 16/24 · small 14/20 · caption 12/16.
- **PROHIBIDO texto < 12px.**
- Espaciado: tarjetas `rounded-xl`, sombra única `--shadow-card` (`0 2px 8px rgba(1,118,222,.08)`), layout respirado con `container` (máx. 1400px en desktop).

## 2. Componentes UI

### Librería base

- `@radix-ui/react-dialog` · `@radix-ui/react-slot` · `@radix-ui/react-tooltip`
- Implementaciones locales en `client/src/components/ui/{dialog,button,tooltip,sonner,card}.tsx`.
- Estilado con Tailwind classes + variantes locales; no agregar wrappers de Radix sin justificar dependencia real.

### Componentes compartidos del sitio

- `PageHeader` — inicio de página estándar (blanco, borde brand-pale, breadcrumb, h1 brand-dark, subtítulo; banda opcional `bandColor`). **Obligatorio en toda página interior nueva.**
- `HeaderUCT` — topbar institucional (gradiente `#048fd4→#0086ca`, Roboto, redes sociales SVG) + nav + menú móvil (<1280px).
- `FooterUCT` — textos con tokens `--text-dark/--text-muted/--text-light`, logos institucionales.
- `Reveal` — animación de entrada por scroll (respeta `prefers-reduced-motion`).
- Iconografía: `lucide-react`, línea simple, tamaños pequeños en acciones/metadata.

## 3. Patrones de interacción (UX)

### Carga de datos

- Spinners para cargas principales: `IndicatorsContext`, `/indicadores`, `/indicador/:id`, `EstadoAgrupado`.
- No hay skeletons globales; si se agregan cargas parciales, evaluar skeletons y documentarlos.

### Manejo de errores UI

- Cliente usa `apiGetJson()` y mapea `message`/`error` según `docs/API_ERROR_CONTRACT.md`.
- Errores de fetch de página → bloque inline o pantalla de error; acciones cortas → toast (`sonner`); placeholders → copy claro.

### Filtros y búsqueda

- `/indicadores` combina filtros semánticos (`area`, `dimension`) resueltos por backend + búsqueda local.
- `Limpiar filtros` restaura `searchTerm`, `filterArea`, `filterDimension`.
- Todo filtro nuevo debe definir si vive en backend o cliente.

## 4. Accesibilidad (A11y)

Estado actual (verificado en auditoría 2026-08-23):

- Contraste AA para texto normal (≥ 4.5:1): tokens y escalas en uso cumplen. **Regla práctica:**
  - captions/labels/breadcrumbs → `text-gray-600` (7.56:1), nunca `gray-400` (2.54:1).
  - iconos/chevrons/separadores → `text-gray-500` (4.83:1).
  - placeholders sobre `brand-pale` → `placeholder:text-gray-600` (AA).
  - asteriscos de campos obligatorios → `text-red-600` (4.97:1).
- Excepción institucional: texto blanco de la topbar UCT sobre gradiente (3.57:1) — heredado de kimn.uct.cl, no tocar.
- `focus-visible` styles en componentes base; `aria-*` en controles; controles navegables por teclado.
- No depender solo del color para comunicar estado (dimensión ≠ estado).
- Animaciones respetan `prefers-reduced-motion`.

## 5. Patrones visuales para indicadores y dashboards

- Cards de indicadores: header con color de dimensión (chips), metadata breve, badge de estado, CTA único al detalle.
- Detalle de indicador: PageHeader + banda de dimensión, ficha técnica, fórmula, dashboard embebido o placeholder.
- Dashboards: `iframe` con `loading="lazy"`, acciones refresh/fullscreen/compartir, nota de actualización al pie.

## Validación

- Revisar `/indicadores`, `/indicador/:id`, `/kimnia`, `/metodologia`, una vista con dashboard y el 404.
- Verificar foco visible, lectura de estados y consistencia de colores por dimensión.
- Confirmar que errores de API sigan el contrato documentado.

## Riesgos y consideraciones

- Riesgo: que cada pantalla nueva reinvente colores o feedback → usar tokens y PageHeader (mitigación normativa).
- Riesgo: mezclar color de categoría y de estado en una misma señal → una sola jerarquía semántica por elemento.
- Riesgo: doc desactualizada vs código → guía viva es `docs/GUIA_SITIO.md`; actualizarla al cambiar comportamiento real.

## Referencias

- `docs/GUIA_SITIO.md` (guía operativa completa: navegación, actualización, paleta)
- `client/src/index.css` (tokens)
- `client/src/features/indicadores/dimensionColors.ts` (tripletes de dimensión)
- `client/src/components/PageHeader.tsx` · `client/src/components/HeaderUCT.tsx` · `client/src/components/FooterUCT.tsx`
- `client/src/features/indicadores/pages/Indicadores.tsx` · `client/src/features/indicadores/pages/IndicadorPage.tsx`
- `docs/API_ERROR_CONTRACT.md`