# Plan de Auditoría para Producción — KimnGenero

**Fecha:** 2026-08-20
**Objetivo:** Auditoría integral del proyecto KimnGenero para validar que está listo para entrega a producción en https://kimngenero.onrender.com
**Deadline EVA:** 30-ago-2026 (10 días)

---

## Estado Base (Health Check 20-ago-2026)

| Check | Resultado |
|-------|-----------|
| `pnpm install --frozen-lockfile` | ✅ OK |
| `pnpm run lint` | ✅ 0 errores |
| `pnpm run check` (tsc) | ✅ 0 errores |
| `pnpm run test` | ✅ 35/35 tests pasando (9 archivos) |
| `pnpm run build` | ✅ Build exitoso (8.93s) |
| Bundle client | index: 358 KB (gzip 113 KB), IndicadorPage: 302 KB (gzip 84 KB) |
| Bundle server | dist/index.js: 47.4 KB |
| console.log en código | 1 |
| TODO/FIXME | 1 |
| Líneas TS/TSX | ~4,172 |
| Archivos totales | 119 |

---

## FASE 1 — Código y Calidad (Prioridad ALTA)

### 1.1 Warning de pnpm (CRÍTICO)
**Problema:** `pnpm.patchedDependencies` y `pnpm.overrides` en `package.json` ya no son leídos por pnpm 10+.
**Impacto:** El parche de `wouter@3.7.1` y el override de `nanoid` pueden no aplicarse en producción.
**Acción:** Migrar configuración a `pnpm-workspace.yaml` o `.npmrc` según documentación oficial pnpm 10.
**Archivo:** `package.json`, posiblemente crear `pnpm-workspace.yaml`

### 1.2 Revisar console.log restante
**Acción:** Localizar y eliminar o reemplazar con logger estructurado (pino).
**Comando:** `grep -rn "console.log" client/src server/src`

### 1.3 Revisar TODO/FIXME restante
**Acción:** Resolver o documentar como issue futuro.
**Comando:** `grep -rn "TODO\|FIXME\|XXX" client/src server/src`

### 1.4 CSP en modo report-only
**Problema:** `CSP_REPORT_ONLY=true` por defecto. En producción debería estar en modo enforcing.
**Acción:** Validar que todos los dashboards Power BI embebidos funcionan con CSP enforcing. Si sí, cambiar default a `false`.

### 1.5 Links del header superior
**Problema:** Los 7 links de la barra superior (CONECTA, UCT AL DIA, TEC-UCT, etc.) apuntan a `href="#"`.
**Acción:** Definir si se apuntan a URLs reales de la UCT o se eliminan del header.

### 1.6 Botón de búsqueda no funcional
**Problema:** El botón "Buscar" en el header no tiene funcionalidad implementada.
**Acción:** Implementar búsqueda global o remover el botón visualmente.

---

## FASE 2 — Paleta de Colores y Diseño Visual (Prioridad ALTA)

### 2.1 Auditoría de consistencia de colores
**Colores declarados en `index.css`:**
| Token | Valor | Uso |
|-------|-------|-----|
| `--brand-primary` | `#0176DE` | Azul UCT institucional |
| `--brand-dark` | `#03122E` | Sidebar, encabezados |
| `--brand-light` | `#173F8A` | Acentos oscuros |
| `--brand-pale` | `#E8F2FF` | Fondos suaves |
| `--brand-accent` | `#FEC60D` | Amarillo acento |

**Colores usados en componentes (hardcodeados):**
| Componente | Color | ¿Coincide con tokens? |
|------------|-------|----------------------|
| HeaderUCT | `#0073CC` | ❌ NO coincide con `#0176DE` |
| Home.tsx | `#0176DE`, `#0668C0` (hover) | ⚠️ Hover no es token |
| Home.tsx | `#858B91`, `#8B8B95` | ❌ Grises no definidos como tokens |
| FooterUCT | `#0176DE`, `#4A4A4A`, `#8B8B8B`, `#999`, `#E5E5E5` | ❌ Múltiples grises sin token |

**Acción:**
1. Unificar `#0073CC` (header) con `#0176DE` (brand-primary) — son azules distintos
2. Definir tokens para grises: `--text-secondary`, `--text-muted`, `--border-light`
3. Reemplazar todos los colores hardcodeados por variables CSS

### 2.2 Contraste WCAG
**Acción:** Verificar contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande.
**Puntos críticos:**
- Texto `#858B91` sobre fondo blanco → verificar ratio
- Texto `#8B8B95` sobre fondo blanco → verificar ratio
- Texto `#999` sobre fondo blanco → probablemente falla WCAG AA

