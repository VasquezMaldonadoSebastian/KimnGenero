# Scripts del repositorio

Este directorio contiene utilidades de soporte para el proyecto.

## Scripts activos del flujo del repo

- `bundle-report.mjs`
  - complemento de `pnpm run build:analyze`
- `sync_guide_data.py`
  - actualiza el resumen de indicadores desde `data/indicadores.json`
- `validate_guide.py`
  - verifica rutas, cantidades, activos y afirmaciones obsoletas
- `render_guia.py`
  - valida y genera `output/pdf/Guia_KimnGenero.pdf` desde el HTML canónico

Para validar y regenerar la guía:

```bash
python scripts/validate_guide.py
python scripts/render_guia.py
```

## Regla operativa

Este directorio conserva únicamente scripts activos, reproducibles y necesarios
para desarrollar, verificar u operar el proyecto. Las herramientas puntuales o
históricas no se publican como parte de la documentación vigente.
