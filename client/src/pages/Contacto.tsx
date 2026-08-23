import { Mail, MapPin, MessageSquare, Phone, Send } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useState } from "react";
import { toast } from "sonner";

export default function Contacto() {
  const [form, setForm] = useState({
    nombre: "",
    institucion: "",
    email: "",
    asunto: "",
    mensaje: "",
  });
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setTimeout(() => {
      setEnviando(false);
      toast.success("Mensaje enviado correctamente. Nos pondremos en contacto a la brevedad.");
      setForm({ nombre: "", institucion: "", email: "", asunto: "", mensaje: "" });
    }, 1200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-surface-base">
      <PageHeader
        eyebrow={{ icon: <MessageSquare className="h-5 w-5" />, label: "Comunicaciones" }}
        title="Contacto"
        subtitle="Para consultas sobre los datos, solicitudes de información o colaboraciones institucionales, utilice el formulario o los canales de contacto indicados."
      />

      <div className="container py-8 sm:py-10">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="rounded-xl border border-brand-pale bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-dark" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Información de Contacto
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-pale">
                    <Mail className="h-4 w-4 text-brand-primary" />
                  </div>
                  <div>
                    <div className="mb-0.5 text-xs text-gray-600">Correo electrónico</div>
                    <a href="mailto:observatorio@uct.cl" className="text-sm font-medium text-brand-primary hover:underline">
                      observatorio@uct.cl
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-pale">
                    <Phone className="h-4 w-4 text-brand-primary" />
                  </div>
                  <div>
                    <div className="mb-0.5 text-xs text-gray-600">Dirección de Género</div>
                    <a href="tel:+56452685126" className="text-sm font-medium text-gray-700 hover:text-brand-primary">
                      (45) 2 685126
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-pale">
                    <Phone className="h-4 w-4 text-brand-primary" />
                  </div>
                  <div>
                    <div className="mb-0.5 text-xs text-gray-600">Observatorio de Género</div>
                    <a href="tel:+56452685057" className="text-sm font-medium text-gray-700 hover:text-brand-primary">
                      (45) 2 685057
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-pale">
                    <MapPin className="h-4 w-4 text-brand-primary" />
                  </div>
                  <div>
                    <div className="mb-0.5 text-xs text-gray-600">Dirección</div>
                    <span className="text-sm text-gray-700">
                      Manuel Montt 56, Campus San Francisco,
                      <br />
                      Edificio 03, 4° Nivel
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-xl bg-brand-dark p-5 text-white sm:p-6">
              <h3 className="mb-2 text-sm font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Horario de atención
              </h3>
              <p className="text-xs leading-relaxed text-gray-300">
                Lunes a viernes
                <br />
                09:00 - 18:00 hrs.
                <br />
                <span className="text-gray-600">(Hora de Santiago, GMT-3)</span>
              </p>
              <div className="mt-4 border-t border-white/10 pt-4">
                <p className="text-xs leading-relaxed text-gray-600">
                  El tiempo de respuesta habitual es de 2 a 5 días hábiles.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-xl border border-brand-pale bg-white p-5 shadow-sm sm:p-8">
              <h2 className="mb-6 font-bold text-brand-dark" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Enviar consulta
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                      Nombre completo <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Su nombre"
                      className="w-full rounded-lg border border-brand-pale bg-brand-pale px-3.5 py-2.5 text-sm placeholder:text-gray-600 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">Institución</label>
                    <input
                      type="text"
                      name="institucion"
                      value={form.institucion}
                      onChange={handleChange}
                      placeholder="Organización o institución"
                      className="w-full rounded-lg border border-brand-pale bg-brand-pale px-3.5 py-2.5 text-sm placeholder:text-gray-600 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                    Correo electrónico <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="correo@ejemplo.cl"
                    className="w-full rounded-lg border border-brand-pale bg-brand-pale px-3.5 py-2.5 text-sm placeholder:text-gray-600 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                    Asunto <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="asunto"
                    value={form.asunto}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-brand-pale bg-brand-pale px-3.5 py-2.5 text-sm text-gray-700 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  >
                    <option value="">Seleccione un asunto</option>
                    <option value="consulta-datos">Consulta sobre datos o indicadores</option>
                    <option value="metodologia">Consulta metodológica</option>
                    <option value="colaboracion">Propuesta de colaboración institucional</option>
                    <option value="error">Reporte de error en los datos</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                    Mensaje <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    name="mensaje"
                    value={form.mensaje}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Describa su consulta con el mayor detalle posible..."
                    className="resize-none w-full rounded-lg border border-brand-pale bg-brand-pale px-3.5 py-2.5 text-sm placeholder:text-gray-600 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  />
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-gray-600">
                    <span className="text-red-600">*</span> Campos obligatorios
                  </p>
                  <button
                    type="submit"
                    disabled={enviando}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {enviando ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Enviar mensaje
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
