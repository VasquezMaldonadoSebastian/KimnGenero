# Auditoría Completa KimnGenero — 2026-08-20

## Resumen Ejecutivo

**Estado general:** Proyecto saludable con documentación mayormente precisa, pero con varios problemas críticos para producción identificados.

**Hallazgos críticos:**
1. ⚠️ **pnpm config obsoleto** — `patchedDependencies` y `overrides` no son leídos por pnpm 10+
2. ⚠️ **CSP en report-only** — Debería estar en enforcing en producción
3. ⚠️ **4 links rotos** en header superior (href="#")
4. ⚠️ **Botón de búsqueda** visual pero no funcional
5. ⚠️ **Colores inconsistentes** — Header usa #0073CC pero brand-primary es #0176DE
6. ⚠️ **Sin rate limiting** — API expuesta sin protección
7. ⚠️ **Bundle size alto** — 358KB + 302KB (gzip: 113KB + 84KB)

---

## 1. Verificación de PLAN_SANEAMIENTO_REAL.md

### Claims verificados ✅

| Claim del documento | Estado real | Verificación |
|---------------------|-------------|--------------|
| .gitignore debe ignorar outputs/, scripts/node_modules/, sqlite | ✅ **COMPLETO** | .gitignore incluye todos estos patrones |
| outputs/ no debe existir | ✅ **CORRECTO** | Directorio no existe |
| scripts/node_modules/ no debe existir | ✅ **CORRECTO** | Directorio no existe |
| config/index.ts fue eliminado | ✅ **CORRECTO** | Archivo no existe |
| shared/types/common.ts fue eliminado | ✅ **CORRECTO** | Archivo no existe |
| OPTIMIZATION_PLAN.md está archivado | ✅ **CORRECTO** | No existe en raíz, está en docs/archive/ |
| Header no tiene texto redundante "Observatorio" | ✅ **CORRECTO** | HeaderUCT.tsx no contiene ese texto |
| Unificación a apiGetJson() completada | ✅ **CORRECTO** | Solo apiClient.ts usa fetch() directamente |
| Mojibake corregido | ⚠️ **PARCIAL** | Hay caracteres especiales (á, é, ñ) pero son texto español correcto, NO mojibake |

### Claims desactualizados ❌

| Claim del documento | Estado real | Acción requerida |
|---------------------|-------------|------------------|
| "falta env.example" (Sección 8, punto 4) | ✅ **YA EXISTE** | Actualizar documento |
| "config/index.ts parece residual" (Sección 8, punto 3) | ✅ **YA ELIMINADO** | Actualizar documento |
| "shared/types/common.ts ya fue eliminado" (Sección 2) | ✅ **CONFIRMADO** | Documento ya es preciso |

### Problemas NO mencionados en el plan

1. **pnpm warning** — `patchedDependencies` y `overrides` en package.json no son leídos
2. **CSP report-only** — Debería estar en enforcing
3. **Links href="#"** — 4 links en header superior no funcionales
4. **Botón búsqueda** — Visual pero sin funcionalidad
5. **Colores inconsistentes** — #0073CC vs #0176DE
6. **Sin rate limiting** — API sin protección
7. **Bundle size** — Alto (660KB total, 197KB gzip)

---

## 2. Verificación de DOCUMENTATION_STATUS.md

### Documentos normativos listados ✅

