import { TimeRange } from "@/server/__internals/constants/enums";
import { paginateQuerySchema } from "@/server/__internals/lib/paginate";
import { z } from "zod";

export const getEventsByCategoryNameSchema = z.object({
  categoryName: z.string().min(1).max(100),
});

export const getEventsByCategoryNameQuerySchema = paginateQuerySchema.extend({
  period: z.nativeEnum(TimeRange).default(TimeRange.WEEK),
  category_name: z.string().min(1).max(100),
});

export type GetEventsByCategoryNameQuery = z.infer<
  typeof getEventsByCategoryNameQuerySchema
>;