### 2.3 Tipografía
- Montserrat (display/títulos) + Inter (body) — ✅ bien definido
- Verificar que las fuentes se cargan con `font-display: swap` para performance
- Verificar que no hay FOUT visible en carga lenta

### 2.4 Responsive
**Acción:** Revisar breakpoints en todas las páginas:
- Mobile (< 640px)
- Tablet (640-1024px)
- Desktop (> 1024px)
- Verificar que el menú móvil funciona correctamente
- Verificar que las grillas de dimensiones se adaptan

---

## FASE 3 — Performance (Prioridad MEDIA)

### 3.1 Bundle size
| Chunk | Tamaño | gzip | Evaluación |
|-------|--------|------|------------|
| index.js | 358 KB | 113 KB | ⚠️ Alto — contiene React + recharts + KaTeX |
| IndicadorPage.js | 302 KB | 84 KB | ⚠️ Alto — KaTeX fonts dominan |
| index.css | 65 KB | 12 KB | ✅ OK |

**Acciones:**
- Evaluar lazy-loading de KaTeX (solo necesario en páginas de fórmulas)
- Evaluar tree-shaking de recharts (¿se usan todos los chart types?)
- Considerar split de KaTeX en chunk separado

### 3.2 Imágenes
- Verificar que todas las imágenes están en formato moderno (webp/avif)
- Verificar que tienen `loading="lazy"` donde aplica
- Verificar que tienen `alt` descriptivo (accesibilidad)

### 3.3 Code splitting
- ✅ Ya usa `React.lazy()` + `Suspense` para todas las páginas
- ✅ Router-based splitting automático
- Verificar que el fallback de Suspense sea un skeleton, no solo "Cargando..."

---

## FASE 4 — Accesibilidad (Prioridad MEDIA)

### 4.1 Checklist A11y
- [ ] Todos los `<img>` tienen `alt` descriptivo
- [ ] Los botones icono tienen `aria-label`
- [ ] Los links tienen texto descriptivo (no "click aquí")
- [ ] El menú móvil es navegable por teclado
- [ ] Los formularios tienen `<label>` asociados
- [ ] Los colores no son la única forma de comunicar estado
- [ ] `focus-visible` está implementado en componentes interactivos
- [ ] Los iframes de Power BI tienen `title` descriptivo

### 4.2 Navegación por teclado
**Acción:** Probar navegación completa con Tab:
- Header → nav links → contenido → footer
- Menú móvil abre/cierra con Enter/Space
- Dialog atrapa foco correctamente

### 4.3 Screen reader
**Acción:** Verificar que el orden de lectura sea lógico:
- Logo → navegación → contenido principal → footer
- Los landmarks ARIA están correctos (`<nav>`, `<main>`, `<footer>`)

---

## FASE 5 — Testing (Prioridad MEDIA)

### 5.1 Cobertura actual
- 35 tests pasando
- 9 archivos de test
- Componentes testeados: Hero, TechnicalSheet, DashboardCard, FormulaBlock
- API testeadas: indicators.routes, indicators.contract
- Repositorios: SqliteIndicatorRepository
- Servicios: normalizers, indicatorSeed

### 5.2 Gaps de cobertura
**No tienen tests:**
- [ ] `Home.tsx` — página principal
- [ ] `HeaderUCT.tsx` — navegación y menú móvil
- [ ] `FooterUCT.tsx`
- [ ] `Indicadores.tsx` — listado con filtros
- [ ] `IndicatorsContext.tsx` — estado global
- [ ] `Metodologia.tsx`, `Glosario.tsx`, `Contacto.tsx`
- [ ] `EstadoAgrupado.tsx`
- [ ] `NotebooksLMS.tsx` (KimnIA)
- [ ] `Calendario.tsx`

### 5.3 Tests E2E
**Acción:** Considerar agregar tests E2E mínimos con Playwright:
- Navegación entre páginas principales
- Búsqueda/filtro de indicadores
- Carga de dashboard embebido

---

## FASE 6 — Deployment y Producción (Prioridad ALTA)

### 6.1 Render.com
**Acciones:**
- [ ] Verificar que las variables de entorno están configuradas en Render
- [ ] Confirmar que `INDICATOR_REPOSITORY` está definido (memory vs sqlite)
- [ ] Verificar que el build command es correcto
- [ ] Verificar que el start command funciona en Linux (el script usa sintaxis POSIX)
- [ ] Confirmar health check endpoint `/health` responde 200

