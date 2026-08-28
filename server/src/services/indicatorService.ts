import type { GroupedReport, Indicator, IndicatorCategory } from "../../../shared/types/indicator-domain";
import type { IndicatorRepository } from "../repositories/IndicatorRepository";

export type IndicatorQuery = {
  area?: string;
  dimension?: string;
};

export class IndicatorService {
  constructor(private readonly repository: IndicatorRepository) {}

  queryIndicators(query: IndicatorQuery): Indicator[] {
    const indicators = this.repository.getIndicators();
    const area = query.area?.trim();
    const dimension = query.dimension?.trim();

    return indicators.filter((ind) => {
      if (area && ind.area !== area) return false;
      if (dimension && ind.dimension !== dimension) return false;
      return true;
    });
  }

  getIndicators(): Indicator[] {
    return this.repository.getIndicators();
  }

  getIndicator(id: string): Indicator | undefined {
    return this.repository.getIndicator(id);
  }

  getCategories(): IndicatorCategory[] {
    return this.repository.getCategories();
  }

  getIndicatorsByCategory(categoryId: string): Indicator[] {
    return this.repository.getIndicatorsByCategory(categoryId);
  }

  getGroupedReports(): GroupedReport[] {
    return this.repository.getGroupedReports();
  }
}
