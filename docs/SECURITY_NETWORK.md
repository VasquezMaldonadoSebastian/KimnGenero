# Seguridad, Red y Endpoints

## Objetivo

Documentar la postura actual de seguridad de `KimnGenero`, la configuracion de red visible en el backend y los puntos que deben revisarse antes de endurecer el paso a produccion.

## Alcance

- Cubre headers HTTP, CSP, iframes, CORS y superficie de API.
- Cubre el comportamiento actual del servidor Express.
- No cubre autenticacion de usuarios porque actualmente la app no expone ese flujo.

## Estado actual

- El backend usa `helmet`.
- La app habilita `compression`.
- Los endpoints API viven bajo `/api`.
- Los dashboards externos se embeben via `iframe`.
- No se observa middleware `cors()` explicito.

## Headers y CSP

`server/src/createApp.ts` aplica:

- `helmet()` con:
  - `crossOriginEmbedderPolicy: false`
  - `contentSecurityPolicy`
  - `referrerPolicy: strict-origin-when-cross-origin`
- CSP:
  - `frame-src`: `'self'` + allowlist de Power BI o `IFRAME_ALLOWLIST`
  - `img-src`: `'self'`, `data:`, `https:`
  - `connect-src`: `'self'`, `https:`
  - `script-src`: `'self'`, `'unsafe-inline'`, `https:`
  - `style-src`: `'self'`, `'unsafe-inline'`, `https:`

Observacion:

- La CSP corre en `report-only` por defecto, para no romper dashboards existentes.

## Iframes y dashboards

- Los embeds estan condicionados por `frame-src`.
- Variables relevantes:
  - `IFRAME_ALLOWLIST`
  - `CSP_REPORT_ONLY`
- Allowlist por defecto actual:
  - `https://app.powerbi.com`
  - `https://*.powerbi.com`
- Riesgo principal:
  - cambiar CSP sin validar Power BI puede romper vistas de indicadores y reportes agrupados.

## CORS

- No existe configuracion `cors()` explicita en el backend.
- Implicacion actual:
  - la aplicacion esta pensada para operar en mismo origen, sirviendo SPA y API desde el mismo servicio.
- Si en el futuro frontend y API se separan por dominio:
  - debera agregarse politica `cors()` controlada y documentada.

## Superficie API actual

- `GET /api/indicadores`
  - soporta `area`, `dimension`, `limit`, `offset`
- `GET /api/indicadores/:id`
- `GET /api/categorias`
- `GET /api/categorias/:categoryId/indicadores`
- `GET /api/reportes-agrupados`
- `GET /api/metrics`

Controles actuales:

- validacion con `zod` para params y query en rutas de indicadores.
- contrato de error uniforme.
- strong ETag habilitado en la app.

## Secretos y configuracion sensible

- No hay secretos de aplicacion documentados en el repo.
- Las configuraciones sensibles actuales viven en variables de entorno.
- Falta una politica formal de:
  - almacenamiento de secretos
  - rotacion
  - separacion por ambiente

## Hardening pendiente

- ~~Definir si produccion seguira con CSP `report-only` o pasara a enforcing~~ ✅ **RESUELTO**: Default a enforcing desde 2026-08-20
- Documentar criterio de `IFRAME_ALLOWLIST` por ambiente
- Revisar si `script-src` y `style-src` pueden reducir o eliminar `unsafe-inline`
- ~~Evaluar necesidad de rate limiting si la API se expone fuera de mismo origen~~ ✅ **RESUELTO**: Rate limiting implementado (100 req/15min/IP)
- Definir monitoreo de errores CSP y embeds fallidos

## Validacion

- Verificar headers HTTP en un deploy real.
- Validar dashboards embebidos con CSP actual.
- Probar rutas API principales y errores 404/400.

## Riesgos y consideraciones

- Riesgo: asumir que no usar `cors()` implica seguridad completa. Mitigacion: documentar que la postura actual depende de mismo origen.
- Riesgo: endurecer CSP sin smoke checks sobre iframes. Mitigacion: validar embeds reales antes de mover a enforcing.
- Riesgo: mantener `unsafe-inline` sin revision posterior. Mitigacion: tratarlo como deuda de hardening y evaluar compatibilidad real del frontend.

## Referencias

- `server/src/createApp.ts`
- `server/src/config/security.ts`
- `docs/API_ERROR_CONTRACT.md`
- `docs/PRODUCTION_CONFIGURATION.md`