### 6.2 Smoke tests post-deploy
```bash
curl -I https://kimngenero.onrender.com/
curl -I https://kimngenero.onrender.com/indicadores
curl https://kimngenero.onrender.com/api/indicadores | jq '.data | length'
curl https://kimngenero.onrender.com/api/health
curl https://kimngenero.onrender.com/api/metrics
```

### 6.3 Monitoreo
- [ ] Configurar alertas de uptime (Render tiene monitoring básico)
- [ ] Revisar logs de aplicación en Render dashboard
- [ ] Verificar que `/api/metrics` expone datos útiles

### 6.4 SSL y dominio
- [ ] Verificar que Render provee certificado SSL automático
- [ ] Considerar dominio personalizado (ej: `kimngenero.uct.cl`)

---

## FASE 7 — Seguridad (Prioridad ALTA)

### 7.1 Helmet.js
✅ Ya configurado con:
- Content Security Policy
- Referrer Policy
- Cross Origin Embedder Policy (deshabilitado para iframes)

### 7.2 Rate limiting
**Problema:** No hay rate limiting en endpoints API.
**Acción:** Agregar `express-rate-limit` para prevenir abuso.
**Ejemplo:**
```typescript
import rateLimit from 'express-rate-limit';
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // limit each IP to 100 requests per windowMs
}));
```

### 7.3 Validación de inputs
- ✅ Backend usa `zod` para validación
- ✅ Middleware `validate.middleware.ts` existe
- Verificar que todos los endpoints validan query params

### 7.4 Dependencias vulnerables
**Acción:**
```bash
pnpm audit
```
Revisar y actualizar dependencias con vulnerabilidades conocidas.

---

## FASE 8 — Documentación (Prioridad BAJA)

### 8.1 Documentación existente
✅ Excelente cobertura:
- README.md
- ARCHITECTURE.md
- DEPLOYMENT.md
- PRODUCTION_CONFIGURATION.md
- UI_UX_GUIDELINES.md
- API_SURFACE.md
- API_ERROR_CONTRACT.md
- DATA_DICTIONARY.md
- DATA_PIPELINE.md
- TEST_STRATEGY.md
- RELEASE_CHECKLIST.md
- 20+ docs adicionales

### 8.2 Documentación faltante
- [ ] CHANGELOG.md — historial de cambios
- [ ] Troubleshooting guide — problemas comunes y soluciones
- [ ] Runbook de operación — backup/restore de SQLite
- [ ] Guía de contribución simplificada para no-técnicos

---

## Priorización para los próximos 10 días

### Semana 1 (20-26 ago) — Críticos
1. **Día 1-2:** Fix pnpm config warning (FASE 1.1)
2. **Día 2-3:** Unificar colores header con brand-primary (FASE 2.1)
3. **Día 3-4:** Implementar rate limiting (FASE 7.2)
4. **Día 4-5:** Verificar contraste WCAG (FASE 2.2)
5. **Día 5-6:** Tests E2E mínimos (FASE 5.3)
6. **Día 7:** Smoke tests en producción (FASE 6.2)

### Semana 2 (27-30 ago) — Pulido
1. **Día 8:** Eliminar console.log y TODO (FASE 1.2, 1.3)
2. **Día 9:** Definir URLs reales para links del header (FASE 1.5)
3. **Día 10:** Documentación final y release (FASE 8.2)

---

## Criterios de Aceptación para Producción

- [ ] Todos los tests pasan (unit + E2E)
- [ ] Build exitoso sin warnings
- [ ] Lighthouse score > 90 en Performance, Accessibility, Best Practices
- [ ] Contraste WCAG AA en todos los textos
- [ ] Rate limiting implementado
- [ ] CSP en modo enforcing (no report-only)
- [ ] Variables de entorno configuradas en Render
- [ ] Smoke tests pasan en producción
- [ ] Documentación actualizada
- [ ] Monitoreo básico configurado

---

## Métricas de Éxito

| Métrica | Antes | Después |
|---------|-------|---------|
| Tests | 35 | 50+ (con E2E) |
| Cobertura | ~40% | >70% |
| Bundle size (gzip) | ~210 KB | <180 KB |
| Lighthouse Performance | TBD | >90 |
| Lighthouse Accessibility | TBD | >90 |
| console.log | 1 | 0 |
| TODO/FIXME | 1 | 0 |
| Colores inconsistentes | 6+ | 0 |

---

## Notas

- Este plan está diseñado para ejecutarse en 10 días (deadline EVA 30-ago)
- Las fases pueden ejecutarse en paralelo si hay múltiples personas
- Cada fase debe completarse con tests que validen los cambios
- Documentar cada cambio en el commit message

---

**Próximo paso:** Comenzar con FASE 1.1 (fix pnpm config) y FASE 2.1 (unificar colores).
