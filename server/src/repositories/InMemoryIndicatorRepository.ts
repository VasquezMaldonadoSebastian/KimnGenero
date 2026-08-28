import type {
  GroupedReport,
  Indicator,
  IndicatorCategory,
  RawGroupedReport,
  RawIndicator,
} from "../../../shared/types/indicator-domain";
import type { IndicatorRepository } from "./IndicatorRepository";
import { groupIndicatorsByArea, mapItem } from "../services/normalizers";

function mapGroupedReport(item: RawGroupedReport): GroupedReport {
  return {
    id: item.id,
    titulo: item.titulo,
    descripcion: item.descripcion,
    iframeSrc: item.iframeSrc,
    tipo: item.tipo,
  };
}

type InMemoryIndicatorRepositoryOptions = {
  indicatorsData: RawIndicator[];
  reportsData?: RawGroupedReport[];
};

export class InMemoryIndicatorRepository implements IndicatorRepository {
  private initialized = false;
  private readonly rawIndicators: RawIndicator[];
  private readonly rawReports: RawGroupedReport[];

  private indicators: Indicator[] = [];
  private categories: IndicatorCategory[] = [];
  private groupedReports: GroupedReport[] = [];

  constructor(options: InMemoryIndicatorRepositoryOptions) {
    this.rawIndicators = options.indicatorsData;
    this.rawReports = options.reportsData ?? [];
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    this.indicators = this.rawIndicators.map(mapItem);
    this.categories = groupIndicatorsByArea(this.indicators);
    this.groupedReports = this.rawReports.map(mapGroupedReport);
    this.initialized = true;
  }

  getIndicators(): Indicator[] {
    return this.indicators;
  }

  getIndicator(id: string): Indicator | undefined {
    return this.indicators.find((ind) => ind.id === id);
  }

  getCategories(): IndicatorCategory[] {
    return this.categories;
  }

  getIndicatorsByCategory(categoryId: string): Indicator[] {
    const category = this.categories.find((cat) => cat.id === categoryId);
    return category ? category.indicadores : [];
  }

  getGroupedReports(): GroupedReport[] {
    return this.groupedReports;
  }
}
