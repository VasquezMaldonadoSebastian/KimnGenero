# Plan de saneamiento real del repositorio

Estado: vivo
Fecha base de revision: 2026-05-20
Fuente: revision de codigo y documentacion del repo real

## 1. Proposito

Ajustar el saneamiento de `KimnGenero` a lo que existe hoy en el repositorio, no a planes viejos ni a supuestos.

Este documento reemplaza el uso operativo de `OPTIMIZATION_PLAN.md` como referencia principal porque:

- el plan viejo describe un estado anterior del repo
- hoy ya existen tests, middleware, validacion y documentacion que ese plan presenta como pendientes
- el arbol contiene artefactos auxiliares, contenido generado y residuos de agentes que deben tratarse como deuda separada

## 2. Estado real resumido

### Lo que si esta bien encaminado

- hay una arquitectura backend clara en `server/src/createApp.ts`, `server/src/services`, `server/src/repositories`
- el frontend vive de forma consistente en `client/src/` y el header real esta centralizado en `client/src/components/HeaderUCT.tsx`
- existe contrato de errores en `server/src/middleware/error.middleware.ts` y `docs/API_ERROR_CONTRACT.md`
- existe validacion con `zod` en rutas de indicadores
- existe bateria inicial de tests de rutas, contrato `memory vs sqlite` y normalizadores
- la documentacion principal de arquitectura, API, seguridad, SQLite y testing esta razonablemente alineada con el codigo
- hay CI real en `.github/workflows/ci.yml` y analisis de bundle en `.github/workflows/bundle-analysis.yml`

### Lo que esta desordenado o contaminado

- `OPTIMIZATION_PLAN.md` y `Informe_de_cambios_Fase_1.txt` quedaron archivados como documentos historicos, no como verdad actual
- `docs/` mezcla documentacion tecnica nuclear con briefs de diseno, reportes y material auxiliar no esencial
- `outputs/` esta dentro del repo y no esta ignorado
- `scripts/` contiene scripts experimentales y, en revisiones previas, llego a arrastrar un `scripts/node_modules/` que no debe volver al arbol versionado
- hay archivos y componentes que no parecen pertenecer al dominio real o no tienen uso actual; varios ya fueron removidos
- hay problemas visibles de codificacion de caracteres en codigo y docs
- la navegacion superior necesita una correccion visual concreta: el header actual muestra marca textual redundante junto al logo y el menu mobile no calca la referencia institucional deseada

## 3. Hallazgos reales por area

### Raiz y configuracion

- `package.json` esta bien orientado a un solo paquete, con `build`, `lint`, `test`, `format` y `build:analyze`
- `.gitignore` es demasiado corto: hoy solo ignora `node_modules/`, `dist/`, `coverage/` y `.DS_Store`
- falta ignorar al menos:
  - `outputs/`
  - `scripts/node_modules/`
  - posibles bases SQLite locales
  - artefactos temporales de analisis o capturas
- `config/index.ts` ya fue eliminado

### Backend (`server/`)

- la separacion `createApp -> rutas -> servicio -> repositorio` existe y es util
- `createApp.ts` ya incorpora `helmet`, `compression`, `etag`, logger y metricas
- `indicatorService.ts` es pequeno y claro, aunque mantiene logica de filtrado exacto por string
- la divergencia funcional principal sigue siendo una deuda potencial entre `InMemoryIndicatorRepository` y `SqliteIndicatorRepository`
- `SqliteIndicatorRepository.ts` reconstruye categorias desde indicadores normalizados con su propia funcion `groupIndicatorsByArea`, mientras `InMemoryIndicatorRepository.ts` usa `groupByCategory` sobre raw data
- hoy hay tests de contrato para paridad, lo que baja riesgo, pero la duplicacion de criterio sigue existiendo

### Frontend (`client/`)

- `App.tsx` ya usa `lazy` y `Suspense`, lo que mejora respecto del plan viejo
- `IndicadorDetail.tsx` ya fue dividido y ya no es el componente monolitico descrito en el plan anterior
- el cliente sigue inconsistente en consumo de API:
  - `IndicatorsContext.tsx` usa `apiGetJson()`
  - `IndicadorPage.tsx` y `EstadoAgrupado.tsx` ya fueron unificados a `apiGetJson()`
- hay problemas de codificacion visibles en varias vistas
- `HeaderUCT.tsx` concentra la identidad institucional, el menu desktop y el panel mobile; ahi esta el ajuste de marca que hoy se ve mal
- el tooling temporal de diagnostico externo fue removido del flujo activo y no debe reaparecer en la configuracion de Vite ni en assets publicos

