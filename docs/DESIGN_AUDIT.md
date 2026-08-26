# Auditoría de diseño — KimnGenero

**Fecha:** 21 de agosto de 2026
**Alcance:** versión simplificada de `codex/production-simplification`, revisada localmente con build de producción. No se modificó la interfaz durante esta auditoría.

## Veredicto

La versión conserva la identidad institucional y las páginas cargan, pero **aún no tiene una capa visual homogénea de producción**. Hay dos defectos de navegación objetivos y varias familias visuales que compiten entre sí. Deben corregirse antes de promover esta rama.

## Evidencia revisada

| Vista | Rutas |
|---|---|
| Escritorio, 1440 × 900 | `/`, `/indicadores`, `/indicador/1`, `/metodologia`, `/glosario`, `/contacto`, `/calendario`, `/estado-agrupado`, `/kimnia` |
| Intermedia, 1024 × 768 | `/` |
| Móvil, 390 × 844 | `/`, `/indicadores`, `/indicador/1`, `/kimnia` |

La build de producción se completó correctamente y no se registraron warnings o errores de consola durante el recorrido.

## Hallazgos prioritarios

| Prioridad | Hallazgo | Evidencia | Impacto | Recomendación |
|---|---|---|---|---|
| P0 | El botón de menú aparece en escritorio junto con la navegación completa. | A 1440 px, el `nav` y el botón están visibles. | Duplica mecanismos de navegación y contradice el comportamiento esperado. | Definir un único breakpoint: navegación horizontal en escritorio y botón exclusivamente bajo ese breakpoint. |
| P0 | Entre 1024 y 1279 px no hay navegación horizontal; sólo queda el botón móvil. | A 1024 px, la barra institucional está visible, `nav` está oculto y el botón se muestra. | Una pantalla de escritorio/tablet queda tratada como móvil. | Alinear los breakpoints de barra institucional, menú y navegación; validar 1024, 1280 y 1440 px. |
| P0 | El listado de indicadores desborda horizontalmente en móvil. | A 390 px el documento mide 556 px; el selector de dimensiones mide 532 px. | Oculta parte del control y rompe la composición móvil. | Asegurar `min-width: 0`, ancho completo y controles apilados sin ancho intrínseco que fuerce overflow. |
| P0 | La barra institucional superior quedó incompleta y su contenido fue retirado. | El cambio `91247b6` eliminó cuatro íconos sociales del extremo derecho y dejó un contenedor vacío; en móvil la franja de ayuda/pagos desaparece del shell y sólo reaparece dentro del diálogo. | La barra se percibe vacía, incompleta y con contenido institucional perdido. | Recuperar la composición aprobada con enlaces institucionales reales; si las redes no tienen URL válida, reemplazarlas por accesos aprobados, no por espacio vacío. Definir además su presencia en móvil. |
| P1 | Existen cuatro tratamientos de portada sin un patrón común. | Inicio blanco editorial; detalle y KimnIA con gradiente oscuro; calendario con imagen; metodología/glosario/contacto con cabecera pálida. | Cada página parece pertenecer a un producto distinto. | Formalizar 2 variantes: `page-header` claro para contenidos y `feature-hero` oscuro para experiencias destacadas. Calendario debe adoptar una de ellas. |
| P1 | La escala de contenedores y espaciado no está unificada. | Home ocupa casi todo el ancho; metodología, glosario y contacto usan columnas angostas; indicadores usa rejilla amplia. | El ritmo visual cambia abruptamente entre páginas. | Crear tokens para ancho de lectura, ancho de contenido y separación vertical, y reutilizarlos en todas las rutas. |
| P1 | Los embeds dominan visualmente mientras cargan y no comunican estado. | Calendario muestra un bloque gris; vista general muestra el área Power BI prácticamente vacía con su marca. | El usuario percibe un fallo o una página incompleta. | Incorporar skeleton/estado de carga con altura estable, texto útil y estado de error; mantener la identidad visual del shell. |
| P2 | Los colores y estilos están distribuidos como valores literales. | 52 literales de color en Metodología, 28 en Contacto, 26 en Indicadores; el sistema base ya declara tokens. | La homogeneización será frágil y costosa; ajustes de marca se propagan manualmente. | Consolidar colores, bordes, radios, sombras y estados en tokens semánticos y variantes reutilizables. |
| P2 | Tarjetas, filtros y formularios no comparten una gramática única. | Indicadores usa tarjetas con cabecera de color; metodología/glosario usan superficies blancas; contacto combina tarjeta clara y bloque violeta. | La lectura de jerarquía y acción cambia por página. | Definir componentes base: `Card`, `FilterBar`, `PageHeader`, `FeatureHero`, `StatCard` y `FormField`. |

