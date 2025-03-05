import {
  integer,
  pgTable,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { InferSelectModel, relations } from "drizzle-orm";
import { ulid } from "ulid";

export const eventCategories = pgTable(
  "event_categories",
  {
    id: varchar("id", { length: 50 })
      .primaryKey()
      .$defaultFn(() => ulid()),
    name: varchar("name", { length: 100 }).notNull(),
    colour: integer("colour").notNull(),
    emoji: varchar("emoji", { length: 50 }).notNull(),

    user_id: varchar("user_id", { length: 50 })
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),

    created_at: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    }).defaultNow(),
    updated_at: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [unique("user_event_unique").on(t.name, t.user_id)],
);

export const eventCategoryRelation = relations(eventCategories, ({ one }) => ({
  user: one(users, {
    fields: [eventCategories.user_id],
    references: [users.id],
  }),
}));

export type EventCategory = InferSelectModel<typeof eventCategories>;