### Tipos compartidos (`shared/`)

- `shared/types/indicator-domain.ts` esta bien enfocado al dominio real
- `shared/types/common.ts` ya fue eliminado; si reaparece, debe revalidarse antes de volver a introducirse.

### Datos (`data/`)

- `data/indicadores.json` hoy usa un objeto con:
  - `indicadores`
  - `reportesAgrupados`
- hay 19 indicadores y 1 reporte agrupado
- el backend soporta tanto array top-level como objeto, lo que aumenta tolerancia pero tambien deuda de compatibilidad
- `normalizers.ts` conserva aliases raw heredados para campos con acentos como `Codigo del indicador`, `Dimension` y `Area` para compatibilidad con fuentes antiguas

### Scripts (`scripts/`)

- `scripts/bundle-report.mjs` parece parte del flujo real
- el resto del directorio mezcla:
  - scripts de inspeccion puntual
  - scripts para briefs graficos
  - capturas
  - utilidades externas
- `scripts/node_modules/` dentro del repo es una anomalia historica que debe mantenerse fuera del arbol versionado o, como minimo, quedar ignorada
- algunos scripts historicos siguen escribiendo en `outputs/brief_diseno_docs/` u otras rutas de trabajo local; esos artefactos no son producto y deben permanecer fuera del flujo normal

### Documentacion (`docs/`)

#### Documentacion tecnica nuclear y util
- `ARCHITECTURE.md`
- `ARTIFACT_POLICY.md`
- `API_ERROR_CONTRACT.md`
- `API_SURFACE.md`
- `TEST_STRATEGY.md`
- `OPERATIONS.md`
- `WOUTER_PATCH_EVALUATION.md`
- `DATA_PIPELINE.md`
- `DATA_DICTIONARY.md`
- `DEPLOYMENT.md`
- `PRODUCTION_CONFIGURATION.md`
- `SECURITY_NETWORK.md`
- `SQLITE_OPERATIONS.md`
- `CONTRIBUTING_ADVANCED.md`
- `ADR_INDEX.md`
- `RELEASE_CHECKLIST.md`
- `UI_UX_GUIDELINES.md`

#### Documentacion util pero a revisar por vigencia

- `GAP_ANALYSIS.md`
  - sigue diciendo que faltan documentos que hoy ya existen
- `DEPENDENCY_AUDIT.md`
  - documenta una poda aplicada, pero hoy el repo aun tiene residuos no relacionados con esa auditoria

#### Documentacion sospechosa, auxiliar o no normativa

- `BRIEF_DISENO_GRAFICO.md`
- `BRIEF_DISENO_GRAFICO_EJECUTIVO.md`
- `BRIEF_DISENO_GRAFICO_RECOMENDACIONES.md`
- `BRIEF_DISENO_GRAFICO_CON_SCREENSHOTS.md`

Problemas observados en estos briefs:

- algunos tienen marcadores sin completar
- uno usa rutas absolutas locales a `outputs/`
- no son parte del nucleo tecnico de operacion del producto
- parecen artefactos de analisis/diseno, no documentacion normativa del sistema

## 4. Problemas reales priorizados

### Criticos

1. Header y navegacion mobile no alineados con la referencia visual
   - evidencia:
     - `client/src/components/HeaderUCT.tsx` mezcla logo, texto de marca y navegacion en una jerarquia que hoy se ve cargada
     - en desktop aparece el texto `Observatorio` + `KimnGenero` junto al logo
     - en mobile el menu usa `Dialog`, pero la composicion visual aun no reproduce la referencia institucional
   - impacto:
     - marca duplicada, menor claridad visual, peor experiencia en smartphones

2. Contaminacion del repo con artefactos no productivos
   - evidencia:
     - `outputs/` aun existe en disco pero queda ignorado
     - `scripts/node_modules/` ya no forma parte del arbol actual
     - multiples scripts de captura/inspeccion siguen viviendo en `scripts/archive/`
   - impacto:
     - ruido alto, diffs innecesarios, onboarding confuso, riesgo de commits accidentales

3. Documentacion principal mezclada con material auxiliar y desactualizado
   - evidencia:
     - `OPTIMIZATION_PLAN.md` ya no representa el estado actual y ahora es historico
     - `GAP_ANALYSIS.md` ya fue actualizado para reflejar el estado real
     - briefs de diseno archivados fuera del nucleo tecnico
   - impacto:
     - decisiones tomadas con referencias incorrectas

