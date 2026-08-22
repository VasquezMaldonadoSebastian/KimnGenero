/*
 * Metodología — Observatorio de Indicadores de Género
 * Design: Comprehensive academic layout with model definition, state of the art, implementation methodology, and work plan
 */

import { BookOpen, Target, Database, RefreshCw, CheckCircle2, Zap, BarChart3 } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const principios = [
  {
    icono: <Target className="w-5 h-5 text-brand-primary" />,
    titulo: "Pertinencia",
    descripcion: "Los indicadores responden a necesidades concretas de información para el diseño y evaluación de políticas públicas con enfoque de género.",
  },
  {
    icono: <CheckCircle2 className="w-5 h-5 text-brand-primary" />,
    titulo: "Confiabilidad",
    descripcion: "Los datos provienen de fuentes oficiales, encuestas estadísticas con diseño probabilístico y registros administrativos validados.",
  },
  {
    icono: <Database className="w-5 h-5 text-brand-primary" />,
    titulo: "Desagregación",
    descripcion: "Todos los indicadores se presentan desagregados por sexo como mínimo, con desagregaciones adicionales por edad, región y nivel socioeconómico.",
  },
  {
    icono: <RefreshCw className="w-5 h-5 text-brand-primary" />,
    titulo: "Actualización periódica",
    descripcion: "Los indicadores se actualizan con la periodicidad de sus fuentes primarias, garantizando información reciente.",
  },
];

const etapas = [
  {
    numero: 1,
    titulo: "Diseño",
    descripcion: "Planificación estratégica, definición de indicadores y ajuste a cambios normativos.",
    icono: <Target className="w-5 h-5" />,
  },
  {
    numero: 2,
    titulo: "Implementación",
    descripcion: "Ejecución de planes de acción basados en diagnósticos participativos.",
    icono: <Zap className="w-5 h-5" />,
  },
  {
    numero: 3,
    titulo: "Seguimiento",
    descripcion: "Monitoreo operativo y estratégico de resultados para retroalimentación institucional.",
    icono: <BarChart3 className="w-5 h-5" />,
  },
];

const estandares = [
  {
    nivel: "Fortalecer",
    descripcion: "Capacidades personales y colectivas en perspectiva de género",
    color: "bg-brand-pale",
    textColor: "text-brand-primary",
  },
  {
    nivel: "Consolidar",
    descripcion: "Institucionalización con garantías de sostenibilidad",
    color: "bg-brand-mid",
    textColor: "text-brand-dark",
  },
  {
    nivel: "Transformar",
    descripcion: "Cambio sistémico y transformación de cultura organizacional",
    color: "bg-brand-primary",
    textColor: "text-white",
  },
];

const ambitos = [
  {
    titulo: "Formación Continua",
    descripcion: "Desarrollo de capacidades en perspectiva de género para toda la comunidad universitaria.",
    icono: "📚",
  },
  {
    titulo: "Participación Activa Estamental",
    descripcion: "Involucramiento de estudiantes, académicos y administrativos en decisiones institucionales.",
    icono: "👥",
  },
  {
    titulo: "Sensibilización y Difusión",
    descripcion: "Comunicación estratégica para transformación cultural hacia la equidad.",
    icono: "📢",
  },
  {
    titulo: "Monitoreo y Evaluación",
    descripcion: "Seguimiento basado en evidencia mediante indicadores estratégicos.",
    icono: "📊",
  },
];

const fases = [
  {
    numero: 1,
    titulo: "Diagnóstico Institucional",
    descripcion: "El Observatorio de Equidad de Género (OEG) analiza información para identificar nudos críticos por unidad.",
  },
  {
    numero: 2,
    titulo: "Autodiagnóstico Participativo",
    descripcion: "Realización de talleres con las unidades para contextualizar brechas y priorizar acciones.",
  },
  {
    numero: 3,
    titulo: "Formulación de Planes de Acción",
    descripcion: "Cada unidad responsable diseña planes con objetivos, actividades y plazos validados técnicamente.",
  },
];

