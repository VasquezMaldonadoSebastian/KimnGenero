import { useState } from "react";
import { BookMarked, Search } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const terminos = [
  {
    termino: "Brecha de genero",
    definicion:
      "Corresponde a la diferencia observable entre la situacion de mujeres y hombres en distintos ambitos sociales, economicos o institucionales. La brecha permite identificar la magnitud de esas diferencias y evaluar si implican ventajas o desventajas relativas entre ambos grupos. Una brecha positiva indica una posicion mas favorable para las mujeres respecto de los hombres, mientras que una brecha negativa refleja una situacion de desventaja para ellas. En este diagnostico, el concepto se usa para identificar desigualdades en la participacion, condiciones y experiencias de mujeres y hombres en la vida universitaria.",
    categoria: "Conceptos Generales",
  },
  {
    termino: "Conciliacion",
    definicion:
      "Se refiere a la articulacion entre las responsabilidades laborales, familiares y personales, buscando compatibilizar el desempeno de las personas en estos distintos ambitos de la vida. Alude a la forma en que se organizan el tiempo y las actividades asociadas al trabajo remunerado, la vida familiar y el desarrollo personal, asi como a las estrategias que permiten equilibrar dichas esferas.",
    categoria: "Trabajo y Cuidados",
  },
  {
    termino: "Corresponsabilidad",
    definicion:
      "Alude a la distribucion equitativa de las responsabilidades domesticas y de cuidado entre hombres y mujeres, asi como a la participacion conjunta de distintos actores sociales en la organizacion y provision de los cuidados. Este enfoque busca superar la idea de que la conciliacion es un problema individual de las mujeres, promoviendo una redistribucion social de las tareas de cuidado.",
    categoria: "Trabajo y Cuidados",
  },
  {
    termino: "Cuidado",
    definicion:
      "Es un derecho humano autonomo, comprensivo del derecho a cuidar, a ser cuidado y al autocuidado. Se trata de una actividad indispensable para la reproduccion social y para sostener nuestras vidas, nuestro entorno y nuestro mundo, e incluye cuidados fisicos, emocionales y sociales. La carga de cuidados se ha concentrado historicamente en las mujeres de manera desproporcionada.",
    categoria: "Trabajo y Cuidados",
  },
  {
    termino: "Equidad de genero",
    definicion:
      "Se define como la imparcialidad en el trato hacia mujeres y hombres segun sus necesidades especificas. Esta imparcialidad puede implicar un trato igualitario o diferenciado con el fin de compensar desventajas historicas y sociales que afectan a las mujeres.",
    categoria: "Conceptos Generales",
  },
  {
    termino: "Genero",
    definicion:
      "Se entiende por genero la construccion social y cultural de la feminidad y la masculinidad, tanto en lo referente a las caracteristicas psicologicas que se atribuyen a cada sexo como a las pautas de su comportamiento normalizado. La diferencia sexual se naturaliza y se transforma en desigualdad cultural en detrimento historico de las mujeres.",
    categoria: "Conceptos Generales",
  },
  {
    termino: "Igualdad de genero",
    definicion:
      "Se refiere a igualdad de derechos, responsabilidades y oportunidades para hombres y mujeres, para ninas y ninos. Este concepto implica que tanto los derechos como las responsabilidades y las oportunidades no estan sujetas al sexo de las personas.",
    categoria: "Conceptos Generales",
  },
  {
    termino: "Segregacion horizontal",
    definicion:
      "Se refiere a la concentracion desproporcionada de un grupo social en ciertos sectores laborales, campos de estudio, profesiones o industrias, en lugar de una distribucion uniforme. Da cuenta de una persistencia de areas masculinizadas y feminizadas.",
    categoria: "Ambito Laboral",
  },
  {
    termino: "Segregacion vertical",
    definicion:
      "Alude a las diferenciaciones que existen en cuanto al acceso a puestos de trabajo con distinta jerarquia entre mujeres y hombres. Se manifiesta en una alta concentracion de mujeres en los escalones mas bajos de sus ocupaciones y con una mayor concentracion en ocupaciones no conectadas por vinculos de ascendencia y movilidad.",
    categoria: "Ambito Laboral",
  },
  {
    termino: "Violencia de genero",
    definicion:
      "Cualquier accion o conducta basada en el genero que cause muerte, dano o sufrimiento fisico, sexual o psicologico a una persona, tanto en el ambito publico como en el privado. En el contexto de la educacion superior, puede manifestarse a traves de distintas practicas que afectan la dignidad, la integridad o el bienestar de quienes integran la comunidad universitaria.",
    categoria: "Violencia de Genero",
  },
  {
    termino: "Violencia psicologica",
    definicion:
      "Conducta que tiene por objeto causar temor o intimidacion buscando controlar las conductas, sentimientos y pensamientos de la persona agredida. Atenta contra el bienestar psiquico de la o el afectado. Ejemplos: burlas, sobrenombres ofensivos, manipulaciones, insultos, restriccion a la libertad personal, aislamiento y amenazas.",
    categoria: "Violencia de Genero",
  },
  {
    termino: "Violencia sexual",
    definicion:
      "Todo acto sexual, la tentativa de consumar un acto sexual, los comentarios o insinuaciones sexuales no deseados, o las acciones para comercializar o utilizar de cualquier otro modo la sexualidad de una persona mediante coercion por otra persona.",
    categoria: "Violencia de Genero",
  },
  {
    termino: "Violencia fisica",
    definicion:
      "Accion dirigida a atentar contra la integridad fisica de la victima, como un mecanismo para ejercer poder y control. Ejemplos: empujones, tirones de pelo, pellizcos, cachetadas, quemaduras, rasgunos, patadas, golpes de punos, golpes con objetos y ataques con armas.",
    categoria: "Violencia de Genero",
  },
  {
    termino: "Violencia economica/patrimonial",
    definicion:
      "Privar de las necesidades basicas al otro u otra. Incluye control de la victima a traves de la manipulacion del dinero, privacion economica, endeudamiento o control sobre su dinero o bienes.",
    categoria: "Violencia de Genero",
  },
  {
    termino: "Violencia de genero digital",
    definicion:
      "Se perpetra a traves de medios digitales y no esta desconectada de la violencia machista del mundo offline. Incluye amenazas con difundir material intimo, publicacion de informacion privada sin consentimiento, ataques coordinados, acoso sexual en linea y pornografia de venganza.",
    categoria: "Violencia de Genero",
  },
  {
    termino: "Violencia simbolica",
    definicion:
      "Forma de violencia amortiguada, insensible e invisible para sus propias victimas, ejercida a traves de caminos simbolicos de la comunicacion. Es una forma de poder que se ejerce directamente sobre los cuerpos al margen de cualquier coercion fisica, instalando normas incuestionables que orientan emociones, pensamientos y conductas.",
    categoria: "Violencia de Genero",
  },
];

