import { Router } from "express";
import { z } from "zod";
import { AppError } from "../../../errors/AppError";
import { validateParams, validateQuery } from "../../../middleware/validate.middleware";
import type { IndicatorService } from "../../../services/indicatorService";

const idParamsSchema = z.object({ id: z.string().min(1) });
const categoryParamsSchema = z.object({
  categoryId: z.string().regex(/^[a-z0-9-]+$/, "Invalid categoryId"),
});

const indicatorsQuerySchema = z.object({
  area: z.string().min(1).optional(),
  dimension: z.string().min(1).optional(),
  limit: z.coerce.number().int().positive().max(1000).optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
});

export function createIndicatorRoutes(indicatorService: IndicatorService) {
  const router = Router();

  router.get("/indicadores", validateQuery(indicatorsQuerySchema), (req, res) => {
    const query = req.query as z.infer<typeof indicatorsQuerySchema>;
    const { limit, offset, ...filters } = query;

    const hasFilters = Boolean(filters.area || filters.dimension);
    const items = hasFilters ? indicatorService.queryIndicators(filters) : indicatorService.getIndicators();

    if (limit || offset) {
      const off = offset ?? 0;
      const lim = limit ?? items.length;
      res.setHeader("X-Total-Count", String(items.length));
      res.setHeader("X-Limit", String(lim));
      res.setHeader("X-Offset", String(off));
      return res.json(items.slice(off, off + lim));
    }

    return res.json(items);
  });

  router.get("/indicadores/:id", validateParams(idParamsSchema), (req, res) => {
    const { id } = req.params as z.infer<typeof idParamsSchema>;
    const indicator = indicatorService.getIndicator(id);

    if (!indicator) {
      throw new AppError("NOT_FOUND", "Indicator not found", 404);
    }

    res.json(indicator);
  });

  router.get("/categorias", (_req, res) => {
    res.json(indicatorService.getCategories());
  });

  router.get(
    "/categorias/:categoryId/indicadores",
    validateParams(categoryParamsSchema),
    (req, res) => {
      const { categoryId } = req.params as z.infer<typeof categoryParamsSchema>;
      res.json(indicatorService.getIndicatorsByCategory(categoryId));
    }
  );

  return router;
}
