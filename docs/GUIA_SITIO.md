# Guía de actualización del sitio e indicadores

Esta guía explica cómo mantener contenido público e indicadores sin alterar la arquitectura.

## Rutas públicas

| Ruta | Uso |
|---|---|
| `/` | Portada y acceso a dimensiones. |
| `/indicadores` | Búsqueda y filtros por área o dimensión. |
| `/indicador/:id` | Ficha técnica y dashboard del indicador. |
| `/metodologia`, `/glosario`, `/contacto` | Contenido institucional. |
| `/calendario`, `/estado-agrupado` | Integraciones externas. |
| `/kimnia` | Recursos NotebookLM. |

## Actualizar indicadores

La fuente versionada es `data/indicadores.json`. Debe mantener el objeto raíz:

```json
{ "indicadores": [], "reportesAgrupados": [] }
```

1. Edita el indicador o agrega uno nuevo en `data/indicadores.json`.
2. Conserva JSON válido y un `id` único.
3. Ejecuta `pnpm check`, `pnpm lint` y `pnpm test`.
4. Inicia el servidor y cliente locales; verifica `/indicador/:id` y `/indicadores`.
5. Ejecuta `pnpm build` antes de desplegar.

## Campos de un indicador

| Campo | Propósito |
|---|---|
| `id`, `nro`, `codigo` | Identificación única y visible. |
| `nombre`, `descripcion`, `objetivo` | Contenido público. |
| `area`, `dimension` | Clasificación y color semántico. |
| `unidadMedida`, `formula`, `formulaSimplificada`, `variables` | Definición de cálculo. |
| `frecuenciaMedicion`, `estado`, `lineaBase`, `fechaCorte` | Vigencia y estado. |
| `enlaceVisualizacion` | URL pública de Power BI o `null` si no existe visualización. |
| `fuenteAdministrativa`, `responsableCalculo`, `responsableVerificar`, `instructivoCalculo` | Trazabilidad técnica. |

No publiques secretos, datos personales ni enlaces privados en el JSON.

## Dashboards e integraciones

- Una URL de Power BI debe ser pública y funcionar sin autenticación institucional.
- Si no existe dashboard, usa `null`; la interfaz muestra el estado correspondiente.
- Los dashboards cambian en Power BI; actualizar su contenido no requiere deploy mientras la URL sea la misma.
- Google Calendar y Power BI deben permanecer incluidos en `IFRAME_ALLOWLIST` cuando CSP esté en enforcing.

## Reglas de mantenimiento visual

- Usa tokens existentes; no agregues colores hexadecimales arbitrarios en componentes.
- Toda página interior nueva debe usar el patrón `PageHeader` o una variante aprobada.
- Mantén texto de 12 px o superior y contraste AA para texto normal.
- Verifica escritorio y móvil antes de publicar cambios.
