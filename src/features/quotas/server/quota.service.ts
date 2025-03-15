import { quotas } from "@/server/__internals/db/schemas";
import { db } from "@/server/__internals/db/setup";
import { getMonth } from "date-fns";
import { and, eq, sql } from "drizzle-orm";

export const getCurrentQuota = async (userId: string) => {
  const now = new Date();
  const currentMonth = getMonth(now) + 1;
  const currentYear = now.getFullYear();

  const [quota] = await db
    .select()
    .from(quotas)
    .where(
      and(
        eq(quotas.user_id, userId),
        eq(quotas.month, currentMonth),
        eq(quotas.year, currentYear),
      ),
    )
    .limit(1);

  return quota;
};

export const upsertQuota = async (userId: string) => {
  const now = new Date();
  const currentMonth = getMonth(now) + 1;
  const currentYear = now.getFullYear();

  const [quota] = await db
    .insert(quotas)
    .values({
      user_id: userId,
      month: currentMonth,
      year: currentYear,
      count: 1,
    })
    .onConflictDoUpdate({
      target: [quotas.user_id, quotas.month, quotas.year],
      set: {
        count: sql<number>`${quotas.count} + 1`,
      },
    })
    .returning();

  return quota;
};