4. Problemas de codificacion de caracteres
   - evidencia:
     - mojibake en `README.md`, varios docs, `Indicadores.tsx`, `IndicadorPage.tsx`, `EstadoAgrupado.tsx`, `normalizers.ts`
   - impacto:
     - mala UX, baja confianza, riesgo de normalizacion defectuosa

### Altos

1. Codigo huerfano o ajeno al dominio
   - evidencia:
     - parte del material sospechoso ya fue eliminado o archivado, pero conviene seguir revisando residuos
   - impacto:
     - deuda cognitiva y ruido para futuros cambios

2. Consumo de API consistente en frontend
   - evidencia:
     - la unificacion a `apiGetJson()` ya avanzo en las paginas principales
   - impacto:
     - menos dispersion y menos ramas de error

3. Estrategia de categorias unificada entre repositorios
   - evidencia:
     - la normalizacion ya paso a una funcion compartida
   - impacto:
     - menor riesgo de drift futuro
   - evidencia:
     - `groupByCategory()` en memoria
     - `groupIndicatorsByArea()` en sqlite
   - impacto:
     - deuda de mantenimiento y riesgo de drift futuro

### Medios

1. Politica de artefactos ya formalizada en `docs/ARTIFACT_POLICY.md`; falta sostener su uso
2. `env.example` ya fue agregado en la raiz del repo
3. `config/index.ts` y otros archivos pequenos parecen residuales
4. `DATA_PIPELINE.md` y `DATA_DICTIONARY.md` reconocen deuda de schema, pero aun no existe validacion estructural automatizada del dataset

## 5. Plan de limpieza ajustado a lo real

### Fase 0 - Contencion inmediata

Objetivo: detener el crecimiento del ruido antes de refactorizar.

Tareas:

1. Endurecer `.gitignore`
   - incluir `outputs/`, `scripts/node_modules/`, sqlite locales y artefactos temporales
   - aceptacion: `git status` deja de listar basura generada
   - riesgo: ignorar algo que si se queria versionar
   - mitigacion: revisar con lista explicita antes de cambiar

2. Declarar que documentos son normativos y cuales son auxiliares
   - mover briefs y reportes a `docs/archive/` o `outputs/` si aplica
   - aceptacion: `docs/` queda orientado a operacion y arquitectura
   - riesgo: perder contexto historico
   - mitigacion: archivar, no borrar de inmediato

3. Marcar `OPTIMIZATION_PLAN.md` como historico
   - aceptacion: deja de usarse como plan vigente
   - riesgo: confundir a quien ya lo estaba usando
   - mitigacion: enlazar desde ese archivo al plan nuevo

4. Priorizar la correccion del header
   - alcance:
     - `client/src/components/HeaderUCT.tsx`
     - si hace falta, estilos globales de `client/src/index.css`
   - aceptacion:
     - el logo queda como unica marca principal
     - se elimina el texto redundante `Observatorio` + `KimnGenero` del bloque visual principal
     - desktop mantiene jerarquia clara y mobile se aproxima a la referencia compartida por el usuario
   - riesgo:
     - romper el comportamiento del menu mobile o el enlace a home
   - mitigacion:
     - validar escritorio y smartphone despues de cada ajuste visual

### Fase 1 - Limpieza de residuos y coherencia base

Objetivo: quitar elementos que no hacen sentido con el dominio real.

Tareas:

1. Inventario de codigo huerfano
   - revisar y clasificar:
   - aceptacion: cada archivo queda en una de estas categorias:
     - activo
     - archivable
     - eliminable
   - riesgo: borrar algo que se pensaba reutilizar
   - mitigacion: confirmar referencias y uso real primero

2. Unificar cliente HTTP
   - migrar `IndicadorPage.tsx` y `EstadoAgrupado.tsx` a `apiGetJson()`
   - aceptacion: todas las llamadas GET del frontend comparten manejo de error
   - riesgo: cambiar mensajes visibles
   - mitigacion: mantener compatibilidad con `message` y `error`

3. Reparar codificacion
   - empezar por:
     - `README.md`
     - docs tecnicos principales
     - `Indicadores.tsx`
     - `IndicadorPage.tsx`
     - `EstadoAgrupado.tsx`
     - `normalizers.ts`
   - aceptacion: no quedan textos rotos visibles en UI ni docs principales
   - riesgo: tocar keys raw historicas que aun hacen falta
   - mitigacion: corregir textos visibles primero; las keys raw se migran con pruebas

