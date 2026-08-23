# NOTAS — AUDITORÍA Y ACTUALIZACIÓN DE LA PÁGINA INDIVIDUAL DE INDICADOR (/indicador/:id)

Fecha: 2026-08-22 · Alcance: página de detalle de indicador individual (Hero + Dashboard/iframe + Fórmula + Ficha Técnica)
Estado: ✅ COMPLETADO (fases A/B/C/D implementadas, verificadas y pusheadas a `main`).
  - Fase A `94ab0ae`: Hero claro (fin excepción navy) + iframe Power BI sin marco + divisor elipse eliminado + sticky bar reveal.
  - Fase B `35fbf12`: Opción 1 — títulos de acordeón a text-brand-dark; acentos semánticos amber/emerald/indigo conservados.
  - Fase C `af60b9d`: reveal por scroll en página individual (Hero, toolbar, acordeones; iframe sin animar).
  - Fase D (verificación, sin cambio de código): contraste AA de acentos PASS (6.37–10.22) y CERO hex hardcodeados en componentes UI; status-dots en tokens; sin gradiente navy residual (solo hover:bg-brand-dark de botones).
  Verificado en cada fase: tsc ✓ · vitest 44/44 ✓ · build ✓.

---

## 1. INVENTARIO REAL DE LA PÁGINA (auditado en código)

Flujo de componentes: `IndicadorPage` (sticky bar "Volver") → `IndicadorDetail` (banda dimensión h-2 + **Hero** + divisor elipse + contenido) → `DashboardCard` (Power BI iframe) + `FormulaBlock` (Metodología) + `TechnicalSheet` (Ficha Técnica).

| Bloque | Problema detectado | Estado |
|---|---|---|
| **Hero** (`detail/Hero.tsx`) | Fondo gradiente navy (`from-brand-dark via-brand-dark to-brand-primary`) con título/detalles en blanco — rompe el tema global (era la "excepción navy" que quedaba). | ✅ REWRITE a claro (blanco + tokens) — SIN commit |
| **DashboardCard** (`detail/DashboardCard.tsx`) | Marco del iframe: contenedor `rounded-xl bg-white shadow-md` + recuadro pale `bg-gradient-to-br from-brand-pale`. Power BI con caja visible. | ✅ REWRITE a frameless (edge-to-edge sobre surface-base) — SIN commit |
| **IndicadorDetail** (`IndicadorDetail.tsx`) | Divisor decorativo `clipPath: ellipse(55% 100% ...)` + `bg-surface-base` — era la transición desde el hero navy; con hero claro es ruido. | 🔴 a limpiar (Fase A) |
| **FormulaBlock** (`detail/FormulaBlock.tsx`) | Caja de fórmula `border-indigo-200 bg-indigo-50` + chips/nota con acentos ámbar — acentos SEMÁNTICOS. Sin hex sueltos. | 🟡 a decidir (Fase B) |
| **TechnicalSheet** (`detail/TechnicalSheet.tsx`) | Badges "DB" (`bg-amber-100 text-amber-800`) e "i" (`bg-emerald-100`), nota `bg-amber-50 border-amber-500` — acentos SEMÁNTICOS. Sin hex sueltos. | 🟡 a decidir (Fase B) |
| Acentos restantes | `bg-amber-100`×2, `indigo-50`, `emerald-100`, `amber-50`. NO quedan hex hardcodeados en la página (los status-dots ya pasaron a `bg-status-ok/update`). | — |

**Punto clave del análisis**: en esta página ya no hay hex sueltos; los acentos que quedan (ámbar/verde/índigo) son **semánticos** (aviso/ok/zonas de fórmula), no de marca. No deben forzarse al azul institucional sin criterio.

---

## 2. PLAN DE TRABAJO POR FASES (cada fase = editar + verificar + commit/push)

