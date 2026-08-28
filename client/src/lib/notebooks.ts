export interface NotebookItem {
  id: string;
  title: string;
  summary: string;
  longSummary: string;
  status: "Publicado";
  featured: boolean;
  tags: string[];
  imageUrl: string;
  imageAlt: string;
  notebookUrl: string;
}

export const notebooks: NotebookItem[] = [
  {
    id: "notebook-01",
    title: "Recursos sobre Brechas y Estudios de Género en Chile",
    summary:
      "NotebookLM sobre brechas y estudios de género en Chile, disponible para consulta y navegación desde el catálogo.",
    longSummary:
      "NotebookLM sobre brechas y estudios de género en Chile, disponible para consulta y navegación desde el catálogo KimnGenero. Por ahora se mantiene como parte del módulo mínimo para validar navegación, detalle y salida externa.",
    status: "Publicado",
    featured: true,
    tags: ["Chile", "brechas de género", "estudios de género", "NotebookLM"],
    imageUrl: "/assets/kimnia-chile.png",
    imageAlt: "Recursos sobre Brechas y Estudios de Género en Chile",
    notebookUrl:
      "https://notebooklm.google.com/notebook/025011de-ca9f-4e76-8fbd-d1f58a2bccb4?authuser=1",
  },
  {
    id: "notebook-02",
    title: "Recursos sobre Brechas y Estudios de Género en América Latina",
    summary:
      "NotebookLM sobre brechas y estudios de género en América Latina, disponible para consulta y navegación desde el catálogo.",
    longSummary:
      "NotebookLM sobre brechas y estudios de género en América Latina, disponible para consulta y navegación desde el catálogo KimnGenero. Por ahora se mantiene como parte del módulo mínimo para validar navegación, detalle y salida externa.",
    status: "Publicado",
    featured: false,
    tags: ["América Latina", "brechas de género", "estudios de género", "NotebookLM"],
    imageUrl: "/assets/kimnia-latam.png",
    imageAlt: "Recursos sobre Brechas y Estudios de Género en América Latina",
    notebookUrl:
      "https://notebooklm.google.com/notebook/2f956a0e-db54-4fd4-8495-8523ce29eed2?authuser=1",
  },
  {
    id: "notebook-03",
    title: "Recursos sobre Brechas y Estudios de Género en el Mundo",
    summary:
      "NotebookLM con recursos de alcance global para explorar enfoques y referencias comparadas sobre género.",
    longSummary:
      "NotebookLM con recursos de alcance global para explorar enfoques, marcos y referencias comparadas sobre género dentro de KimnIA y KimnGenero.",
    status: "Publicado",
    featured: false,
    tags: ["Mundo", "perspectiva global", "género", "NotebookLM"],
    imageUrl: "/assets/kimnia-mundo.png",
    imageAlt: "Cuaderno Mundo con enfoque global sobre género",
    notebookUrl:
      "https://notebooklm.google.com/notebook/2c746c6c-44dc-4c35-bd1d-c7470274fd85?authuser=1",
  },
  {
    id: "notebook-04",
    title: "Recursos sobre Brechas y Estudios de Género en la UCT",
    summary:
      "NotebookLM institucional con contenidos y recursos vinculados a la Universidad Católica de Temuco.",
    longSummary:
      "NotebookLM institucional con contenidos y recursos vinculados a la Universidad Católica de Temuco, pensado para apoyar la consulta y la navegación dentro de KimnIA.",
    status: "Publicado",
    featured: true,
    tags: ["UCT", "institucional", "universidad", "NotebookLM"],
    imageUrl: "/assets/kimnia-uct.png",
    imageAlt: "Cuaderno UCT con identidad institucional de la Universidad Católica de Temuco",
    notebookUrl:
      "https://notebooklm.google.com/notebook/e6442ee1-acd8-4cde-9b79-a820bb1ec0a9?authuser=1",
  },
];

function normalizeText(value: string) {
  return value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function filterNotebooks(items: NotebookItem[], query = "") {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) => {
    const searchableValues = [item.title, item.summary, item.longSummary, item.tags.join(" ")].join(
      " ",
    );
    return normalizeText(searchableValues).includes(normalizedQuery);
  });
}

export function getNotebookStats(items: NotebookItem[]) {
  return {
    total: items.length,
    featured: items.filter((item) => item.featured).length,
  };
}
