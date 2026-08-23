# Estado de la documentacion

Fecha base: 2026-08-20
Estado: vigente

## Objetivo

Separar la documentacion que hoy sirve como referencia operativa real de la documentacion historica, desactualizada o auxiliar.

## Uso recomendado

- si el cambio afecta arquitectura, API, datos, testing, seguridad o despliegue, partir por los documentos marcados como `normativos`
- si un documento esta marcado como `historico` o `auxiliar`, no usarlo como fuente principal sin contrastarlo con codigo y docs normativas
- si un PR cambia el comportamiento real del sistema, actualizar este inventario si corresponde

## Documentacion normativa

- `ARCHITECTURE.md`
- `API_ERROR_CONTRACT.md`
- `API_SURFACE.md`
- `TEST_STRATEGY.md`
- `OPERATIONS.md`
- `WOUTER_PATCH_EVALUATION.md`
- `DATA_PIPELINE.md`
- `DATA_DICTIONARY.md`
- `DEPLOYMENT.md`
- `DOCKER_DEPLOYMENT.md`
- `PRODUCTION_CONFIGURATION.md`
- `SECURITY_NETWORK.md`
- `SQLITE_OPERATIONS.md`
- `CONTRIBUTING_ADVANCED.md`
- `ADR_INDEX.md`
- `RELEASE_CHECKLIST.md`
- `UI_UX_GUIDELINES.md`
- `ARTIFACT_POLICY.md`
- `DEPENDENCY_AUDIT.md`
- `RELEASE_NOTE_SANAMIENTO_2026-05-20.md`
- `GUIA_SITIO.md`
  - guia operativa del sitio: navegacion (10 rutas), actualizacion de contenido y paleta de colores. Referencia de mantenimiento; actualizar al cambiar comportamiento real (2026-08-23).

## Documentacion auxiliar

- `GUIA_EJECUTIVA_KIMNGENERO.md`
  - sintesis ejecutiva para presentacion, comunicacion y contexto general del proyecto

## Documentacion archivada (`archive/`)

Documentacion historica, de planificacion o ya completada. No debe guiar decisiones tecnicas.

- `archive/BRIEF_DISENO_GRAFICO.md`
- `archive/BRIEF_DISENO_GRAFICO_EJECUTIVO.md`
- `archive/BRIEF_DISENO_GRAFICO_RECOMENDACIONES.md`
- `archive/BRIEF_DISENO_GRAFICO_CON_SCREENSHOTS.md`
- `archive/OPTIMIZATION_PLAN_2026-04-17.md`
- `archive/PLAN_SANEAMIENTO_REAL.md`
- `archive/GAP_ANALYSIS.md`
- `archive/KIMNGENERO_SUBDOMINIO_PLAN_IMPLEMENTACION.md`
- `archive/plan-kimn-uct-diseno.md`
- `archive/DOCUMENT_TEMPLATE.md`
- `archive/README.md`

## Documentacion fuera de `docs/` que no debe guiar decisiones tecnicas por si sola

- `env.example`
  - archivo de configuracion de referencia para desarrollo local

## Proxima limpieza sugerida

1. mantener este inventario alineado con cada fase de limpieza
2. seguir reduciendo artefactos auxiliares que no aporten al flujo principal del producto
3. validar por ejecucion los cambios de frontend y normalizacion cuando el entorno tenga `node` y `pnpm` disponibles