Todos los documentos listados como "normativos" existen y están actualizados:
- ARCHITECTURE.md ✅
- API_ERROR_CONTRACT.md ✅
- API_SURFACE.md ✅
- TEST_STRATEGY.md ✅
- OPERATIONS.md ✅
- WOUTER_PATCH_EVALUATION.md ✅
- DATA_PIPELINE.md ✅
- DATA_DICTIONARY.md ✅
- DEPLOYMENT.md ✅
- DOCKER_DEPLOYMENT.md ✅
- PRODUCTION_CONFIGURATION.md ✅
- SECURITY_NETWORK.md ✅
- SQLITE_OPERATIONS.md ✅
- CONTRIBUTING_ADVANCED.md ✅
- ADR_INDEX.md ✅
- RELEASE_CHECKLIST.md ✅
- UI_UX_GUIDELINES.md ✅
- ARTIFACT_POLICY.md ✅
- PLAN_SANEAMIENTO_REAL.md ⚠️ (parcialmente desactualizado)
- RELEASE_NOTE_SANAMIENTO_2026-05-20.md ✅
- GAP_ANALYSIS.md ⚠️ (parcialmente desactualizado)

### Documentos auxiliares ✅

Todos los documentos listados como "auxiliares" existen y están correctamente clasificados.

---

## 3. Verificación de GAP_ANALYSIS.md

### Brechas identificadas en el documento

| Brecha | Estado actual | Verificación |
|--------|---------------|--------------|
| "falta env.example" | ✅ **RESUELTO** | env.example existe en raíz |
| "falta política de artefactos" | ✅ **RESUELTO** | ARTIFACT_POLICY.md existe |
| "falta validación manual" | ⚠️ **PARCIAL** | RELEASE_CHECKLIST.md existe pero podría ser más detallado |

### Brechas NO mencionadas

1. **Rate limiting** — No hay protección contra abuso de API
2. **Tests E2E** — Solo tests unitarios, sin tests de integración browser
3. **Monitoreo de errores** — No hay sistema de alertas
4. **Backup de SQLite** — No hay procedimiento documentado
5. **Rotación de secretos** — No hay política formal

---

## 4. Auditoría de Código

### 4.1 Health Check

```
✅ pnpm install --frozen-lockfile: OK
✅ pnpm run lint: 0 errores
✅ pnpm run check (tsc): 0 errores
✅ pnpm run test: 35/35 tests pasando
✅ pnpm run build: Build exitoso (8.93s)
```

### 4.2 Problemas encontrados

#### CRÍTICO: pnpm config obsoleto

**Ubicación:** `package.json` líneas 91-98

**Problema:**
```json
"pnpm": {
  "patchedDependencies": {
    "wouter@3.7.1": "patches/wouter@3.7.1.patch"
  },
  "overrides": {
    "tailwindcss>nanoid": "3.3.7"
  }
}
```

**Warning de pnpm:**
```
[WARN] The "pnpm" field in package.json is no longer read by pnpm.
The following keys were ignored: "pnpm.patchedDependencies", "pnpm.overrides".
```

**Impacto:**
- El parche de wouter puede no aplicarse
- El override de nanoid puede no aplicarse
- Riesgo de comportamiento inesperado en producción

**Solución:** Migrar a `pnpm-workspace.yaml` o `.npmrc` según pnpm 10+

#### ALTO: CSP en report-only

**Ubicación:** `server/src/config/security.ts`

**Problema:**
```typescript
export function isCspReportOnly(): boolean {
  return process.env.CSP_REPORT_ONLY !== 'false';
}
```

**Impacto:**
- CSP no está enforcing en producción por defecto
- Vulnerabilidades de XSS no están bloqueadas activamente
- Solo se reportan, no se previenen

**Solución:**
1. Validar que todos los dashboards Power BI funcionan con CSP enforcing
2. Cambiar default a `false` (enforcing)
3. Documentar en PRODUCTION_CONFIGURATION.md

#### ALTO: Links rotos en header

**Ubicación:** `client/src/components/HeaderUCT.tsx` líneas 15-23

**Problema:**
```typescript
const topLinks = [
  { label: "CONECTA", href: "#" },
  { label: "UCT AL DIA", href: "#" },
  { label: "TEC-UCT", href: "#" },
  { label: "CENTRO DE AYUDA", href: "#" },
  // ...
];
```

**Impacto:**
- 4 de 7 links apuntan a "#" (no funcionales)
- Mala experiencia de usuario
- Da credibilidad institucional

