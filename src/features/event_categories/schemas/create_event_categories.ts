import { eventCategories } from "@/server/__internals/db/schemas";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

const createEventCategorySchema = createInsertSchema(eventCategories, {
  name: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Name must contain only letters hyphens and numbers",
    }),

  colour: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
    message: "Colour must be a valid hex code",
  }),

  emoji: z.string().emoji().optional(),
}).pick({
  name: true,
  colour: true,
  emoji: true,
});

export default createEventCategorySchema;

export type CreateEventCategoryInput = z.infer<
  typeof createEventCategorySchema
>;
