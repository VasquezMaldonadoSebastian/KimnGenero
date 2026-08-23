# Guía del sitio — KimnGenero

> Guía operativa completa del sitio: **navegación** → **actualización de contenido** → **paleta de colores**.
> Este documento es la referencia de mantenimiento; los detalles de datos/API/deploy viven en `docs/` (ver §6).

---

## 1. Navegación y estructura

### 1.1 Mapa del sitio (10 rutas — `client/src/App.tsx`)

| Ruta | Página | Componente | Tipo |
|---|---|---|---|
| `/` | Home — landing blanca con hero tipográfico, métricas y 8 tarjetas de dimensión | `pages/Home.tsx` | Landing |
| `/indicadores` | Listado con filtros (área/dimensión) + búsqueda local | `features/indicadores/pages/Indicadores.tsx` + PageHeader | Listado |
| `/indicador/:id` | Detalle individual: hero claro, banda de dimensión, Ficha, Fórmula, dashboard Power BI | `features/indicadores/pages/IndicadorPage.tsx` (Hero, TechnicalSheet, FormulaBlock, DashboardCard) | Detalle |
| `/kimnia` | Herramienta IA / notebooks LMS | `pages/NotebooksLMS.tsx` + PageHeader | Herramienta |
| `/metodologia` | Proceso metodológico | `pages/Metodologia.tsx` + PageHeader | Contenido |
| `/glosario` | Términos del observatorio | `pages/Glosario.tsx` + PageHeader | Contenido |
| `/contacto` | Datos de contacto + formulario | `pages/Contacto.tsx` + PageHeader | Contenido |
| `/calendario` | Calendario de actualización | `pages/Calendario.tsx` + PageHeader | Contenido |
| `/estado-agrupado` | Dashboard consolidado (iframe Power BI) | `pages/EstadoAgrupado.tsx` + PageHeader | Estado/datos |
| `*` / `/404` | Error 404 | `pages/NotFound.tsx` | Error |

### 1.2 Cáscara global (header + footer + layout)

- `App.tsx` envuelve todo en `ErrorBoundary` → `ThemeProvider` (light) → `IndicatorsProvider` → `TooltipProvider` → `Toaster`; layout `HeaderUCT / main / FooterUCT`.
- **HeaderUCT** (`components/HeaderUCT.tsx`): barra superior institucional UCT (gradiente `#048fd4 → #0086ca`, Roboto 13px, links + redes sociales SVG) · nav principal con links a las secciones (activo = `--color-header-blue` navy) · menú móvil con hamburguesa **solo < 1280px** (`xl:hidden`).
- **FooterUCT** (`components/FooterUCT.tsx`): blanco, `border-t-8` brand-primary, textos con tokens (`--text-dark` títulos, `--text-muted` cuerpo, `--text-light` pie), logos institucionales.
- **PageHeader** (`components/PageHeader.tsx`): inicio de página estándar de TODOS los interiores — superficie blanca, borde inferior `brand-pale`, breadcrumb (antepone "Inicio"), `h1` `text-brand-dark` font-black, subtítulo, y banda superior opcional `bandColor` (único uso de color de fondo de dimensión en el detalle).
- **Reveal** (`components/Reveal.tsx` + hook `useReveal`): animación de entrada por scroll (CSS `.kr*` en `index.css`, IntersectionObserver, **respeta `prefers-reduced-motion`**). Aplicado en PageHeader, Home, listados y detalle.

### 1.3 Dónde vive el código

```
client/src/
├── pages/                → páginas de nivel superior (Home, Metodologia, Glosario, Contacto,
│                            Calendario, EstadoAgrupado, NotebooksLMS, NotFound)
├── features/indicadores/ → dominio de indicadores: páginas (Indicadores, IndicadorPage),
│                            componentes de detalle (Hero, TechnicalSheet, FormulaBlock,
│                            DashboardCard), dimensionColors.ts (tripletes de dimensión)
├── components/           → PageHeader, HeaderUCT, FooterUCT, Reveal, SocialIcons, ErrorBoundary, ui/*
├── contexts/             → IndicatorsContext, ThemeContext
├── hooks/                → useReveal, useMobile
├── lib/                  → apiClient, page2-resources (íconos/colores por dimensión)
└── index.css             → tokens de diseño (única fuente de hex) + animaciones .kr*
server/                   → API Express + repositorios (memory / sqlite)
data/indicadores.json     → fuente versionada de indicadores
shared/                   → tipos compartidos
```

---

## 2. Actualización de contenido (indicadores)

### 2.1 Fuente de datos

- Fuente versionada: **`data/indicadores.json`** (formato canónico: objeto `{ "indicadores": [...], "reportesAgrupados": [...] }`).
- En arranque el backend valida el seed (`server/src/data/indicatorSeed.ts`), crea el repositorio (`INDICATOR_REPOSITORY=memory` por defecto, o `sqlite`) y lo inicializa.
- API pública: `GET /api/indicadores` · `GET /api/categorias` · `GET /api/reportes-agrupados` · healthcheck.

