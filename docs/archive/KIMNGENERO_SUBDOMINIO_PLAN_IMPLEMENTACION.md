# Plan de implementacion: KimnGenero en subdominio propio

## 1) Objetivo

Desplegar KimnGenero en un subdominio dedicado, por ejemplo `KimnGenero.kimn.uct.cl`, para aislarlo de la instalacion principal de WordPress en `kimn.uct.cl`.

La meta es mantener:

- Cero conflictos con permalinks de WordPress.
- Cero dependencia de Render u otros hosts externos.
- Frontend React/Vite y backend Express bajo el mismo origen.
- Seguridad controlada con CSP y headers coherentes.
- Flujo de navegacion estable con `wouter`.

## 2) Recomendacion arquitectonica

La opcion recomendada es:

1. `KimnGenero.kimn.uct.cl` como punto de entrada unico.
2. Nginx o Apache como reverse proxy frontal.
3. Node.js ejecutando Express para:
   - servir la API (`/api/v1/...`)
   - servir el build estatico del frontend (`client/dist` o equivalente)
4. PM2 o systemd para mantener el proceso vivo.

### Por que esta opcion

- Aisla el proyecto hijo del stack de WordPress.
- Evita reescrituras conflictivas con Elementor, Rank Math y los permalinks.
- Simplifica TLS, cookies, logs y reglas de seguridad.
- Permite que React/Vite use la raiz del subdominio sin ajustar un base path complejo.

## 3) Alcance tecnico

### Incluye

- Subdominio dedicado.
- Reverse proxy.
- Express como servidor de API y estaticos.
- Configuracion de rutas SPA.
- Seguridad con Helmet y CSP.
- Validacion de CORS solo si aparece una necesidad real.
- Estrategia de rollback.

### No incluye

- Integracion por shortcode dentro del DOM de WordPress.
- Mezcla de estilos entre temas de WordPress y KimnGenero.
- Dependencia de servicios externos de hosting para el runtime.

## 4) Flujo de despliegue propuesto

### Fase 0: Preparacion

1. Confirmar control del servidor o panel para crear subdominio.
2. Verificar que el entorno permite:
   - DNS del subdominio
   - certificado SSL independiente o wildcard
   - procesos persistentes en Node.js
3. Definir ubicacion del despliegue:
   - repositorio
   - carpeta de build
   - archivo de variables de entorno

### Fase 1: Build y runtime

1. Mantener el frontend con `base: '/'` en Vite, porque el subdominio sera la raiz.
2. Compilar el frontend y el backend desde el monorepo logico actual.
3. Servir los assets construidos desde Express o desde una ruta estatica detras del proxy.
4. Mantener el JSON local de datos como parte del despliegue del proyecto.

### Fase 2: Routing

1. Dejar que `wouter` maneje la navegacion interna de la SPA.
2. Configurar el servidor para que cualquier ruta que no sea:
   - `/api/*`
   - o un asset real
   - vuelva al `index.html` del frontend
3. Separar claramente:
   - rutas del frontend
   - rutas de la API
   - rutas de archivos estaticos

### Fase 3: Seguridad

1. Activar Helmet en Express.
2. Definir una CSP explicita.
3. Restringir `frame-src` y `frame-ancestors` segun los dashboards o integraciones reales.
4. Dejar `object-src 'none'` salvo necesidad justificada.
5. No abrir CORS de forma global si todo vive en el mismo origen.

### Fase 4: Operacion

1. Ejecutar con PM2 o systemd.
2. Monitorear logs de:
   - startup
   - 4xx
   - 5xx
   - reinicios
3. Documentar reinicio, despliegue y rollback.

## 5) Consideraciones de rutas y `wouter`

La app ya define rutas SPA en `client/src/App.tsx`:

- `/`
- `/indicadores`
- `/indicador/:id`
- `/metodologia`
- `/glosario`
- `/contacto`
- `/calendario`
- `/estado-agrupado`

### Regla operativa

- Si la app vive en `KimnGenero.kimn.uct.cl`, `wouter` puede operar en la raiz del subdominio sin prefijos extra.
- Si mas adelante se mueve a un subdirectorio, entonces habria que ajustar base path, router y rewrites.

### Riesgo a vigilar

El parche de `wouter@3.7.1` debe mantenerse pinneado y validado en cada upgrade de dependencia.

## 6) Analisis de conflictos con WordPress

### Riesgo principal

El conflicto no viene del backend de KimnGenero, sino de la capa de enrutamiento y de los estilos globales de WordPress.

### Como se evita