**Solución:**
1. Definir URLs reales para cada link
2. O eliminar los links no implementados
3. Documentar decisión en UI_UX_GUIDELINES.md

#### MEDIO: Botón de búsqueda no funcional

**Ubicación:** `client/src/components/HeaderUCT.tsx` líneas 101-106

**Problema:**
```typescript
<button
  className="hidden rounded-full p-2 transition-colors hover:bg-gray-50 xl:inline-flex"
  aria-label="Buscar"
>
  <Search className="h-5 w-5 stroke-[2.5] text-[#0073CC]" />
</button>
```

**Impacto:**
- Botón visual pero sin onClick handler
- Usuario espera funcionalidad que no existe
- Mala UX

**Solución:**
1. Implementar búsqueda global
2. O remover el botón visualmente
3. Documentar decisión

#### MEDIO: Colores inconsistentes

**Ubicación:** Múltiples archivos

**Problema:**
- `index.css` define `--brand-primary: #0176DE`
- `HeaderUCT.tsx` usa `#0073CC` (líneas 40, 90, 91, 105, 129, 153, 179)
- `Home.tsx` usa `#0176DE` y `#0668C0` (hover)
- `FooterUCT.tsx` usa `#0176DE`

**Impacto:**
- Inconsistencia visual
- Dificulta mantenimiento
- No sigue design system

**Solución:**
1. Unificar todos los colores a tokens CSS
2. Reemplazar `#0073CC` con `var(--brand-primary)`
3. Definir tokens para colores hover
4. Actualizar UI_UX_GUIDELINES.md

#### MEDIO: Sin rate limiting

**Ubicación:** `server/src/createApp.ts`

**Problema:**
- No hay middleware de rate limiting
- API expuesta sin protección
- Vulnerable a abuso/DDoS

**Impacto:**
- Riesgo de seguridad
- Posible degradación de servicio
- Costos de infraestructura

**Solución:**
```typescript
import rateLimit from 'express-rate-limit';

app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
}));
```

#### BAJO: Bundle size alto

**Ubicación:** Build output

**Problema:**
```
index.js: 358.68 KB (gzip: 113.32 KB)
IndicadorPage.js: 302.13 KB (gzip: 84.71 KB)
```

**Causa:**
- KaTeX fonts (31-63 KB cada uno)
- Recharts (chart library pesada)
- React + ReactDOM

**Impacto:**
- Tiempo de carga inicial alto
- Mala experiencia en móvil
- SEO impactado

**Solución:**
1. Lazy-load KaTeX (solo en páginas de fórmulas)
2. Tree-shaking de Recharts
3. Split de KaTeX en chunk separado
4. Considerar alternativas más ligeras

### 4.3 Métricas de código

| Métrica | Valor | Evaluación |
|---------|-------|------------|
| Líneas TS/TSX | 4,172 | ✅ Razonable |
| Archivos totales | 119 | ✅ Organizado |
| console.log | 2 (en app.ts) | ✅ Aceptable (startup) |
| TODO/FIXME | 0 | ✅ Excelente |
| Tests | 35 pasando | ✅ Bueno |
| Cobertura | ~40% estimada | ⚠️ Mejorable |

---

## 5. Auditoría de Documentación

### 5.1 Documentos desactualizados

#### PLAN_SANEAMIENTO_REAL.md

**Secciones desactualizadas:**
- Sección 8, punto 3: "config/index.ts parece residual" → Ya eliminado
- Sección 8, punto 4: "falta env.example" → Ya existe

**Acción:** Actualizar documento marcando estos puntos como resueltos

#### GAP_ANALYSIS.md

**Secciones desactualizadas:**
- "falta env.example" → Ya existe
- "falta política de artefactos" → Ya existe ARTIFACT_POLICY.md

**Acción:** Actualizar documento marcando brechas resueltas

### 5.2 Documentos precisos