4. Ajustar el layout mobile del header
   - revisar:
     - tamanio y espaciado del bloque superior
     - icono de busqueda
     - boton de abrir/cerrar menu
     - lista vertical del dialogo mobile
   - aceptacion:
     - el menu mobile es legible y tactilmente comodo
     - la composicion se parece a la referencia aportada por el usuario
   - riesgo:
     - introducir scroll o alturas raras en pantallas pequenas
   - mitigacion:
     - probar anchos comunes de telefono y tablet

### Fase 2 - Consolidacion estructural

Objetivo: bajar deuda interna sin cambiar el comportamiento publico.

Tareas:

1. Reducir `shared/types/common.ts`
   - mover o eliminar tipos ajenos al dominio real
   - aceptacion: `shared/` refleja solo contratos usados
   - riesgo: imports rotos
   - mitigacion: buscar referencias globales antes de mover

2. Unificar derivacion de categorias
   - definir una sola estrategia reusable para `memory` y `sqlite`
   - aceptacion: una sola fuente de verdad para construir categorias
   - riesgo: alterar orden o shape
   - mitigacion: proteger con tests de contrato existentes

3. Formalizar scripts del repo
   - separar scripts productivos de scripts de investigacion o diseno
   - aceptacion: `scripts/` deja de ser cajon de sastre
   - riesgo: perder utilidades exploratorias utiles
   - mitigacion: mover a `scripts/archive/` o `tools/experimental/`

4. Agregar `env.example`
   - completado: existe un archivo base en la raiz con variables minimas y comentarios utiles

### Fase 3 - Hardening realista

Estado: completada

Objetivo: dejar base mantenible y verificable.

Tareas:

1. Validacion automatica del dataset
   - completado: el arranque valida el seed y falla temprano ante shapes invalidos

2. Revisar si el formato dual del seed debe mantenerse
   - hoy se soporta array y objeto
   - decision: el formato objeto queda como canonico; el array permanece como compatibilidad de lectura
   - aceptacion: documentacion y codigo coinciden en el formato objetivo y en la compatibilidad permitida

3. Revisar continuidad del parche de `wouter`
   - estado: deuda controlada por ahora; no se encontro consumidor interno directo de `window.__WOUTER_ROUTES__`
   - aceptacion: decision vigente, documentada y ligada a uso real de tooling o diagnostico externo

4. Pulido final de copy y docs
   - completado: se limpiaron paginas y documentos con mojibake visible, se cerraron referencias historicas y se dejo trazabilidad del saneamiento
## 6. Cierre del saneamiento

El saneamiento operativo del repositorio quedo completado en tres niveles:

- contencion y limpieza base
- orden estructural y reduccion de residuos
- hardening realista con validacion del dataset y cierre documental

La referencia vigente para mantenimiento incremental sigue siendo este documento junto con `docs/DOCUMENTATION_STATUS.md` y `docs/RELEASE_NOTE_SANAMIENTO_2026-05-20.md`.

## 7. Orden recomendado de ejecucion

1. Arreglar `.gitignore`
2. Marcar documentacion historica y auxiliar
3. Hacer inventario de archivos huerfanos o sospechosos
4. Corregir codificacion visible
5. Unificar `fetch()` del frontend
6. Limpiar tipos compartidos residuales
7. Consolidar estrategia de categorias
8. Formalizar scripts y artefactos
9. Agregar schema de datos y `env.example`

## 8. Archivos candidatos a revision inmediata

### Muy probable basura o residuo

- `scripts/node_modules/`
- `outputs/`
- `Informe_de_cambios_Fase_1.txt`

### Probable codigo huerfano o no integrado

- `config/index.ts`

### Documentacion a mantener pero actualizar

- `GAP_ANALYSIS.md`
- `DEPENDENCY_AUDIT.md`
- `README.md`

## 9. Limitaciones de esta revision

- no se pudieron ejecutar `pnpm`, `node` ni `npm` en esta sesion por restriccion del entorno local de ejecucion
- por eso, esta revision es fuerte en estructura y consistencia estatica, pero no valida runtime en esta corrida
- aun asi, la evidencia del arbol, los tests presentes, los workflows y el contenido de archivos alcanza para ajustar el plan con mucha mas precision que antes

## 10. Siguiente accion concreta

Tomar este documento como plan vigente y ejecutar primero una limpieza no destructiva:

1. clasificar artefactos auxiliares
2. corregir `.gitignore`
3. corregir el header y su version mobile
4. corregir codificacion visible
5. dejar una lista cerrada de archivos eliminables


