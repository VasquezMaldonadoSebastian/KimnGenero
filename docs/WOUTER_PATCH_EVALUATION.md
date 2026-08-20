# Evaluacion del parche `wouter@3.7.1`

## Que hace el parche

El repo aplica un parche a `wouter@3.7.1` via `pnpm.patchedDependencies` que modifica `esm/index.js` para que, dentro de `Switch`, se recolecten los `path` de las rutas hijas y se publiquen en un arreglo global.

- Global: `window.__WOUTER_ROUTES__`
- Contenido: lista unica de strings `path` definidos en los elementos de ruta renderizados bajo `Switch`.

El codigo esta protegido por `typeof window !== "undefined"` (no corre en SSR), pero si corre en browser para cualquier build donde el parche este activo.

## Motivacion esperada

Exponer el mapa de rutas de la app en tiempo de ejecucion para tooling y diagnostico, por ejemplo runtimes externos o debug tooling que necesita descubrir rutas disponibles sin inspeccionar el bundle.

## Matriz de riesgos

| Riesgo | Prob. | Impacto | Mitigacion |
| --- | --- | --- | --- |
| Colision con otros globals o `__WOUTER_ROUTES__` ya usado | Baja | Media | Mantener nombre estable; evitar usar este global desde app productiva; documentar y reservar el prefijo. |
| Fuga de informacion al exponer rutas internas en el cliente | Media | Baja-Media | Asumir que las rutas del SPA no son secretas; si existieran rutas ocultas, no depender de obscuridad; reforzar auth del backend. |
| Efecto colateral o perf al renderizar `Switch` (`flatten` + `includes`) | Baja | Baja | El costo es pequeno; mantener lista unica; revisar si `Switch` re-renderiza mucho. |
| Diferencia al actualizar `wouter` (parche no aplica o cambia internals) | Alta | Media-Alta | Pin de version; checklist de upgrade: re-aplicar o reevaluar parche y validar smoke tests. |
| Incompatibilidad con futuros cambios de bundling o minificacion | Baja | Media | Revalidar en builds de produccion; preferir hook publico si `wouter` lo soporta a futuro. |

## Alternativas si se quiere eliminar el parche

1. Recolectar rutas en la app: mantener una lista o registry explicito en el codigo de rutas sin tocar `wouter`.
2. Plugin interno: exponer un endpoint o archivo JSON generado en build con la lista de rutas.
3. Upstream: proponer una API publica en `wouter` si el caso de uso lo justifica.

## Criterio de decision

Mantener el parche es razonable si:

- el consumidor del global es necesario para el flujo de operacion o diagnostico, y
- el equipo acepta que es una modificacion de dependencia con costo de mantenimiento en upgrades.

Si el global no es consumido activamente, conviene migrar a una alternativa app-level para eliminar deuda.

## Estado actual

- **Parche eliminado** (2026-08-20).
- No se encontro un consumidor interno directo de `window.__WOUTER_ROUTES__` en el codigo del repo.
- La motivacion original era diagnostico o tooling externo, pero nunca se implementó.
- El parche fue removido durante la auditoría de producción al confirmar que:
  1. No hay código que consuma `window.__WOUTER_ROUTES__`
  2. pnpm 10+ migró `patchedDependencies` de `package.json` a `pnpm-workspace.yaml`
  3. Mantener el parche sin uso activo era deuda técnica innecesaria

## Checklist al actualizar `wouter`

- Confirmar que `Switch` sigue existiendo y que la ubicacion del codigo no cambio.
- Confirmar que `window.__WOUTER_ROUTES__` sigue poblandose correctamente en dev y prod.
- Correr `pnpm run test` y un smoke test manual del enrutamiento entre rutas principales.