## Lectura por área

### Navegación y shell

- **La barra azul sí existe**, pero **no está completa**: el cambio `91247b6` quitó cuatro accesos sociales del extremo derecho y dejó el contenedor vacío. Además, en móvil los accesos de ayuda/pagos salen del shell y sólo reaparecen dentro del diálogo. Por eso la experiencia percibe contenido perdido, no sólo un problema de breakpoint.
- El logo, la barra institucional, la navegación y el botón de menú usan breakpoints distintos. Esa desalineación explica tanto el icono visible en escritorio como el vacío de navegación en 1024 px.
- Header y footer mantienen la misma identidad, pero la cabecera consume una proporción alta en móvil cuando se combina con héroes grandes.

### Inicio e indicadores

- El inicio tiene buena jerarquía editorial y métricas legibles. En móvil se mantiene ordenado.
- El listado de indicadores es visualmente coherente con el inicio en escritorio, pero su barra de filtros falla en 390 px por desborde horizontal.
- El detalle del indicador tiene una presencia visual fuerte y un CTA claro; su hero oscuro es apto para contenido focalizado.

### Contenido institucional

- Metodología, glosario y contacto comparten fondo claro y tarjetas, por lo que son la base más consistente para páginas informativas.
- Contacto introduce un bloque violeta intenso sin equivalente en las demás rutas; debería ser un token de “información destacada” o volver al sistema azul institucional.
- Calendario usa una imagen hero distinta a las demás rutas; sin un patrón explícito, se siente excepcional de forma accidental.

### KimnIA

- KimnIA es la mejor variante de hero destacado: contraste, CTAs y tarjetas posteriores son claros tanto en escritorio como en móvil.
- Debe mantenerse como variante `feature`, no convertirse en la referencia para todas las páginas informativas.

## Plan de corrección recomendado

### 1. Reparar el shell y la respuesta móvil — bloqueante

1. Restituir la composición aprobada de la barra superior con destinos reales o con reemplazos institucionales aprobados; eliminar el contenedor vacío sólo si esa es la decisión visual explícita.
2. Establecer el breakpoint de navegación de escritorio y ocultar el botón de menú por encima de él.
3. Alinear la visibilidad de franja superior, logo, navegación y menú para 390, 768, 1024, 1280 y 1440 px.
4. Corregir la barra de filtros para que ningún elemento supere el ancho de viewport móvil.
5. Añadir pruebas visuales de regresión para header y filtros en 390, 1024 y 1440 px.

### 2. Definir el sistema visual mínimo

1. Crear tokens semánticos de superficie, texto, borde, radio, sombra y espaciado.
2. Crear los patrones reutilizables `PageHeader` claro y `FeatureHero` oscuro.
3. Establecer tres anchos: lectura, contenido y rejilla; evitar valores arbitrarios por página.
4. Normalizar `Card`, `FilterBar`, `FormField` y estados de carga para embeds.

### 3. Aplicar la homogeneización por familias

1. Inicio, Indicadores y Detalle: conservar la narrativa de datos y alinear cards/CTAs.
2. Metodología, Glosario y Contacto: adoptar `PageHeader` y el mismo sistema de superficies.
3. Calendario y Vista general: mantener sus integraciones, pero envolverlas en un patrón de embed consistente.
4. KimnIA: conservar su hero de producto destacado y normalizar componentes inferiores.

## Criterios de salida

- No hay botón de menú visible cuando la navegación de escritorio está visible.
- Entre 1024 y 1440 px siempre existe una navegación principal clara.
- En 390 px el `scrollWidth` no supera el ancho de viewport en ninguna ruta pública.
- La barra institucional recupera su composición aprobada, no contiene áreas vacías y tiene una política definida en todos los breakpoints.
- Todas las páginas se clasifican y renderizan con sólo dos patrones de cabecera aprobados.
- Embeds muestran carga, error y contenido con altura estable.
- Colores, radios, sombras y espaciado usan tokens o componentes compartidos en vez de literales locales.

## Fuentes técnicas

- `client/src/components/HeaderUCT.tsx` — breakpoints y visibilidad de navegación.
- `client/src/features/indicadores/pages/Indicadores.tsx` — composición de filtros móviles.
- `client/src/index.css` — tokens existentes y reglas globales.



