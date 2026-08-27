# Referencia de API

Base local: `http://localhost:3000`.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Estado del servicio: `{ "status": "ok" }`. |
| GET | `/api/indicadores` | Todos los indicadores o una selección filtrada. |
| GET | `/api/indicadores/:id` | Un indicador por identificador. |
| GET | `/api/categorias` | Categorías y sus indicadores. |
| GET | `/api/categorias/:categoryId/indicadores` | Indicadores de una categoría. |
| GET | `/api/reportes-agrupados` | Reportes agrupados. |
| GET | `/api/metrics` | Métricas de proceso. Restringe este endpoint en infraestructura pública si no se requiere. |

## Consulta de indicadores

`GET /api/indicadores` acepta:

| Parámetro | Regla |
|---|---|
| `area` | Texto no vacío. |
| `dimension` | Texto no vacío. |
| `limit` | Entero positivo hasta 1000. |
| `offset` | Entero mayor o igual a cero. |

Las consultas paginadas incluyen `X-Total-Count`, `X-Limit` y `X-Offset`.

## Errores

Las rutas `/api` devuelven JSON con `error` y/o `message`. Un indicador inexistente responde 404. Entradas inválidas responden 400.

## Límites

Las rutas bajo `/api` tienen un límite de 100 solicitudes por IP cada 15 minutos. El proxy inverso debe configurarse correctamente antes de habilitar tráfico público, para que la IP del cliente se interprete de forma segura.
