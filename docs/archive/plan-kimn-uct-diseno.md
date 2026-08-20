# Informe visual y plan de adopcion del diseno de kimn.uct.cl para KimnGenero

## Fuente analizada
- Sitio de referencia: [kimn.uct.cl](https://kimn.uct.cl/)

## Pantallazos capturados
Las capturas se usaron como insumo temporal de auditoria visual y no forman parte del artefacto versionado.

Cobertura revisada:
- Header, hero, buscador y metricas.
- Bloque informativo / indicadores.
- Proceso de actualizacion.
- Calendario / cronograma.
- Footer institucional.

## Diagnostico visual
El sitio KIMN usa un lenguaje institucional consistente:
- Barra superior azul con accesos institucionales.
- Header blanco con logo KIMN/UCT dominante.
- Azul institucional como color primario.
- Alternancia de bandas blancas, celestes y azules.
- Titulos con acento vertical azul.
- Tarjetas metricas blancas redondeadas sobre fondo celeste.
- Botones tipo pill sobrios.
- Footer blanco institucional por columnas con logos y contactos.

La Home actual de KimnGenero ya tiene una buena base de estructura y contenido, pero aun no termina de leer como parte directa del ecosistema visual KIMN/UCT. El mayor impacto vendra de actualizar shell global (header/footer), sistema de bandas y jerarquia de secciones.

## Cambios principales
- Rehacer `HeaderUCT` para acercarlo al patron de KIMN:
  - Barra superior azul completa.
  - Header principal blanco.
  - Logo institucional protagonista.
  - Navegacion horizontal en desktop.
  - Busqueda y menu hamburguesa en mobile.
- Rehacer `FooterUCT` copiando estructura del footer KIMN:
  - Fondo blanco.
  - Columnas institucionales.
  - Bloques de logos.
  - Contacto.
  - Links de interes.
- Ajustar la Home para adoptar el mismo sistema visual:
  - Hero blanco institucional.
  - Banda de metricas sobre celeste.
  - Secciones editoriales en azul/blanco.
  - Integracion de dimensiones en una composicion mas institucional.
- Mantener rutas y logica de negocio existentes:
  - `/`, `/indicadores`, `/metodologia`, `/calendario`, `/glosario`, `/contacto`, `/kimnia`.

## Footer a copiar (estructura y contenido)
- `KIMN es parte de`
- Logo `Programa Gobierno de Datos`
- `Impulsado por`
- Logo `DGOB Direccion de Gobierno de Datos y Gestion de Informacion`
- `#SomosUCT`
- `Contactanos`
- Direccion: `Av. Alemania 0422 Casona Malmus, Campus Mechaca Lira, Temuco`
- Telefono: `+56 45 2 553 706`
- Correo: `dgob@uct.cl`
- `Links de interes`
  - `Vicerrectoria de Calidad y Gestion Estrategica`
  - `Programa de Gobierno de Datos`
  - `Catalogo de Indicadores`
  - `Indicadores SIAC`
  - `Sistema Institucional de Aseguramiento de la Calidad`
  - `Escucha Activa`
- Logos laterales: `CNA`, `CRUCH`, `G9`, `Red Campus Sustentable`

Nota de implementacion:
- Guardar assets institucionales en `client/public/assets/kimn-genero/institutional/` para no depender de URLs externas.

## Plan de implementacion
1. Actualizar shell global
   - Modificar `client/src/components/HeaderUCT.tsx`.
   - Modificar `client/src/components/FooterUCT.tsx`.
   - Mantener `client/src/App.tsx` sin cambios estructurales salvo soporte minimo si se requiere.
2. Actualizar Home
   - Ajustar `client/src/pages/Home.tsx` para bandas institucionales.
   - Convertir metricas a cards blancas tipo KIMN (manteniendo datos KimnGenero).
   - Mantener dimensiones como modulo principal, integradas al nuevo ritmo visual.
   - Agregar bloque de proceso/metodologia enlazado a `/metodologia`.
   - Agregar bloque de calendario enlazado a `/calendario`.
3. Ajustar responsive
   - Desktop: navegacion completa y ancho fluido con tope.
   - Tablet: grillas en 2 columnas y navegacion compacta.
   - Mobile: menu hamburguesa, metricas apiladas/carrusel, footer en columnas apiladas.
4. Pulido visual transversal
   - Tipografia y espaciado consistentes.
   - Contraste y legibilidad.
   - Coherencia entre Home y paginas interiores.

## Test plan
- Verificacion visual en desktop ancho (`1440px+`):
  - Header institucional.
  - Home por bandas.
  - Metricas.
  - Dimensiones.
  - Footer blanco institucional.
- Verificacion responsive:
  - Tablet y mobile sin overflow horizontal.
  - Menu mobile funcional.
  - Footer legible y ordenado.
- Validacion funcional:
  - Navegacion principal y CTA de Home.
  - Tarjetas de dimensiones a `/indicadores?dimension=...`.
- Validacion tecnica:
  - `vite build`.
  - Revisions de textos no deseados (por ejemplo, menciones de `Tableau` si se decide excluir por completo).

## Supuestos
- Se adopta la estetica KIMN/UCT como lenguaje principal del sitio.
- Se copia la estructura del footer de referencia y se mantiene contenido institucional detectado.
- Los assets institucionales se almacenaran localmente en el repo.
- La primera etapa prioriza shell global y Home; ajuste fino de paginas internas puede ir en fase 2.