## Auditoría complementaria — referencia institucional y correcciones aplicadas

**Fecha:** 25 de agosto de 2026
**Referencia visual:** captura adjunta y estructura pública de [kimn.uct.cl](https://kimn.uct.cl/). La captura se interpretó como referencia de diseño; no se trataron sus textos como instrucciones de implementación.

### Criterios de marca

- La marca debe escribirse como **KIMN** en titulares, navegación y textos visibles cuando se refiere al sistema institucional.
- El módulo debe escribirse **KIMNIA**, no `KimnIA`.
- `KimnGenero` se conserva como nombre técnico del repositorio y de la aplicación cuando corresponde al identificador del producto.

### Barra institucional superior

La barra de referencia contiene, en este orden, los accesos externos: **CONECTA**, **UCT AL DÍA**, **TEC-UCT**, **CENTRO DE AYUDA**, **DIRECTORIO**, **WEBMAIL**, **PORTAL DE PAGOS**, **TVUCT** y **UCT RADIO**. Se mantuvieron las redes sociales existentes porque el requerimiento confirma que sus enlaces y representación ya son correctos.

La implementación aplicada en `HeaderUCT`:

- reemplaza los accesos internos incorrectos de la barra por los nueve destinos oficiales;
- replica el gradiente vertical institucional `#048FD4` a `#0087CC`;
- usa Roboto regular a `0.8rem`, separadores blancos al 18% y padding horizontal equivalente al sitio de referencia;
- conserva desplazamiento horizontal en pantallas estrechas para evitar compresión o solapamiento;
- aplica la misma barra en el menú móvil, sin alterar las redes sociales.

### Superficies, bordes y contraste

- Se detectó una ruptura visual en Contacto: la tarjeta de horario utilizaba `brand-dark`, generando un bloque navy aislado respecto del resto de páginas institucionales.
- Se corrigió usando superficie `brand-pale`, borde del mismo sistema y texto gris oscuro. Esto conserva jerarquía sin introducir una mancha azul oscura.
- El sistema todavía contiene usos legítimos de `brand-dark` en héroes y elementos de énfasis; no deben eliminarse indiscriminadamente porque cumplen una función distinta a la tarjeta informativa de Contacto.
- Debe mantenerse una revisión específica de bordes, divisores y fondos por página: los tonos oscuros deben reservarse para navegación, héroes destacados y estados de énfasis, no para márgenes o tarjetas informativas comunes.

### Hallazgos visuales globales

| Prioridad | Área | Hallazgo | Acción |
|---|---|---|---|
| P0 | Marca | Variantes `Kimn`/`KimnIA` rompían la regla de capitalización institucional. | Normalizado a `KIMN`/`KIMNIA` en las superficies visibles auditadas. |
| P0 | Shell | La primera barra mostraba navegación interna en lugar de la barra institucional de referencia. | Corregida en `HeaderUCT.tsx` con enlaces oficiales y estilo UCT. |
| P1 | Contacto | Tarjeta de horario con fondo navy aislado y texto de baja coherencia con el tema claro. | Migrada a superficie pálida con contraste oscuro. |
| P1 | Sistema cromático | Persisten familias de superficies claras, heroes oscuros y embeds que requieren reglas explícitas. | Mantener `PageHeader` claro para contenido institucional y `FeatureHero` oscuro sólo para experiencias destacadas. |
| P1 | Responsive | Barra superior y navegación principal tienen necesidades distintas de ancho. | Validar 390, 768, 1024, 1280 y 1440 px; la barra superior debe desplazarse, no desbordar el documento. |
| P2 | Componentes | Bordes, sombras y radios todavía se declaran localmente en varias páginas. | Consolidar gradualmente en tokens semánticos y componentes compartidos. |

### Archivos modificados

- `client/src/components/HeaderUCT.tsx` — barra institucional, enlaces y regla KIMNIA.
- `client/src/components/HeaderUCT.test.tsx` — cobertura de enlaces oficiales y capitalización.
- `client/src/pages/Contacto.tsx` — eliminación del recuadro navy aislado.
- `client/src/pages/Home.tsx` — título visible `KIMN`.
- `client/src/pages/NotebooksLMS.tsx` — normalización visible a `KIMNIA`.

### Corrección adicional detectada

La auditoría inicial no había retirado dos CTAs de la portada: `Explorar Indicadores` y `Ver Metodología`. Ambos fueron eliminados de `client/src/pages/Home.tsx` para dejar la portada sin botones redundantes.
