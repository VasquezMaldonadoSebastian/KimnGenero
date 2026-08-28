import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";
import type { Indicator, IndicatorCategory } from "@shared/types/indicator-domain";
import { apiGetJson } from "../lib/apiClient";

interface IndicatorsContextType {
  indicators: Indicator[];
  categories: IndicatorCategory[];
  loading: boolean;
  error: string | null;
  selectedCategory: string | null;
  setSelectedCategory: (id: string | null) => void;
  getIndicatorById: (id: string) => Indicator | undefined;
  getIndicatorsByCategory: (categoryId: string) => Indicator[];
}

const IndicatorsContext = createContext<IndicatorsContextType | undefined>(undefined);

interface IndicatorsProviderProps {
  children: ReactNode;
}

export function IndicatorsProvider({ children }: IndicatorsProviderProps) {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [categories, setCategories] = useState<IndicatorCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [indicatorsData, categoriesData] = await Promise.all([
          apiGetJson<Indicator[]>("/api/indicadores"),
          apiGetJson<IndicatorCategory[]>("/api/categorias"),
        ]);

        setIndicators(indicatorsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Memoized helper functions to avoid recreating on every render
  const getIndicatorById = useCallback(
    (id: string): Indicator | undefined => indicators.find((ind) => ind.id === id),
    [indicators]
  );

  const getIndicatorsByCategory = useCallback(
    (categoryId: string): Indicator[] => {
      const category = categories.find((cat) => cat.id === categoryId);
      return category ? category.indicadores : [];
    },
    [categories]
  );

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      indicators,
      categories,
      loading,
      error,
      selectedCategory,
      setSelectedCategory,
      getIndicatorById,
      getIndicatorsByCategory,
    }),
    [
      indicators,
      categories,
      loading,
      error,
      selectedCategory,
      getIndicatorById,
      getIndicatorsByCategory,
    ]
  );

  return (
    <IndicatorsContext.Provider value={contextValue}>{children}</IndicatorsContext.Provider>
  );
}

export function useIndicatorsContext() {
  const context = useContext(IndicatorsContext);
  if (!context) {
    throw new Error("useIndicatorsContext must be used within IndicatorsProvider");
  }
  return context;
}