### 2.2 Campos de un indicador

| Campo | Qué es |
|---|---|
| `id`, `nro`, `codigo` | Identificadores (código tipo `01INGE-01`) |
| `nombre`, `descripcion`, `objetivo` | Textos públicos del indicador |
| `area`, `dimension` | Clasificación (la dimensión define el color — §3.3) |
| `unidadMedida`, `formula`, `formulaSimplificada`, `variables` | Fórmula (LaTeX simplificado) |
| `frecuenciaMedicion`, `estado`, `lineaBase`, `fechaCorte` | Periodicidad, estado y corte |
| `enlaceVisualizacion` | URL **pública** de Power BI (si no es URL válida, se muestra placeholder) |
| `fuenteAdministrativa`, `responsableCalculo`, `responsableVerificar`, `instructivoCalculo` | Ficha técnica |

### 2.3 Flujo para actualizar un indicador

1. Editar `data/indicadores.json` (respetar el shape del §2.2; JSON válido).
2. Validar: `npm run check` (tsc) · `npm run test` (44 tests) · `npm run build`.
3. Levantar local (`npm run dev`) y verificar el indicador en `/indicador/:id`.
4. **Si se usa SQLite** (`INDICATOR_REPOSITORY=sqlite`): el seed solo aplica cuando la tabla `indicators` está **vacía**. Cambiar `indicadores.json` **no** refresca una base ya poblada → regenerar la base o aplicar recarga controlada (ver `docs/SQLITE_OPERATIONS.md`, `docs/DATA_PIPELINE.md`).
5. Commit + push (rama `main`), luego **redeploy manual en Render** (§2.5).

### 2.4 Dashboards Power BI

Los dashboards viven en el servicio Power BI (externo al repo); `enlaceVisualizacion` solo apunta a la URL pública (`iframe` con `loading="lazy"`, acciones refresh/fullscreen/compartir en DashboardCard). Actualizar el reporte no requiere deploy del sitio, solo que la URL siga siendo pública.

### 2.5 Deploy (Render, manual)

1. Antes: `npm run build` local (verificación obligatoria).
2. Dashboard de Render → **"Deploy latest commit"** (deploy manual sobre `main`).
3. Verificar en producción: el hash del JS cambió (señal de que tomó el código nuevo) y la página `/` muestra el hero azul institucional con botones brand-primary.

> Regla del proyecto: nada de auditorías/informes en el repo del producto; los entregables de análisis se resumen en el chat.

---

## 3. Paleta de colores y sistema de diseño (tema global)

**Única fuente de hex:** `client/src/index.css` (tokens) + `features/indicadores/dimensionColors.ts` (tripletes de dimensión) + `lib/page2-resources.ts` (íconos/colores de familia). **Cero hex hardcodeados en componentes.**

### 3.1 Tokens brand y superficies (`index.css`)

| Token | Valor | Uso |
|---|---|---|
| `brand-primary` | `#0176DE` | **ÚNICO azul de interacción**: botones, links, activos, KPIs, focos |
| `brand-dark` | `#03122E` | Navy de estructura: títulos (PageHeader), navbar activa |
| `brand-light` | `#173F8A` | Hover/links oscuros, texto de chips azules |
| `brand-pale` | `#E8F2FF` | Superficie alterna, bordes claros, inputs |
| `brand-mid` | `#B3D9FF` | Familia clara del azul (bordes) |
| `brand-accent` | `#FEC60D` | Acento UCT (sobre navy; no usar con texto blanco) |
| `surface-base` | oklch(0.98 0.01 250) ≈ `#F4F9FF` | Fondo de TODAS las páginas interiores |
| `surface-alt` | `= brand-pale` | Bandas/secciones alternas |
| `surface-strong` | `= brand-dark` | Superficies oscuras de estructura |

**Regla de superficies:** tarjetas **siempre blancas** (`card: oklch(1 0 0)`) sobre cualquier superficie; inputs/badges en `surface-alt`/`brand-pale`.

### 3.2 Texto y bordes

| Token | Valor | Contraste/uso |
|---|---|---|
| `text-secondary` | `#5F6368` | Cuerpo secundario (5.72:1 AA) |
| `text-muted` | `#6B7280` | Texto muted (4.57-4.83:1 AA) |
| `text-dark` | `#4A4A4A` | Títulos de footer (8.86:1) |
| `text-light` | `#71717A` | Pie de página (4.83:1) |
| `border` / `border-light` | oklch(0.88 0.02 250) / `#E5E5E5` | Bordes |
| `--shadow-card` | `0 2px 8px rgba(1,118,222,.08)` | Sombra única de tarjetas |

### 3.3 Colores de dimensión (tripletes AA — `dimensionColors.ts`)

Cada dimensión = `{ bg (pastel), border (familia), text (≥AA sobre bg) }`. Contraste verificado (text/bg):