const categorias = ["Todos", "Conceptos Generales", "Trabajo y Cuidados", "Ambito Laboral", "Violencia de Genero"];

export default function Glosario() {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");

  const terminosFiltrados = terminos.filter((t) => {
    const matchBusqueda =
      t.termino.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.definicion.toLowerCase().includes(busqueda.toLowerCase());
    const matchCategoria = categoriaFiltro === "Todos" || t.categoria === categoriaFiltro;
    return matchBusqueda && matchCategoria;
  });

  return (
    <div className="min-h-screen bg-surface-base">
      <PageHeader
        eyebrow={{ icon: <BookMarked className="h-5 w-5" />, label: "Referencia" }}
        title="Glosario de Género"
        subtitle="Definiciones de los principales conceptos sobre equidad, cuidados, brechas y prevención de la violencia de género, fundamentales para el diagnóstico institucional."
      />

        <div className="container py-8 sm:py-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 rounded-xl border border-brand-pale bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar termino o definicion..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full rounded-lg border border-brand-pale bg-brand-pale py-3 pl-9 pr-4 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                />
              </div>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                {categorias.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoriaFiltro(cat)}
                    className={`min-h-11 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                      categoriaFiltro === cat
                        ? "bg-brand-primary text-white"
                        : "border border-brand-pale bg-brand-pale text-gray-600 hover:bg-brand-pale"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              {terminosFiltrados.length} termino{terminosFiltrados.length !== 1 ? "s" : ""} encontrado{terminosFiltrados.length !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="space-y-3">
            {terminosFiltrados.map((t) => (
              <div
                key={t.termino}
                className="rounded-xl border border-brand-pale bg-white p-5 shadow-sm transition-colors hover:border-brand-primary/30 sm:p-6"
              >
                <div className="mb-2 flex items-start justify-between gap-4">
                  <h3 className="text-base font-bold text-brand-dark" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    {t.termino}
                  </h3>
                  <span className="flex-shrink-0 rounded-full bg-brand-pale px-2.5 py-1 text-xs font-semibold text-brand-dark">
                    {t.categoria}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">{t.definicion}</p>
              </div>
            ))}

            {terminosFiltrados.length === 0 && (
              <div className="py-12 text-center text-gray-400">
                <BookMarked className="mx-auto mb-3 h-10 w-10 opacity-30" />
                <p className="text-sm">No se encontraron terminos que coincidan con la busqueda.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
