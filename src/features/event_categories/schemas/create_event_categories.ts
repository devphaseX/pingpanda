import { eventCategories } from "@/server/__internals/db/schemas";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

const createEventCategoriesSchema = createInsertSchema(eventCategories, {
  name: z.string().min(2).max(100),
});

export default createEventCategoriesSchema;