| Dimensión | bg | border | text | CR text/bg |
|---|---|---|---|---|
| 1. Institucionalización | `#E8F2FF` | `#B3D9FF` | `#173F8A` | 8.79 |
| 2. Violencia de género | `#D1FAE5` | `#A7F3D0` | `#065F46` | 6.78 |
| 3. Corresponsabilidad en los cuidados | `#FEE2E2` | `#FECACA` | `#B91C1C` | 5.30 |
| 4. Trayectorias laborales | `#F1F1F3` | `#D6D6DA` | `#3F3F46` | 9.26 |
| 5. Trayectorias educativas | `#EDE9FE` | `#C4B5FD` | `#5B21B6` | 7.57 |
| 6. Modelo educativo con perspectiva de género | `#FFEDD5` | `#FED7AA` | `#C2410C` | 4.52 |
| 7. Participación equilibrada en la divulgación científica | `#FEF3C7` | `#FDE68A` | `#92400E` | 6.37 |
| 8. Visibilización del aporte de las mujeres en las áreas de conocimiento | `#EAEAEA` | `#C9C9C9` | `#232323` | 13.06 |
| (default) | `#F0F9FF` | `#BAE6FD` | `#0369A1` | 5.57 |

**Regla:** color de dimensión **solo** en chips/badges y en la banda superior de 8-16px del detalle. Texto del chip siempre el `text` del triplete. Nueva dimensión → agregar triplete aquí (y familia en `page2-resources.ts`), nunca hex en componentes.

### 3.4 Estados (semánticos, no dimensión)

`status-ok #27AE60` · `status-update #F59E0B` · `status-late #D8002D` — usados en dots/badges no-texto (DashboardCard); **no usar como texto** (contraste <3:1). `#D8002D` es el único que pasa AA como texto (5.31:1).

### 3.5 Tipografía y forma

- **Montserrat** = display (h1-h3, KPIs) · **Inter** = UI/body · **Roboto** = barra superior UCT.
- Escala: display 36/44 · h1 30/38 · h2 24/32 · h3 18/26 · body 16/24 · small 14/20 · caption 12/16.
- **PROHIBIDO texto < 12px** (aplicado también en Home: badges de tarjetas y botones).
- Radio de tarjetas 12px (`--radius 0.5rem`) · sombra única `--shadow-card`.

### 3.6 Excepciones documentadas (NO tocar sin decisión explícita)

| Excepción | Dónde | Por qué |
|---|---|---|
| Gradiente topbar `#048fd4→#0086ca` + texto blanco (3.57:1) | HeaderUCT | Barra institucional heredada de kimn.uct.cl |
| 8 tarjetas de dimensión con color de **fondo completo** (inline `backgroundColor`) | Home | Identidad de la landing; texto blanco sobre esos fondos pasa AA (5.18-15.72) |
| Home y Calendario en `bg-white` puro (vs `surface-base`) | `/` y `/calendario` | Tratamiento visual propio de landing/calendario |
| Hero del detalle de indicador claro (no navy) | `/indicador/:id` | Identidad del "indicador individual" |
| Acentos semánticos amber/emerald/indigo | Ficha Técnica y Fórmula | Valor informativo (decisión tomada); los textos pasan AA |

---

## 4. Reglas de mantenimiento (qué NO hacer)

1. **No agregar hex sueltos** en componentes → usar tokens o `dimensionColors.ts`.
2. **No bajar de 12px** ningún texto.
3. **No usar `gray-400`/`slate-400` o más claros como texto** sobre blanco (fallan AA): captions → `gray-600`, iconos → `gray-500`, asteriscos → `red-600`.
4. **No crear una nueva página sin PageHeader** + `surface-base` + tarjetas blancas (regla de homogeneidad).
5. **No mezclar color de dimensión con color de estado** en una misma señal.
6. **No cambiar `data/indicadores.json` esperando que SQLite se refresque solo** (regenerar base).
7. Auditorías/informes: **no se commitean** al repo del producto.

---

## 5. Checklist antes de deployar

- [ ] `npm run check` (tsc) ✓
- [ ] `npm run test` ✓
- [ ] `npm run build` locales ✓
- [ ] Verificación visual local de las páginas tocadas
- [ ] Commit + push a `main`
- [ ] Render → "Deploy latest commit" → verificar hash JS + página clave

---

## 6. Documentos relacionados

- `docs/UI_UX_GUIDELINES.md` — lineamientos UX/UI y accesibilidad
- `docs/DATA_PIPELINE.md` — flujo de datos y seed
- `docs/SQLITE_OPERATIONS.md` — operación SQLite
- `docs/ARCHITECTURE.md` · `docs/DEPLOYMENT.md` · `docs/DOCKER_DEPLOYMENT.md` · `docs/PRODUCTION_CONFIGURATION.md`
- `NOTAS_TEMA_GLOBAL.md` — decisión y fases del tema global (interna; §8 = auditoría 2026-08-23)