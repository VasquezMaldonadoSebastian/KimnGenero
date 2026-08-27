# Arquitectura de KimnGenero

## Visión general

El cliente React/Vite consume una API Express. Los indicadores se inicializan desde `data/indicadores.json` y se sirven mediante un repositorio en memoria o SQLite.

```text
React/Vite -> /api -> Express -> IndicatorService -> Repository -> data/indicadores.json | SQLite
```

## Componentes principales

| Ubicación | Responsabilidad |
|---|---|
| `client/src/` | Páginas, componentes, estilos y consumo de API. |
| `server/src/` | API, validación, seguridad, servicios y repositorios. |
| `shared/types/` | Tipos de dominio compartidos. |
| `data/indicadores.json` | Fuente versionada de indicadores y reportes agrupados. |
| `docs/` | Documentación operativa vigente. |

## Flujo de datos

1. `server/src/data/indicatorSeed.ts` valida y normaliza el JSON.
2. `server/src/config/repositoryFactory.ts` selecciona el repositorio.
3. `IndicatorService` expone consultas a las rutas `/api`.
4. El cliente obtiene datos mediante `client/src/lib/apiClient.ts` y contextos/páginas de indicadores.

## Repositorios

- `memory` es el valor por defecto y carga los datos desde el JSON en cada arranque.
- `sqlite` usa `SQLITE_DB_PATH`. El seed inicial se aplica cuando la base está vacía; cambiar el JSON no actualiza una base SQLite existente.
- SQLite requiere Node.js 22.13+.

## Desarrollo local

Express escucha en 3000. Vite escucha en 5173 y redirige `/api` y `/health` al servidor Express. Revisa `README.md` para los comandos.

## Límites importantes

- Power BI, Google Calendar y NotebookLM son servicios externos.
- El frontend no debe contener secretos ni claves de proveedores.
- Las políticas de CSP, proxy y rate limiting se describen en `docs/OPERATIONS.md`.
