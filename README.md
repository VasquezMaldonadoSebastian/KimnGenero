# KimnGenero - Onboarding Tecnico

Guia de entrada para levantar el proyecto localmente, entender su estructura y contribuir de forma segura.

## 1) Contexto

`KimnGenero` es una aplicacion web con frontend en React/Vite y backend en Express.
El dominio principal expone indicadores y categorias via API, y consume datos locales para su inicializacion.

## 2) Requisitos

- Node.js 20+ recomendado
- pnpm 10+

Verificacion rapida:

```bash
node -v
pnpm -v
```

## 3) Configuracion local

1. Instalar dependencias:

```bash
pnpm install
```

2. Variables de entorno minimas opcionales:

- Copia `env.example` como punto de partida para tu entorno local.
- `INDICATOR_REPOSITORY`: `memory` por defecto o `sqlite`
- `NODE_ENV`: `development` para trabajo local

Si no defines variables, el proyecto funciona con defaults para desarrollo.
## 4) Comandos principales

```bash
pnpm run dev
pnpm run build
pnpm run test
pnpm run lint
```

Comandos utiles adicionales:

```bash
pnpm run test:coverage
pnpm run build:analyze
pnpm run preview
pnpm run format
```

## 5) Estructura del repositorio

- `client/`: frontend React + Vite
- `server/`: API Express y capa de servicios/repositorios
- `shared/`: tipos compartidos
- `docs/`: documentacion tecnica y operativa
- `data/`: fuentes de datos locales como `indicadores.json`
- `scripts/`: utilidades de soporte y herramientas auxiliares

## 6) Flujo basico de contribucion

1. Crear rama desde `main` con convenciones como `feat/*`, `fix/*` o `docs/*`.
2. Implementar cambios pequenos y enfocados.
3. Ejecutar antes de abrir PR:

```bash
pnpm run test
pnpm run lint
pnpm run build
```

4. Abrir PR con resumen de cambios, riesgos y validacion.

## 7) Indice de documentacion

- [Arquitectura](docs/ARCHITECTURE.md)
- [Guia operativa del sitio (navegacion, actualizacion, paleta)](docs/GUIA_SITIO.md)
- [Guia ejecutiva de KimnGenero](docs/GUIA_EJECUTIVA_KIMNGENERO.md)
- [Estado de la Documentacion](docs/DOCUMENTATION_STATUS.md)
- [Plan de Saneamiento Real](docs/PLAN_SANEAMIENTO_REAL.md)
- [Release Note de Saneamiento](docs/RELEASE_NOTE_SANAMIENTO_2026-05-20.md)
- [Gap Analysis de Documentacion](docs/GAP_ANALYSIS.md)
- [Contrato de Errores API](docs/API_ERROR_CONTRACT.md)
- [Superficie API](docs/API_SURFACE.md)
- [Pipeline de Datos](docs/DATA_PIPELINE.md)
- [Diccionario de Datos](docs/DATA_DICTIONARY.md)
- [Despliegue](docs/DEPLOYMENT.md)
- [Despliegue Docker Institucional](docs/DOCKER_DEPLOYMENT.md)
- [Configuracion de Produccion](docs/PRODUCTION_CONFIGURATION.md)
- [Seguridad, Red y Endpoints](docs/SECURITY_NETWORK.md)
- [Estrategia de Pruebas](docs/TEST_STRATEGY.md)
- [Lineamientos de UX/UI](docs/UI_UX_GUIDELINES.md)
- [Checklist de Release](docs/RELEASE_CHECKLIST.md)
- [Operacion de SQLite](docs/SQLITE_OPERATIONS.md)
- [Contribucion Avanzada](docs/CONTRIBUTING_ADVANCED.md)
- [Indice de Decisiones Arquitectonicas](docs/ADR_INDEX.md)
- [Operacion Minima (SLO + tablero)](docs/OPERATIONS.md)
- [Auditoria de Dependencias](docs/DEPENDENCY_AUDIT.md)
- [Evaluacion del Parche Wouter](docs/WOUTER_PATCH_EVALUATION.md)
- [Plantilla de Documento Tecnico](docs/DOCUMENT_TEMPLATE.md)
- [Politica de Artefactos](docs/ARTIFACT_POLICY.md)
- [Archivo documental auxiliar](docs/archive/README.md)

## 8) Primer recorrido recomendado

1. `pnpm install`
2. `pnpm run dev`
3. Abrir la URL local mostrada por Vite
4. Ejecutar `pnpm run test`
5. Leer `docs/ARCHITECTURE.md`
6. Revisar `docs/DOCUMENTATION_STATUS.md` para distinguir documentacion normativa de material auxiliar

