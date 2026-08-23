# NOTAS — TEMA GLOBAL KimnGenero (normalización estética y de color)

Fecha: 2026-08-22 · Alcance: plataforma completa (10 rutas) · Estado: ✅ COMPLETADO (todas las fases + header; todo committeado y pusheado a `main`). Pendiente SOLO el redeploy manual en Render.

---

## 1. DIAGNÓSTICO (datos del inventario real, no percepción)

El theme ya existe en `client/src/index.css` (`@theme inline` + `:root` shadcn/oklch) pero las páginas NO lo usan:

| Hecho | Dato |
|---|---|
| brand-primary `#0176DE` | 93 usos hardcodeados |
| brand-pale `#E8F2FF` | 64 usos hardcodeados |
| brand-dark `#03122E` | 20 usos |
| `#1A0A2E` (2ª tinta, casi igual) | 32 usos — DEBE mapear a brand-dark |
| header-blue `#0073CC` | azul paralelo al primario (2 azules compitiendo) |
| Neutros sueltos | #F5F4F8, #F8F9FA, #F9F9FB, #E5E5E5, #71717A, #8E8E8E, #4A4A4A |
| Colores de dimensión | ~50 hexes pastel+oscuro (Tailwind 50/100 + 600/800) dispersos en 4 archivos: Indicadores.tsx, DashboardCard.tsx, TechnicalSheet.tsx, Metodologia.tsx |
| Overflow | /indicadores desborda 95px (SELECT de filtros) |
| Tipografía mínima | /indicadores usa 10-11px (badges/metadata) — subir a ≥12px |

Causa raíz: tokens definidos pero sin punto único de acceso a dimensión, sin componente compartido de encabezado de página, y sin regla de superficie por tipo de página.

---

## 2. TEMA GLOBAL (una sola paleta para toda la plataforma)

### 2.1 Azul institucional ÚNICO
- `#0176DE` (brand-primary) = ÚNICO azul de interacción: botones, links, active, focos, KPIs.
- `#03122E` (brand-dark) = navy de ESTRUCTURA: header bar, hero landing, footer, sidebar.
- Eliminar `header-blue #0073CC` → header pasa a brand-dark.
- Shades derivados existentes: brand-light #173F8A (hover/links oscuros), brand-pale #E8F2FF (superficie alt).

### 2.2 Tinta y neutros (escala única)
- Tinta fuerte: `#03122E` (mapear `#1A0A2E` → brand-dark).
- Texto body: `--text-secondary #5F6368` (ya token).
- Texto muted: `--text-muted #6B7280` (ya token).
- Border: `--border oklch(0.88 0.02 250)` y `--border-blue #E8F2FF` (ya token).
- ELIMINAR: #71717A, #4A4A4A, #E5E5E5, #8E8E8E → reemplazar por la escala anterior.

### 2.3 Superficies (3 únicas)
| Token | Valor | Uso |
|---|---|---|
| surface-base | oklch(0.98 0.01 250) (bg actual) | fondo por defecto de TODAS las páginas |
| surface-alt | #E8F2FF (brand-pale) | bandas/secciones alternas + tarjetas sobre base |
| surface-strong | #03122E (brand-dark) | hero landing, header, footer |

Regla: las tarjetas SIEMPRE blancas (`card: oklch(1 0 0)`) sobre cualquier superficie.
Eliminar #F5F4F8 / #F8F9FA / #F9F9FB → surface-alt o border.

### 2.4 Dimensiones (8 tripletes, punto único de acceso)
Nuevo archivo `client/src/features/indicadores/dimensionColors.ts` con:

| dim | bg (pastel) | text (≥AA sobre blanco) | border/familia |
|---|---|---|---|
| azul | #E8F2FF | #173F8A | #B3D9FF |
| púrpura | #EDE9FE | #6D28D9 | #C4B5FD |
| verde | #D1FAE5 | #065F46 | #A7F3D0 |
| ámbar | #FEF3C7 | #92400E | #FDE68A |
| rojo | #FEE2E2 | #B91C1C | #FECACA |
| rosado | #FCE7F3 | #BE185D | #FBCFE8 |
| naranja | #FFEDD5 | #C2410C | #FED7AA |
| celeste | #E0F2FE | #0369A1 | #BAE6FD |

