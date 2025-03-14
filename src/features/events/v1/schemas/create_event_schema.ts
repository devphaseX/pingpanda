import { events } from "@/server/__internals/db/schemas";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const createEventSchema = createInsertSchema(events, {
  fields: z.record(z.string().or(z.number()).or(z.boolean())).optional(),
})
  .pick({ fields: true })
  .extend({
    description: z.string().min(1).max(500),
    category_name: z.string().min(1).max(100),
  });

export type CreateEventData = z.infer<typeof createEventSchema>;