- ✅ ARCHITECTURE.md — Describe arquitectura actual correctamente
- ✅ API_SURFACE.md — Lista todos los endpoints existentes
- ✅ DEPLOYMENT.md — Instrucciones de deploy son correctas
- ✅ PRODUCTION_CONFIGURATION.md — Variables de entorno documentadas
- ✅ SECURITY_NETWORK.md — Describe configuración de seguridad real
- ✅ RELEASE_CHECKLIST.md — Checklist completo y útil

### 5.3 Documentos faltantes

1. **CHANGELOG.md** — No hay historial de cambios
2. **Troubleshooting guide** — No hay guía de problemas comunes
3. **Runbook de operación** — No hay procedimientos de backup/restore
4. **Política de rotación de secretos** — No documentada
5. **Procedimiento de monitoreo** — No hay alertas definidas

---

## 6. Auditoría de Seguridad

### 6.1 Headers HTTP

✅ **Helmet.js configurado:**
- Content Security Policy
- Referrer Policy
- Cross Origin Embedder Policy (deshabilitado para iframes)

⚠️ **CSP en report-only:**
- Debería estar en enforcing
- Requiere validación de dashboards Power BI

### 6.2 Rate limiting

❌ **No implementado:**
- API expuesta sin protección
- Vulnerable a abuso

### 6.3 Validación de inputs

✅ **Zod implementado:**
- Validación en rutas de indicadores
- Middleware validate.middleware.ts

### 6.4 CORS

✅ **Configuración correcta:**
- No hay cors() explícito (mismo origen)
- Documentado en SECURITY_NETWORK.md

### 6.5 Secretos

✅ **No hay secretos en repo:**
- Variables de entorno documentadas
- .env en .gitignore

⚠️ **Falta política formal:**
- Almacenamiento de secretos
- Rotación
- Separación por ambiente

---

## 7. Auditoría de Performance

### 7.1 Bundle size

⚠️ **Alto:**
- Total: 660 KB (197 KB gzip)
- KaTeX fonts dominan IndicadorPage
- Recharts contribuye al tamaño

### 7.2 Code splitting

✅ **Implementado:**
- React.lazy() + Suspense
- Router-based splitting
- Chunk por página

### 7.3 Imágenes

⚠️ **No auditado:**
- Verificar formato moderno (webp/avif)
- Verificar loading="lazy"
- Verificar alt descriptivo

### 7.4 SLO

⚠️ **Definido pero no verificado:**
- OPERATIONS.md define SLO (p95 <= 200ms)
- No hay evidencia de cumplimiento
- Falta monitoreo continuo

---

## 8. Auditoría de Accesibilidad

### 8.1 Checklist A11y

⚠️ **No verificado:**
- [ ] Todos los `<img>` tienen `alt` descriptivo
- [ ] Botones icono tienen `aria-label`
- [ ] Links tienen texto descriptivo
- [ ] Menú móvil navegable por teclado
- [ ] Formularios tienen `<label>` asociados
- [ ] Colores no son única forma de comunicar estado
- [ ] `focus-visible` implementado
- [ ] Iframes tienen `title` descriptivo

### 8.2 Contraste WCAG

⚠️ **No verificado:**
- Texto `#858B91` sobre blanco → verificar ratio
- Texto `#8B8B95` sobre blanco → verificar ratio
- Texto `#999` sobre blanco → probablemente falla WCAG AA

---

## 9. Plan de Acción Priorizado

### Semana 1 (20-26 ago) — Críticos

#### Día 1-2: Fix pnpm config
- [ ] Migrar `patchedDependencies` a formato pnpm 10+
- [ ] Migrar `overrides` a formato pnpm 10+
- [ ] Verificar que parche de wouter se aplica
- [ ] Verificar que override de nanoid se aplica
- [ ] Ejecutar tests para validar