REGLAS:
- Color de dimensión SOLO en chips/badges + banda superior de 8-16px en detalle. NUNCA fondos de tarjetas completas.
- Texto del chip siempre el `text` del triplete (hoy falla 7/8 → se arregla).
- Migrar los 4 archivos que tienen hex de dimensión a este módulo.

### 2.5 Estados (estado-agrupado) — semántica, no dimensión
- ok → triplete verde · update → ámbar · late → rojo (reutiliza 2.4).

### 2.6 Tipografía y forma
- Montserrat = display (h1-h3, KPIs) · Inter = UI/body (ya global).
- Escala: display 36/44 · h1 30/38 · h2 24/32 · h3 18/26 · body 16/24 · small 14/20 · caption 12/16.
- PROHIBIDO <12px: subir 10-11px de /indicadores.
- Radio: tarjetas 12px, `--radius 0.5rem` ya definido. Sombra única suave azul (unificar .kpi-card / .dashboard-container en `--shadow-card`).

---

## 3. VARIACIÓN POR TIPO DE PÁGINA (solo estructura — el color es SIEMPRE el tema global)

| Ruta | Tipo | Tratamiento estructural |
|---|---|---|
| `/` | Landing | Hero surface-strong (navy) + texto blanco; secciones alternan base/alt; KPIs borde azul |
| `/indicadores` | Listado | Base blanca + PageHeader compartido; barra de filtros sticky; tarjetas borde; color solo en chips |
| `/indicador/:id` | Detalle individual | PageHeader + banda superior de DIMENSIÓN (8-16px, único uso de color de fondo por dimensión); Hero claro (no navy); DashboardCard blanco; Ficha/Fórmula sobre surface-alt |
| `/kimnia` | Herramienta | Tratamiento estándar como el resto: base blanca + PageHeader; tarjetas/burbujas blancas con borde; los fondos tintados actuales pasan a surface-alt (regla global de secciones alternas). SIN excepción de superficie |
| `/metodologia` `/glosario` `/contacto` `/calendario` | Contenido editorial | Las 4 UNIFORMES: base blanca + secciones/bandas surface-alt, tarjetas blancas, acordeones border |
| `/estado-agrupado` | Estado/datos | Base blanca; tarjetas con triplete de estado (ok/update/late) |
| `/404` | Error | Base blanca o surface-strong simple, sin variantes |

## 4. MECÁNICA (fases; cada una termina verificada)