### FASE A — Persistir rediseño Hero/iframe + limpiar remanentes del hero navy
Cambios:
1. Commit de lo YA hecho (sin commit): `Hero.tsx` claro + `DashboardCard.tsx` frameless.
2. `IndicadorDetail.tsx`: **quitar/aplanar el divisor elipse** (clipPath + la franja `h-8 bg-surface-base`) que quedó de la era navy → transición plana blanco→base.
3. `IndicadorPage.tsx`: validar la sticky bar "Volver" sobre el nuevo fondo claro (opcional: darle `Reveal down` + mantener alturas).
Verificación: `npm run check` · `npm run test` (44/44) · `npm run build` · git push.
Commit ref: `fix(indicador): hero claro (fin excepcion navy) + iframe power BI sin marco + divisor plano`

### FASE B — Consistencia de acordeones (Ficha Técnica + Fórmula)
Decisión de criterio (definir con el usuario antes de ejecutar):
- Opción 1 (RECOMENDADA): **mantener los acentos semánticos** (ámbar=aviso, verde=ok, índigo=zona fórmula) por su valor informativo; solo unificar forma/patrón (mismo `rounded-lg`, `border`, hover `bg-brand-pale`, título `font-bold text-gray-900`→`text-brand-dark`).
- Opción 2 (máxima homogeneidad): migrar TODO a tokens brand (brand-pale/brand-primary) perdiendo el matiz semántico de la fórmula/aviso.
Cambios concretos (Opción 1):
- `FormulaBlock`: chip "fx" ya es `bg-brand-pale text-brand-primary` ✓; normalizar título h3 a `text-brand-dark`; conservar caja índigo de fórmula y nota ámbar.
- `TechnicalSheet`: normalizar títulos h3 a `text-brand-dark`; conservar badges DB (ámbar) e i (verde) y nota ámbar.
- Verificar que `hover:bg-brand-pale` de los botones-acordeón quede igual en ambos.
Verificación: tsc · test · build · push.

### FASE C — Micro-interacciones + reveal en la página (alinear con la Fase de animaciones ya desplegada)
La página individual aún no tiene reveal (el resto del sitio sí). Añadir:
- `<Reveal>` en: Hero (variant `down`), toolbar del DashboardCard (variant `up`), acordeones Ficha Técnica y Fórmula (variant `up` con stagger), y bloques internos (fórmula/variables/instructivo) si no es ruido.
- El **iframe NO se anima** (contenido pesado — principio "no animar contenido denso"). Solo su toolbar.
- Reutilizar componente `<Reveal>` + CSS `.kr` existentes (cero dependencias nuevas).
Verificación: tsc · test · build · push.

### FASE D — Accesibilidad y aceptación
- Contraste AA de chips semánticos pequeños (ej. "DB" ámbar-100/ámbar-800 a 32px) — calcular/confirmar.
- prefers-reduced-motion ya cubierto globalmente por `.kr`.
- Confirmar cero hex/acentos navy residuales en la página (grep-verify).
- Criterio de éxito: página individual 100% en tema global, iframe sin marco, acordeones consistentes, reveal alineado, todo pusheado.

---

## 3. DECISIONES PARA CONFIRMAR CON EL USUARIO (antes de ejecutar)
1. **Fase B**: ¿Opcion 1 (mantener acentos semánticos, solo normalizar forma) u Opción 2 (migrar todo a brand)?
2. **Fase C**: ¿aplicar reveal en esta página para igualarla al resto del sitio? (recomendado sí).
3. ¿Incluir en esta auditoría algo más de la página (p.ej. el `DashboardCard` cuando no hay iframe — `tipo:placeholder`)? Actualmente muestra "Visualizacion por Configurar" sobre surface-base frameless ya.

## 4. MEJORAS FUERA DE ALCANCE (no tocar en este plan)
- Funcionalidad de botones "Explorar Datos"/"Descargar Reporte" (hoy toast "en desarrollo") — es producto, no estética.
- Contenido: textos sin acentos en datos ("Visualizacion por Configurar", "Ficha Tecnica", etc.) — deuda de contenido, NICE-TO-HAVE separado.
