# KIMNGÉNERO

Aplicación web del Observatorio de Indicadores de Género de la Universidad Católica de Temuco.

## Inicio rápido con Docker

**Requisito:** Docker Desktop (o Docker Engine) con Docker Compose. No necesitas
instalar Node.js, pnpm ni las dependencias del proyecto en el equipo anfitrión:
Docker las instala dentro de la imagen.

Desde la raíz del repositorio, ejecuta:

```bash
docker compose up --build -d
docker compose ps
curl http://localhost:3000/health
```

En PowerShell, si `curl` no está disponible como comando nativo, usa:

```powershell
Invoke-WebRequest http://localhost:3000/health
```

Abre <http://localhost:3000>. El sitio y la API se sirven desde el mismo
contenedor.

Para ver los logs o detener el sitio:

```bash
docker compose logs -f
docker compose down
```

Si modificas el código o `data/indicadores.json`, vuelve a ejecutar
`docker compose up --build -d` para generar una imagen con los cambios.

## Desarrollo local (opcional)

Usa esta modalidad sólo si necesitas hot reload. Requiere Node.js 22.13+ y
pnpm 10+ instalados en el equipo anfitrión:

```bash
pnpm install
```

Abre dos terminales desde la raíz del repositorio:

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

## Ejecución del artefacto sin Docker

Esta alternativa también requiere Node.js y pnpm instalados localmente:

```bash
pnpm build
NODE_ENV=production pnpm start
```

En PowerShell:

```powershell
$env:NODE_ENV = "production"; pnpm start
```

## Docker en producción

Docker construye el checkout actual; no descarga código desde GitHub. El
servicio queda publicado sólo en `127.0.0.1:3000`. Revisa
`docs/OPERATIONS.md` antes de exponerlo mediante un proxy inverso.

## Documentación

- [`guides/Guia_KimnGenero.html`](guides/Guia_KimnGenero.html) — guía canónica y editable: identidad, navegación, paleta, stack, indicadores, calendario y operación. PDF generado: [`output/pdf/Guia_KimnGenero.pdf`](output/pdf/Guia_KimnGenero.pdf).
- `docs/ARCHITECTURE.md` — estructura técnica y flujo de datos.
- `docs/API_REFERENCE.md` — endpoints, filtros y errores.
- `docs/OPERATIONS.md` — configuración, pruebas, seguridad, Docker y recuperación.

Para validar y regenerar la guía:

```bash
python scripts/validate_guide.py
python scripts/render_guia.py
```
