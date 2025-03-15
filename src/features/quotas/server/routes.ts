import { requiredAuth } from "@/server/__internals/middleware/required_auth";
import { AppEnv } from "@/server/__internals/types";
import { Hono } from "hono";
import { getCurrentQuota } from "./quota.service";
import {
  getCategoriesWithEventCounts,
  getEventCategoryCounts,
} from "@/features/event_categories/server/event_categories.service";
import { PlanQuota } from "@/server/__internals/constants/enums";
import { addMonths, endOfMonth } from "date-fns";
import { successResponse } from "@/utils/response";

const app = new Hono<AppEnv>().use(requiredAuth).get("/usage", async (c) => {
  const user = c.get("user");

  const [usage, categoryCount] = await Promise.all([
    getCurrentQuota(user.id),
    getEventCategoryCounts(user.id),
  ]);

  const limits = PlanQuota[user.plan] ?? PlanQuota.FREE;

  const resetDate = endOfMonth(new Date());

  return successResponse(c, {
    data: {
      categories_used: categoryCount,
      categories_limit: limits.maxEventCategories,
      events_used: usage.count,
      events_limit: limits.maxEventsPerMonth,
      reset_date: resetDate,
    },
  });
});

export default app;
