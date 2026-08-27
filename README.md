# KimnGenero

Aplicación web del Observatorio de Indicadores de Género de la Universidad Católica de Temuco.

## Inicio rápido

**Requisitos:** Node.js 22.13+ y pnpm 10+.

```bash
pnpm install
```

Para desarrollo, abre dos terminales desde la raíz del repositorio:

```bash
pnpm dev:server
```

```bash
pnpm dev
```

- API y health check: `http://localhost:3000`
- Cliente Vite: `http://localhost:5173`
- Las llamadas `/api` y `/health` del cliente se redirigen al servidor local.

## Verificación

```bash
pnpm check
pnpm lint
pnpm test
pnpm build
```

Si pnpm solicita aprobar scripts de dependencias, revisa y aprueba únicamente `esbuild`, que es necesario para compilar Vite y el servidor.

## Producción

```bash
pnpm build
NODE_ENV=production pnpm start
```

En PowerShell:

```powershell
$env:NODE_ENV = "production"; pnpm start
```

## Docker

Docker construye el checkout actual; no descarga código desde GitHub.

```bash
docker compose build
docker compose up -d
docker compose ps
curl http://localhost:3000/health
docker compose logs -f
docker compose down
```

El servicio queda publicado sólo en `127.0.0.1:3000`. Revisa `docs/OPERATIONS.md` antes de exponerlo mediante un proxy inverso.

## Documentación operativa

- `docs/GUIA_SITIO.md` — rutas, contenido e indicadores.
- `docs/ARCHITECTURE.md` — estructura técnica y flujo de datos.
- `docs/API_REFERENCE.md` — endpoints, filtros y errores.
- `docs/OPERATIONS.md` — configuración, pruebas, seguridad, Docker y recuperación.