1. No mezclar la SPA dentro del tree de rutas de WordPress.
2. No depender de permalinks del CMS para rutas internas de KimnGenero.
3. No permitir que reglas de WordPress capturen peticiones del subdominio.
4. Mantener el subdominio como una aplicacion completa e independiente.

## 7) CSS y estetica

El componente `IndicadorDetail` ya esta compuesto por subcomponentes, lo que ayuda a mantener orden:

- `Hero`
- `DashboardCard`
- `FormulaBlock`
- `TechnicalSheet`

### Reglas de aislamiento visual

1. Encapsular la app dentro de un root propio.
2. Evitar depender de estilos globales del tema WordPress.
3. Preferir CSS Modules, scope local o una capa de estilos muy controlada.
4. Revisar especificamente:
   - tipografia
   - links
   - botones
   - tablas
   - listas
   - colores de fondo y texto

### Si en el futuro se embebe dentro de WordPress

- Mejor usar `iframe` que renderizar la SPA dentro del DOM del tema.
- Si se evita `iframe`, entonces el aislamiento por CSS debe ser mucho mas estricto.

## 8) Seguridad y CSP

### Headers recomendados

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy`
- `Permissions-Policy`
- `X-Frame-Options` o, preferentemente, `frame-ancestors` dentro de CSP

### CSP base sugerida

- `default-src 'self'`
- `script-src 'self'`
- `style-src 'self' 'unsafe-inline'` solo si no queda otra por el stack actual
- `img-src 'self' data:`
- `connect-src 'self'`
- `frame-src` solo a los orígenes externos necesarios
- `frame-ancestors` solo a los orígenes que puedan embeber la app
- `object-src 'none'`

### CORS

No habilitar CORS por defecto entre WordPress y KimnGenero.

Solo activarlo si existe un caso concreto de consumo cross-origin desde navegador.

## 9) Variables de entorno y configuracion

Definir y documentar al menos:

- `NODE_ENV`
- `PORT`
- `HOST`
- `INDICATOR_REPOSITORY`
- variables de conexion a SQLite si aplica
- variables de dominios permitidos si se usa CORS o CSP dinamica

### Reglas

1. No hardcodear dominios productivos dentro del codigo.
2. Mantener configuracion por entorno.
3. Separar dev, staging y produccion.

## 10) Estrategia operativa

### Arranque

1. Instalar dependencias.
2. Construir frontend y backend.
3. Levantar el proceso Node.
4. Verificar:
   - home de la SPA
   - rutas internas
   - API
   - assets

### Pruebas minimas de aceptacion

- Carga de `https://KimnGenero.kimn.uct.cl/`
- Navegacion a una ruta profunda como `/indicador/:id`
- Respuesta correcta de `/api/v1/...`
- Carga del JSON local
- Ausencia de errores de CORS
- Ausencia de conflictos con estilos del tema padre

## 11) Plan de rollback

1. Mantener el despliegue anterior funcional hasta validar el nuevo.
2. Usar un switch rapido de reverse proxy o DNS.
3. Conservar backups de:
   - config del servidor
   - `.env`
   - build de produccion
   - base de datos si existe
4. Si falla la nueva version, volver al endpoint previo sin tocar WordPress.

## 12) Riesgos principales

| Riesgo | Impacto | Mitigacion |
| --- | --- | --- |
| Reglas del proxy mal definidas | Alto | Separar claramente API, assets y fallback SPA |
| Conflicto de estilos con WordPress | Alto | Subdominio independiente y estilos scopeados |
| CORS innecesario | Medio | Mantener mismo origen dentro del subdominio |
| Cambio de comportamiento en `wouter` | Medio | Pin de version y pruebas de rutas |
| CSP demasiado permisiva | Alto | Politica minima y mantenimiento por entorno |
| CSP demasiado restrictiva | Medio | Validar dashboards externos antes de cerrar |

## 13) Orden de ejecucion recomendado

1. Crear el subdominio.
2. Configurar SSL.
3. Desplegar Node.js con PM2 o systemd.
4. Servir el frontend compilado.
5. Validar rutas SPA.
6. Activar Helmet y CSP.
7. Revisar si CORS realmente hace falta.
8. Probar integracion visual.
9. Publicar como version estable.

## 14) Criterio de exito

El despliegue se considera exitoso si:

- KimnGenero vive en su propio subdominio.
- WordPress no presenta conflictos de rutas.
- La SPA navega sin errores de recarga.
- La API responde bajo el mismo origen.
- Los estilos de WordPress no alteran el componente `IndicadorDetail`.
- La seguridad esta cerrada por defecto.

