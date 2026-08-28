# Operación, configuración y despliegue

## Variables de entorno

| Variable | Predeterminado | Uso |
|---|---|---|
| `NODE_ENV` | — | Usa `production` al ejecutar el artefacto desplegado. |
| `PORT` | `3000` | Puerto de Express. |
| `INDICATOR_REPOSITORY` | `memory` | `memory` o `sqlite`. |
| `SQLITE_DB_PATH` | `data/indicators.sqlite` | Ruta SQLite cuando se selecciona ese repositorio. |
| `IFRAME_ALLOWLIST` | Power BI público | Lista CSV de orígenes autorizados en iframes. Incluye Power BI y Google Calendar si ambos están publicados. |
| `CSP_REPORT_ONLY` | `false` | `true` sólo durante validación; `false` aplica CSP enforcing. |
| `TRUST_PROXY` | vacío | Cantidad de saltos proxy confiables, por ejemplo `1`. |

Copia `env.example` para partir de una configuración local. No subas secretos ni bases SQLite locales al repositorio.

## Verificación antes de publicar

La ruta recomendada no requiere instalar dependencias en el equipo anfitrión:
el `Dockerfile` instala las dependencias y ejecuta el build dentro de la etapa
de construcción de la imagen.

```bash
docker compose build
docker compose up -d
docker compose ps
curl http://localhost:3000/health
```

Para una verificación completa antes de publicar, `docker compose build` debe
terminar correctamente y el health check debe quedar `healthy`. El build
genera `dist/public` y `dist/index.js` dentro de la imagen; no es necesario
generar `dist/` en el equipo anfitrión.

La ejecución directa de `pnpm check`, `pnpm lint`, `pnpm test` o `pnpm build`
queda reservada para desarrollo local y requiere instalar Node.js y pnpm.

## Docker

Docker construye **el checkout actual** con Node 22.13; no clona GitHub.

```bash
docker compose up --build -d
docker compose ps
curl http://localhost:3000/health
curl http://localhost:3000/api/indicadores
docker compose logs -f
docker compose down
```

Después de cambiar código o datos, repite `docker compose up --build -d` para
reconstruir la imagen. `docker compose restart` sólo reinicia el contenedor y
no incorpora cambios del checkout.

El servicio se publica en `127.0.0.1:3000`. Para exponerlo públicamente, pon un proxy inverso delante. Si ese proxy agrega `X-Forwarded-For`, configura `TRUST_PROXY=1` sólo cuando exista exactamente un salto confiable.

## Seguridad y proveedores externos

- CSP usa enforcing por defecto. Valida Power BI y Google Calendar antes de pasar `CSP_REPORT_ONLY=false`.
- Mantén `IFRAME_ALLOWLIST` limitada a proveedores aprobados.
- La API limita `/api` a 100 solicitudes por IP cada 15 minutos.
- Si existe un proxy inverso, configura explícitamente los saltos/proxies confiables en Express antes de depender de `X-Forwarded-For`.
- Protege o desactiva `/api/metrics` en infraestructura pública si las métricas no deben exponerse.

## SQLite: actualización y recuperación

El repositorio SQLite no recarga automáticamente `data/indicadores.json` cuando la base ya contiene datos. Antes de reemplazar o regenerar una base:

1. Respáldala fuera del repositorio.
2. Detén la instancia.
3. Ejecuta la recarga o regeneración controlada según el procedimiento de la infraestructura.
4. Comprueba `/api/indicadores` y un detalle de indicador antes de reabrir tráfico.

## Diagnóstico rápido

| Síntoma | Revisión |
|---|---|
| Cliente sin datos | Confirma que Express esté en 3000 y Vite en 5173; revisa `/health`. |
| Dashboard bloqueado | Revisa CSP, `IFRAME_ALLOWLIST` y la disponibilidad pública del proveedor. |
| Cambios de JSON no aparecen | Confirma repositorio `memory` o aplica el proceso SQLite. |
| Respuestas 429 | Revisa volumen de `/api`, proxy confiable y cabeceras de rate limiting. |
