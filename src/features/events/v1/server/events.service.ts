import {
  Event,
  eventCategories,
  events,
} from "@/server/__internals/db/schemas";
import { db } from "@/server/__internals/db/setup";
import {
  PaginateQuery,
  withPagination,
} from "@/server/__internals/lib/paginate";
import { and, eq, getTableColumns, ilike, sql, SQL } from "drizzle-orm";
import { Context } from "hono";
import { GetEventsByCategoryNameQuery } from "../schemas/get_events_by_category_name_schema";
import { TimeRange } from "@/server/__internals/constants/enums";
import { PgDialect } from "drizzle-orm/pg-core";

export type CreateEventPayload = Pick<
  Event,
  "name" | "formatted_message" | "fields" | "user_id" | "event_category_id"
>;

export const createEvent = async (payload: CreateEventPayload) => {
  const [event] = await db.insert(events).values(payload).returning();

  return event;
};

export const updateEvent = async (id: string, payload: Partial<Event>) => {
  const [event] = await db
    .update(events)
    .set(payload)
    .where(eq(events.id, id))
    .returning();

  return event;
};

export const getEventByCategoryName = async (
  categoryName: string,
  userId: string,
  query: Omit<GetEventsByCategoryNameQuery, "category_name">,
  url: string,
) => {
  const conds: SQL[] = [
    and(
      eq(eventCategories.user_id, userId),
      ilike(eventCategories.name, categoryName),
    )!,
  ];

  switch (query.period) {
    case TimeRange.TODAY:
      conds.push(
        sql`${events.created_at} BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '1 day' - INTERVAL '1 millisecond'`,
      );
      break;
    case TimeRange.WEEK:
      conds.push(
        sql`${events.created_at} BETWEEN date_trunc('week', CURRENT_DATE) AND date_trunc('week', CURRENT_DATE) + INTERVAL '6 days 23 hours 59 minutes 59 seconds'`,
      );
      break;
    case TimeRange.MONTH:
      conds.push(
        sql`${events.created_at} BETWEEN date_trunc('month', CURRENT_DATE) AND date_trunc('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 millisecond'`,
      );
      break;

    default:
      console.warn("Invalid TimeRange specified.  Returning all events.");
      break;
  }

  return withPagination(
    db
      .select(getTableColumns(events))
      .from(events)
      .innerJoin(
        eventCategories,
        eq(eventCategories.id, events.event_category_id),
      )
      .where(sql.join(conds, sql` and `))
      .$dynamic(),

    { page: query.page, perPage: query.perPage },
    url,
  );
};
