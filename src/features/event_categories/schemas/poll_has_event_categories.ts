import { z } from "zod";

export const pollHasEventCategoriesSchema = z.object({
  category_name: z.string().min(2).max(50),
});

export type PollHasEventCategories = z.infer<
  typeof pollHasEventCategoriesSchema
>;
