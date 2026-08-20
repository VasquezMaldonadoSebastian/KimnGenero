# Gap Analysis de Documentacion

Estado: actualizado a revision del repo real
Uso recomendado: referencia secundaria para detectar brechas activas; no reemplaza `ARCHITECTURE.md`, `API_SURFACE.md`, `TEST_STRATEGY.md` ni `PLAN_SANEAMIENTO_REAL.md`

## Objetivo

Identificar que partes de la documentacion ya estan cubiertas, cuales siguen vigentes y donde aun quedan vacios reales para mantener `KimnGenero` de forma segura.

## Lo que hoy si esta cubierto

- onboarding tecnico base en `README.md`
- arquitectura general en `docs/ARCHITECTURE.md`
- contrato de errores en `docs/API_ERROR_CONTRACT.md`
- superficie HTTP en `docs/API_SURFACE.md`
- politica de artefactos en `docs/ARTIFACT_POLICY.md`
- estrategia de pruebas actual en `docs/TEST_STRATEGY.md`
- operacion minima y metricas en `docs/OPERATIONS.md`
- seguridad, CSP y red en `docs/SECURITY_NETWORK.md`
- despliegue y configuracion de produccion en:
  - `docs/DEPLOYMENT.md`
  - `docs/PRODUCTION_CONFIGURATION.md`
- flujo de datos y operacion de SQLite en:
  - `docs/DATA_PIPELINE.md`
  - `docs/DATA_DICTIONARY.md`
  - `docs/SQLITE_OPERATIONS.md`
- decisiones tecnicas clave en:
  - `docs/WOUTER_PATCH_EVALUATION.md`
  - `docs/ADR_INDEX.md`
  - `docs/DEPENDENCY_AUDIT.md`

## Brechas documentales reales

### Alta prioridad

1. Gobernanza de documentacion historica y auxiliar
   - el inventario ya separa documentos normativos, historicos y auxiliares
   - falta solo mantener esa clasificacion viva cuando entren documentos nuevos

2. Estado de scripts y herramientas auxiliares
   - falta una referencia corta que explique que scripts son parte del flujo normal del proyecto y cuales son experimentales o de apoyo

3. Problemas de codificacion de caracteres
   - varios documentos y partes del frontend ya fueron saneados, pero hay que sostener la politica para evitar reintroducciones

### Prioridad media

1. Variables de entorno de desarrollo
   - `env.example` ya existe en la raiz del repo y sirve como base para nuevos entornos
2. Politica de artefactos de analisis
   - ya existe `docs/ARTIFACT_POLICY.md`; falta difundirla y aplicarla de forma consistente
3. Flujo de validacion manual
   - `TEST_STRATEGY.md` cubre bien la bateria automatizada, pero aun puede resumirse mejor la validacion manual minima por tipo de cambio

## Brechas tecnicas que la documentacion ya evidencia

- coexistencia de `memory` y `sqlite` con necesidad de seguir cuidando la paridad
- deuda activa del parche de `wouter`
- ausencia de una estrategia E2E/browser formal
- necesidad de una politica mas clara para scripts y artefactos auxiliares

## Recomendaciones documentales concretas

1. Mantener `README.md` como indice de entrada y no mezclarlo con reportes historicos.
2. Mantener `docs/DOCUMENTATION_STATUS.md` como inventario vivo de docs normativas, auxiliares e historicas.
3. Archivar o etiquetar cualquier documento que describa un estado previo del repo.
4. Evitar crear nuevos docs tecnicos fuera de `docs/` salvo que sean reportes transitorios claramente marcados.

## Validacion

- un integrante nuevo debe poder identificar rapidamente:
  - que docs son normativas
  - que docs son historicas
  - donde mirar para arquitectura, API, testing y despliegue
- el equipo no deberia volver a usar `OPTIMIZATION_PLAN.md` como plan vigente

## Referencias

- `README.md`
- `docs/DOCUMENTATION_STATUS.md`
- `docs/PLAN_SANEAMIENTO_REAL.md`
- `docs/ARCHITECTURE.md`
- `docs/API_SURFACE.md`
- `docs/TEST_STRATEGY.md`