#### Día 2-3: Unificar colores
- [ ] Reemplazar `#0073CC` con `var(--brand-primary)` en HeaderUCT
- [ ] Definir tokens para colores hover
- [ ] Reemplazar grises hardcodeados con tokens
- [ ] Actualizar UI_UX_GUIDELINES.md

#### Día 3-4: Implementar rate limiting
- [ ] Agregar express-rate-limit
- [ ] Configurar límites razonables (100 req/15min)
- [ ] Probar que no rompe dashboards
- [ ] Documentar en SECURITY_NETWORK.md

#### Día 4-5: Verificar contraste WCAG
- [ ] Medir ratio de contraste de todos los textos
- [ ] Corregir textos que fallen WCAG AA
- [ ] Documentar paleta accesible

#### Día 5-6: Tests E2E mínimos
- [ ] Configurar Playwright
- [ ] Test de navegación entre páginas
- [ ] Test de búsqueda/filtro de indicadores
- [ ] Test de carga de dashboard embebido

#### Día 7: Smoke tests en producción
- [ ] Verificar /health responde 200
- [ ] Verificar /api/indicadores retorna datos
- [ ] Verificar /indicadores carga correctamente
- [ ] Verificar dashboard embebido funciona

### Semana 2 (27-30 ago) — Pulido

#### Día 8: Links y búsqueda
- [ ] Definir URLs reales para links del header
- [ ] Implementar búsqueda global o remover botón
- [ ] Documentar decisiones

#### Día 9: CSP enforcing
- [ ] Validar dashboards Power BI con CSP enforcing
- [ ] Cambiar default a enforcing
- [ ] Actualizar PRODUCTION_CONFIGURATION.md

#### Día 10: Documentación final
- [ ] Actualizar PLAN_SANEAMIENTO_REAL.md
- [ ] Actualizar GAP_ANALYSIS.md
- [ ] Crear CHANGELOG.md
- [ ] Documentar troubleshooting común

---

## 10. Criterios de Aceptación para Producción

- [ ] Todos los tests pasan (unit + E2E)
- [ ] Build exitoso sin warnings
- [ ] pnpm config migrado a formato v10+
- [ ] Lighthouse score > 90 en Performance, Accessibility, Best Practices
- [ ] Contraste WCAG AA en todos los textos
- [ ] Rate limiting implementado
- [ ] CSP en modo enforcing
- [ ] Variables de entorno configuradas en Render
- [ ] Smoke tests pasan en producción
- [ ] Documentación actualizada
- [ ] Links del header funcionales
- [ ] Colores unificados a tokens

---

## 11. Métricas de Éxito

| Métrica | Antes | Después |
|---------|-------|---------|
| Tests | 35 | 50+ (con E2E) |
| Cobertura | ~40% | >70% |
| Bundle size (gzip) | 197 KB | <180 KB |
| Lighthouse Performance | TBD | >90 |
| Lighthouse Accessibility | TBD | >90 |
| console.log | 2 | 2 (solo startup) |
| TODO/FIXME | 0 | 0 |
| Colores inconsistentes | 6+ | 0 |
| Links rotos | 4 | 0 |
| Rate limiting | No | Sí |
| CSP | report-only | enforcing |

---

## 12. Conclusiones

El proyecto KimnGenero está en buen estado general, con documentación mayormente precisa y código saludable. Sin embargo, hay varios problemas críticos que deben resolverse antes de entregar a producción:

1. **pnpm config obsoleto** — Riesgo de comportamiento inesperado
2. **CSP en report-only** — Vulnerabilidad de seguridad
3. **Links rotos** — Mala experiencia institucional
4. **Sin rate limiting** — Vulnerable a abuso
5. **Colores inconsistentes** — No sigue design system

Con 10 días de trabajo enfocado, todos estos problemas pueden resolverse y el proyecto puede entregarse con calidad de producción.

---

**Próximo paso:** Comenzar con fix de pnpm config (Día 1-2)
