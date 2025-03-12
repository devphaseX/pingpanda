import { eventCategories, users } from "@/server/__internals/db/schemas";
import { db } from "@/server/__internals/db/setup";
import { and, eq, ilike } from "drizzle-orm";
import "server-only";

export async function getEventCategoryByName(name: string, userId: string) {
  const [category] = await db
    .select()
    .from(eventCategories)
    .where(
      and(
        ilike(eventCategories.name, name),
        eq(eventCategories.user_id, userId),
      ),
    );

  return category ?? null;
}
