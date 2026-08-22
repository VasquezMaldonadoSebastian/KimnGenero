import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowRight, BookOpen, ExternalLink, Search, Sparkles, Star, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { filterNotebooks, getNotebookStats, notebooks, type NotebookItem } from "@/lib/notebooks";

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-extrabold text-brand-dark">{value}</p>
        </div>
        <div className="rounded-2xl bg-brand-primary/10 p-3 text-brand-primary">{icon}</div>
      </div>
    </div>
  );
}

function NotebookArtwork({ item }: { item: NotebookItem }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full items-end justify-between bg-gradient-to-br from-brand-dark via-brand-light to-brand-primary p-5 text-white">
        <div className="max-w-[78%]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">KimnIA</p>
          <p className="mt-2 text-lg font-bold leading-tight">{item.title}</p>
        </div>
        <div className="rounded-full bg-white/15 p-3 backdrop-blur-sm">
          <BookOpen className="h-6 w-6" />
        </div>
      </div>
    );
  }

  return (
    <img
      src={item.imageUrl}
      alt={item.imageAlt}
      loading="lazy"
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      onError={() => setFailed(true)}
    />
  );
}

function NotebookCard({
  item,
  onOpen,
}: {
  item: NotebookItem;
  onOpen: (item: NotebookItem) => void;
}) {
  return (
    <article
      id={item.id}
      className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <button
        type="button"
        onClick={() => onOpen(item)}
        className="relative block aspect-[16/10] overflow-hidden bg-slate-100 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        aria-label={`Ver detalle de ${item.title}`}
      >
        <NotebookArtwork item={item} />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full bg-brand-primary px-3 py-1 text-xs font-bold text-white">
            {item.featured ? "Destacado" : "Notebook"}
          </span>
        </div>
      </button>

      <div className="flex h-full flex-col p-5">
        <div className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          KimnIA
        </div>

        <h3 className="mt-4 text-xl font-bold leading-tight text-slate-900">
          <button
            type="button"
            onClick={() => onOpen(item)}
            className="text-left transition-colors hover:text-brand-primary focus:outline-none focus-visible:underline"
          >
            {item.title}
          </button>
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onOpen(item)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-primary/30 hover:text-brand-primary"
            >
              Ver detalle
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href={item.notebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              NotebookLM
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

function NotebookDetailDialog({
  item,
  onOpenChange,
}: {
  item: NotebookItem | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={Boolean(item)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-slate-200 bg-white p-0">
        {item && (
          <div className="grid gap-0 md:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[260px] bg-slate-100">
              <img src={item.imageUrl} alt={item.imageAlt} className="h-full w-full object-cover" />
              <div className="absolute left-4 top-4 rounded-full bg-brand-primary px-3 py-1 text-xs font-bold text-white">
                KimnIA
              </div>
            </div>

            <div className="p-6 md:p-7">
              <DialogHeader>
                <DialogTitle className="text-2xl font-extrabold tracking-tight text-brand-dark">
                  {item.title}
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed text-slate-600">
                  {item.longSummary}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Estado
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{item.status}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Etiquetas
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={item.notebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
                  >
                    Abrir en NotebookLM
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function NotebooksLMS() {
  const [query, setQuery] = useState("");
  const [selectedNotebook, setSelectedNotebook] = useState<NotebookItem | null>(null);

  useEffect(() => {
    document.title = "KimnIA | KimnGenero";
    window.scrollTo(0, 0);
  }, []);

  const visibleNotebooks = useMemo(() => filterNotebooks(notebooks, query), [query]);
  const stats = useMemo(() => getNotebookStats(notebooks), []);
  const notebookLabel = stats.total === 1 ? "notebook" : "notebooks";

  return (
    <div className="min-h-screen bg-surface-base text-slate-700">
      <section className="relative overflow-hidden bg-brand-dark text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(1,118,222,0.35),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(124,58,237,0.28),_transparent_32%),linear-gradient(135deg,_#1A0A2E_0%,_#03122E_45%,_#0176DE_100%)]" />
        <div className="absolute left-[-5rem] top-12 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-[-4rem] top-8 h-64 w-64 rounded-full bg-sky-300/20 blur-3xl" />

      <div className="container relative z-10 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/80 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              KimnIA
            </div>

            <h1
              className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              KimnIA
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/85 md:text-lg lg:text-xl">
              KimnIA: Kimun es la palabra para el conocimiento, la sabiduria o el saber ancestral.
              KimnIA refleja que este modulo dentro de KimnGenero es un espacio de aprendizaje y
              sabiduria sobre genero, impulsado por tecnologia.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#catalogo"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-pale sm:w-auto"
              >
                Explorar catalogo
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#notebook-01"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15 sm:w-auto"
              >
                Ir al primero
                <BookOpen className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-10 md:pt-14">
        <div className="container">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <StatCard
              label="Notebooks publicados"
              value={stats.total.toString()}
              icon={<BookOpen className="h-5 w-5" />}
            />
            <StatCard
              label="Marcados como destacados"
              value={stats.featured.toString()}
              icon={<Star className="h-5 w-5" />}
            />
          </div>
        </div>
      </section>

      <section className="container pt-8" id="catalogo">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-primary">
                Exploracion rapida
              </p>
              <h2
              className="mt-2 text-2xl font-extrabold tracking-tight text-brand-dark sm:text-3xl"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {stats.total} {notebookLabel} disponibles en KimnIA
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
                Usa la busqueda para filtrar por palabra clave o abre cualquiera de los cuadernos
                directamente en NotebookLM.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por titulo o palabra clave..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10"
              />
            </label>
            {query && (
              <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                <span>{visibleNotebooks.length} resultado(s) encontrado(s)</span>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="inline-flex items-center gap-2 font-semibold text-slate-600 hover:text-brand-primary"
                >
                  <X className="h-4 w-4" />
                  Limpiar
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container pb-16 pt-10">
        {visibleNotebooks.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
            <h2
              className="mt-4 text-2xl font-bold text-brand-dark"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              No encontramos coincidencias
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
              Prueba con otro termino o limpia la busqueda para volver a ver los notebooks
              disponibles.
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-6 rounded-xl bg-brand-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Limpiar busqueda
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {visibleNotebooks.map((item) => (
              <NotebookCard key={item.id} item={item} onOpen={setSelectedNotebook} />
            ))}
          </div>
        )}
      </section>

      <NotebookDetailDialog
        item={selectedNotebook}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedNotebook(null);
          }
        }}
      />
    </div>
  );
}
