import tryit from "@/lib/tryit";
import {
  eventCategories,
  EventCategory,
  events,
} from "@/server/__internals/db/schemas";
import { db } from "@/server/__internals/db/setup";
import {
  and,
  count,
  eq,
  gte,
  inArray,
  isNotNull,
  lte,
  max,
  sql,
} from "drizzle-orm";

export type CreateEventCategoryData = Pick<
  EventCategory,
  "name" | "colour" | "user_id" | "emoji"
>;

export const createEventCategory = async (data: CreateEventCategoryData) => {
  const [eventCategory] = await db
    .insert(eventCategories)
    .values(data)
    .returning();

  return eventCategory;
};

export const bulkCreateEventCategory = async (
  data: CreateEventCategoryData[],
) => {
  const categories = await db.insert(eventCategories).values(data).returning();
  return categories;
};

export const getEventCategories = (userID: string) => {
  return db.query.eventCategories.findMany({
    where: (eventCategories, { eq }) => eq(eventCategories.user_id, userID),
    orderBy: (eventCategories, { desc }) => desc(eventCategories.updated_at),
  });
};

type GetCategoriesWithEventCountsFilter = {
  startDate?: Date;
  endDate?: Date;
};

export const getCategoriesWithEventCounts = (
  categoryIds: string[],
  filter: GetCategoriesWithEventCountsFilter,
) => {
  const { startDate, endDate } = filter;

  const unqiueFields = db.$with("fields").as(
    db
      .selectDistinctOn([events.fields], {
        id: events.id,
        event_category_id: events.event_category_id,
        fields: events.fields,
        created_at: events.created_at,
      })
      .from(events)
      .where(
        and(
          startDate ? gte(events.created_at, startDate) : sql<boolean>`true`,
          endDate ? lte(events.created_at, endDate) : sql<boolean>`true`,
          isNotNull(events.fields), // Add this condition to filter out null fields.
        ),
      ),
  );

  return db
    .with(unqiueFields)
    .select({
      id: eventCategories.id,
      name: eventCategories.name,
      colour: eventCategories.colour,
      emoji: eventCategories.emoji,
      created_at: eventCategories.created_at,
      event_count: count(unqiueFields.id).as("event_count"),
      last_event_created_at: max(unqiueFields.created_at).as(
        "last_event_created_at",
      ),
      fields: sql<
        Record<string, unknown>[]
      >`COALESCE(json_agg(${unqiueFields.fields}) FILTER (WHERE ${unqiueFields.fields} IS NOT NULL), '[]')`.as(
        "fields",
      ),
    })
    .from(eventCategories)
    .leftJoin(
      unqiueFields,
      eq(eventCategories.id, unqiueFields.event_category_id),
    )
    .where(and(inArray(eventCategories.id, categoryIds)))
    .groupBy(eventCategories.id);
};

export const deleteEventCategory = async (
  categoryName: string,
  userId: string,
): Promise<EventCategory> => {
  const [deletedCategory] = await db
    .delete(eventCategories)
    .where(
      and(
        eq(eventCategories.name, categoryName),
        eq(eventCategories.user_id, userId),
      ),
    )
    .returning();

  return deletedCategory;
};