1. ✅ HECHO (2026-08-22): tokens `--color-surface-*` + `--shadow-card` en index.css; header #0073CC → navy brand-dark (#03122E); `.kpi-card` border → var(--color-brand-primary). Creación de `client/src/features/indicadores/dimensionColors.ts` (8 tripletes AA + DEFAULT). Migrados: Indicadores.tsx (eliminado COLOR_MAP local ~30 hex), Metodologia.tsx, EstadoAgrupado.tsx, DashboardCard.tsx, TechnicalSheet.tsx, HeaderUCT.tsx. Verificado: tsc ✓ · vitest 44/44 ✓ · build ✓ · utilidades Tailwind (bg-surface-muted, bg-brand-pale, text-brand-*, border-brand-pale, focus:ring-brand-primary/20, bg-brand-primary/30) generadas ✓.
   - DECISIÓN familias: canónicas = page2-resources (íconos 01..08). BUG resuelto: COLOR_MAP tenía dim 2=rojo / dim 3=verde INVERTIDAS vs recursos (hoy se renderizaba verde/rojo); normalizado a familias de recursos (dim 2=verde, dim 3=rojo).
   - Queda mecánico pendiente de Fase 4 (superficies/PageHeader): hex restantes en Contacto (45), NotebooksLMS (30), Glosario (21), FormulaBlock (15), IndicadorPage (8), Calendario (5), Hero (4), DashboardCard status-dot 3 (#27AE60/#F59E0B/#4B5563), TechnicalSheet badges 7, Metodologia 2 (#B3D9FF/#FFFFFF), IndicadorDetail 2, Home 1.
2. `dimensionColors.ts` + migrar los 4 archivos de dimensión. Verificar chips AA por cálculo de contraste (script). → (dimensión terminado en F1; restos de F4 arriba)
3. ✅ HECHO (2026-08-22): componente `client/src/components/PageHeader.tsx` (white + borde brand-pale + breadcrumb auto con "Inicio" + eyebrow + h1 font-black text-brand-dark + subtítulo + banda `bandColor`). Implementado en los 7 interiores planos: Indicadores, EstadoAgrupado, Metodología, Glosario, Contacto, Calendario (eliminado su hero oscuro) + IndicadorDetail recibe banda superior de DIMENSIÓN (h-2, color sólido de su triplete). Verificado: tsc ✓ · vitest 44/44 ✓ · build ✓.
   - DECISIÓN (posteriormente REVERTIDA): en F3 KimnIA (NotebooksLMS) y el Hero del detalle conservaron su hero oscuro. Por pedido del usuario, **KimnIA fue normalizado después** (commit c83a368): se eliminó el hero oscuro/gradiente/violetas y se le puso el PageHeader estándar + CTAs reestilizadas. El Hero del detalle individual conserva su hero (identidad de "indicador individual").
   - Tipos corregidos en paso: "Sistema de Indicadores de Genero"→"Género", "Glosario de Genero"→"Género", subtítulos sin acentos normalizados.
4. ✅ HECHO (2026-08-22): superficies por página migradas a `surface-base` (interno blanco azulado): reemplazados `#F5F4F8`/`#F8F9FA`/`surface-muted` en Indicadores, EstadoAgrupado, Metodología, Glosario, Contacto, NotebooksLMS, IndicadorDetail, IndicadorPage. Migrados ~131 hex restantes a tokens: brand-primary/dark/pale/light/accent, nuevo `brand-mid` (#B3D9FF), `status-ok/update/late`, y Tailwind para acentos (amber/emerald/indigo/sky). tarjetas blancas + bordes brand-pale + inputs/badges surface-alt. Verificado: tsc ✓ · vitest 44/44 ✓ · build ✓ · utilidades nuevas (bg-surface-base, bg-brand-mid, bg-status-*) generadas ✓.
5. ✅ HECHO (2026-08-22): grep-verify META — CERO hex hardcodeados fuera de index.css, dimensionColors.ts y page2-resources.ts (0 usos).
6. ✅ HECHO (2026-08-22): fix overflow vertical del header/selects — `min-w-0` en los 2 selects de filtro de /indicadores (elimina el desborde horizontal de 95px a 1440px, flexbox shrink). Tipografía mínima: subidos 10-11px→12px (`text-xs`) en Indicadores (id/badge/Área/Dimensión), NotebooksLMS (tag pill) y HeaderUCT (barra superior + nav + menú móvil). Typos "Genero"→"Género" en h1 ya corregidos en Fase 3.
   - NOTA: el glosario conserva términos/datos sin acento ("Brecha de genero", "Genero", etc.) — es contenido de datos, fuera del refactor de código (NICE-TO-HAVE de contenido).

## 5. CRITERIO DE ÉXITO
- Todas las páginas se sienten "del mismo sitio" al navegar: mismo header/footer, mismo patrón de inicio de página (PageHeader), misma regla de color.
- La única diferencia perceptible entre páginas es su TIPO (listado vs detalle vs herramienta vs contenido vs estado), no un dialecto de paleta.

---

## 6. TRABAJO POSTERIOR A LAS FASES (header + barra superior + fixes)

7. ✅ Dockerfile (commit 65e7f85): eliminado `COPY --from=source /src/app/patches ./patches` — rompía el build de Render (no existe `patches/` ni patchedDependencies). Es la causa por la que Render servía un deploy viejo (build fallaba).
8. ✅ Normalización de /kimnia (commit c83a368): eliminado el hero oscuro (gradiente navy→azul + glows violeta `rgba(124,58,237)`) y reemplazado por el PageHeader estándar; CTAs reestilizadas (botón primary + outline). Verificado en chunk compilado (PageHeader presente, radial-gradient/violetas ausentes).
9. ✅ Hamburguesa (commit f7afcfc): `xl:hidden` en el botón — solo visible <1280px.
10. ✅ Barra superior estilo UCT (commits 4dbdd76, 4761b3e, fe6d83e, ce40135):
    - Gradiente azul `linear-gradient(128.19deg, #048fd4 15.7%, #0086ca 74.26%)` (NO navy), altura 35px, Roboto 13px weight 400 uppercase.
    - Links a TODAS las secciones KimnGenero (Inicio, Indicadores, Vista General, KimnIA, Modelo, Calendario, Glosario, Contacto) con separadores verticales `1px solid rgba(255,255,255,0.2)`, alineados a la derecha.
    - Iconos de redes sociales VECTORIALES (SVG inline) con URLs reales de UCT (kimn.uct.cl): Facebook `canaluctemuco`, Instagram `uctemuco`, YouTube `canaluctemuco`, LinkedIn `uctemuco`, Twitter `UC_Temuco`. En círculos `bg-white/20`.
    - Antiguos "CENTRO DE AYUDA / PORTAL DE PAGOS" movidos a la sección "Accesos institucionales" del menú móvil.
    - Roboto agregado al `@import` de index.css.
    - Tests actualizados a secciones + redes.

## 7. ESTADO DE DEPLOY (IMPORTANTE)
- Todo lo anterior está **committeado y pusheado a `origin/main`** (rama main). Último commit: `ce40135`.
- Render usa **deploy manual** ("Deploy latest commit"). El sitio en producción estaba sirviendo el commit `65e7f85` (build fallaba antes por el Dockerfile). Para ver el resultado final hay que clickear `Deploy latest commit` en el dashboard; el JS cambia de `index-DI4XnGOd.js` a otro hash (señal de que el deploy tomó el código nuevo).
- Verificación en producción: CSS debe contener tokens `surface-base`, `status-ok`, `brand-mid`, `brand-pale`; página `/kimnia` con PageHeader blanco (sin hero ni violetas); hamburguesa ausente en pantallas ≥1280px; barra superior azul con gradiente `#048fd4→#0086ca`.
- PENDIENTE menor: contenido del glosario sin acentos (deuda de datos, NICE-TO-HAVE).

## 8. AUDITORÍA DE TEMA Y COLOR + FIXES (2026-08-23)

Auditoría de verificación (informe entregado en chat, NO se commitea al repo — regla del proyecto).
Veredicto: tema global sólido; se ejecutaron los "detalles" detectados. Commits `576446a` → `ef841c6` (todos pusheados a `main`):

1. **CRÍTICO — aliases var(--brand-*)/var(--text-*)** en `:root` (index.css): `@theme inline` NO
   emite variables en runtime (solo `--color-*`). Las clases `bg-[var(--brand-primary)]` /
   `text-[var(--text-muted)]` del Home y Footer quedaban con var() sin definir → título
   "Kimn Género" gris heredado y botones del hero transparentes con texto blanco (invisibles).
   Verificado en CSS compilado: `--brand-primary:#0176de`, `--text-muted:#6b7280` ahora existen.
2. **Contraste AA 4.5:1** — textos gray-400 (2.54) → gray-600 (7.56) en captions/breadcrumbs/
   labels (PageHeader, Contacto, Glosario, HeaderUCT); iconos/chevrons/separadores gray-400 →
   gray-500 (4.83); placeholders gray-300 (1.47) → gray-600; asteriscos red-500 → red-600 (4.97).
   Topbar UCT (blanco sobre #048fd4, 3.57) se mantiene como excepción institucional heredada.
3. **Tipografía ≥12px** — Home: títulos de tarjetas de dimensión 0.66–0.68rem y badge
   "N indicadores" 0.4rem (6.4px) → `text-xs` (12px); botones hero/CTA 0.68/0.6rem → `text-xs`.
4. **KimnIA slate→gray** — 34 usos de escala slate (border/bg/text slate-50..900) unificados a
   la escala gray del resto del sitio; labels slate-400 → gray-600.
5. **404 al tema** — gradiente slate-50/100 → `surface-base`; botón `bg-blue-600/700` (azul fuera
   de paleta) → `brand-primary`/`brand-dark`; textos slate → gray; h1 → `brand-dark`.
6. **Tokens muertos eliminados** del @theme: `--color-bg-light`, `--color-bg-lighter`,
   `--color-border-blue` (sin uso).

**EXCEPCIÓN DOCUMENTADA (§2.4):** las 8 tarjetas de dimensión del **Home** usan el color de
dimensión como fondo COMPLETO (inline style `backgroundColor`) — identidad de la landing heredada
de kimn.uct.cl, fuera de la regla "solo chips/badges + banda 8-16px". Texto blanco sobre esos
fondos pasa AA (5.18–15.72). No tocar sin decisión explícita.

**PENDIENTES:** redeploy manual en Render · guía completa del sitio (fase B, separada de esta
auditoría — actualización de contenido → paleta).