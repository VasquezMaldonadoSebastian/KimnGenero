import type { GroupedReport, Indicator, IndicatorCategory } from "../../../shared/types/indicator-domain";

export interface IndicatorRepository {
  initialize(): Promise<void>;

  getIndicators(): Indicator[];
  getIndicator(id: string): Indicator | undefined;
  getCategories(): IndicatorCategory[];
  getIndicatorsByCategory(categoryId: string): Indicator[];
  getGroupedReports(): GroupedReport[];
}