export default function Metodologia() {
  return (
    <div className="min-h-screen bg-surface-base">
      <PageHeader
        eyebrow={{ icon: <BookOpen className="w-5 h-5" />, label: "Documentación" }}
        title="Metodología"
        subtitle="Modelo de Promoción de la Igualdad de Género y No Discriminación: marco conceptual, implementación y operacionalización."
      />

      <div className="container py-8 sm:py-10">
        <div className="mx-auto max-w-4xl space-y-6 sm:space-y-10">

          {/* 1. Definición del Modelo */}
          <section className="rounded-xl border border-brand-pale bg-white p-5 shadow-sm sm:p-8">
            <h2
              className="text-xl font-bold text-brand-dark mb-4"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              1. Definición del Modelo
            </h2>
            <p className="text-gray-700 leading-relaxed">
              El <strong>Modelo de Promoción de la Igualdad de Género y No Discriminación</strong> es un mecanismo institucional de mejora continua diseñado para instalar capacidades organizacionales que aseguren la transversalización de la perspectiva de género en todas las áreas de la Universidad Católica de Temuco.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Su fin principal es permitir que la planta administrativa, académica y el estudiantado desarrollen sus trayectorias de manera equitativa y sin distinciones de género, promoviendo una cultura institucional inclusiva y libre de discriminación.
            </p>
          </section>

          {/* 2. Estado del Arte */}
          <section className="rounded-xl border border-brand-pale bg-white p-5 shadow-sm sm:p-8">
            <h2
              className="text-xl font-bold text-brand-dark mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              2. Estado del Arte (Antecedentes y Contexto)
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-brand-dark mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Marco Normativo
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  El modelo responde a exigencias legales nacionales como la <strong>Ley N°21.369</strong> (acoso y violencia de género en educación superior), la <strong>Ley N°21.643</strong> (acoso laboral y sexual) y la <strong>Ley N°21.645</strong> (conciliación vida laboral y familiar). Asimismo, se alinea con los criterios de la Comisión Nacional de Acreditación (CNA) sobre equidad y diversidad.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-brand-dark mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Trayectoria Institucional
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  El modelo recoge avances previos de la UC Temuco, como la <strong>Política de Género (2019)</strong> y la creación de la <strong>Dirección de Género (2020)</strong>, consolidando una trayectoria institucional de compromiso con la equidad.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-brand-dark mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Diagnóstico de Brechas
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  El modelo se fundamenta en una revisión de modelos nacionales e internacionales y en los resultados del <strong>Diagnóstico de Brechas y Desigualdades de Género de 2022</strong> realizado en la universidad, identificando nudos críticos y oportunidades de mejora.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Metodología de Implementación */}
          <section className="rounded-xl border border-brand-pale bg-white p-5 shadow-sm sm:p-8">
            <h2
              className="text-xl font-bold text-brand-dark mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              3. Metodología de Implementación
            </h2>
            
            <div className="mb-8">
              <h3 className="font-semibold text-brand-dark mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Ciclo PHVA (Planificar, Hacer, Verificar, Actuar)
              </h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
                {etapas.map((etapa) => (
                <div key={etapa.numero} className="rounded-lg border border-brand-pale bg-brand-pale p-4 sm:p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center text-sm font-bold">
                        {etapa.numero}
                      </div>
                      <h4 className="font-semibold text-brand-dark" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {etapa.titulo}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{etapa.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-brand-dark mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Ruta Progresiva de Transversalización
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm mb-4">
                El modelo establece tres estándares de avance que permiten medir el progreso institucional:
              </p>
              <div className="space-y-3">
                {estandares.map((est) => (
                  <div key={est.nivel} className={`${est.color} rounded-lg border border-brand-pale p-4`}>
                    <div className={`font-semibold ${est.textColor} mb-1`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {est.nivel}
                    </div>
                    <div className={`text-sm ${est.textColor} opacity-90`}>{est.descripcion}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-brand-dark mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Ámbitos Estratégicos de Acción
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm mb-4">
                El trabajo se organiza en cuatro ejes transversales:
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {ambitos.map((ambito) => (
                  <div key={ambito.titulo} className="rounded-lg border border-brand-pale bg-brand-pale p-4 sm:p-5">
                    <div className="text-2xl mb-2">{ambito.icono}</div>
                    <h4 className="font-semibold text-brand-dark mb-2 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {ambito.titulo}
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{ambito.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Plan de Trabajo */}
          <section className="rounded-xl border border-brand-pale bg-white p-5 shadow-sm sm:p-8">
            <h2
              className="text-xl font-bold text-brand-dark mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              4. Plan de Trabajo (Operacionalización)
            </h2>
            
            <div className="mb-8">
              <h3 className="font-semibold text-brand-dark mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Dimensiones e Indicadores
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm mb-4">
                Se definieron <strong>8 dimensiones clave</strong> operacionalizadas mediante <strong>19 indicadores estratégicos</strong> que permiten monitorear el avance en la transversalización de la perspectiva de género:
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3"><span className="text-brand-primary font-bold">•</span> <span><strong>Institucionalización:</strong> Normativas y políticas con perspectiva de género</span></li>
                <li className="flex gap-3"><span className="text-brand-primary font-bold">•</span> <span><strong>Violencia de Género:</strong> Conocimiento y cumplimiento de protocolos</span></li>
                <li className="flex gap-3"><span className="text-brand-primary font-bold">•</span> <span><strong>Corresponsabilidad:</strong> Conciliación vida laboral y familiar</span></li>
                <li className="flex gap-3"><span className="text-brand-primary font-bold">•</span> <span><strong>Trayectorias Laborales:</strong> Participación y cargos directivos</span></li>
                <li className="flex gap-3"><span className="text-brand-primary font-bold">•</span> <span>Y otras dimensiones de análisis estratégico</span></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-brand-dark mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Fases de la Implementación
              </h3>
              <div className="space-y-3">
                {fases.map((fase) => (
                  <div key={fase.numero} className="rounded-lg border border-brand-pale bg-brand-pale p-4 sm:p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {fase.numero}
                      </div>
                      <div>
                        <h4 className="font-semibold text-brand-dark mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {fase.titulo}
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed">{fase.descripcion}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 5. Principios Rectores */}
          <section>
            <h2
              className="text-xl font-bold text-brand-dark mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              5. Principios Rectores
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {principios.map((p) => (
                <div key={p.titulo} className="rounded-xl border border-brand-pale bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-pale flex items-center justify-center">
                      {p.icono}
                    </div>
                    <h3
                      className="font-semibold text-brand-dark"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {p.titulo}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{p.descripcion}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Disclaimer */}
          <div className="rounded-xl bg-brand-dark p-5 text-white sm:p-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-brand-accent text-sm font-bold">i</span>
              </div>
              <div>
                <h3
                  className="font-semibold text-white mb-1 text-sm"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Nota sobre la calidad de los datos
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  La calidad de las cifras presentadas en esta plataforma es de exclusiva responsabilidad de la Universidad Católica de Temuco como institución productora del indicador. Si presenta consultas respecto a algún indicador, puede dirigirlas al equipo del Observatorio a través del formulario de contacto.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
