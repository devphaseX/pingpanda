import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { ulid } from "ulid";
import { users } from "./users";
import { DeliverStatus } from "../../constants/enums";
import { eventCategories } from "./event_categories";
import { Index } from "drizzle-orm/sqlite-core";
import { InferSelectModel, relations } from "drizzle-orm";

export const events = pgTable(
  "events",
  {
    id: varchar("id", { length: 50 })
      .primaryKey()
      .$defaultFn(() => ulid()),

    name: varchar("name", { length: 255 }).notNull(),
    fields: jsonb("fields").notNull(),
    formatted_message: text("formatted_message").notNull(),

    deliver_status: varchar("deliver_status", { length: 50 })
      .notNull()
      .$type<DeliverStatus>()
      .default(DeliverStatus.PENDING),

    user_id: varchar("user_id", { length: 50 })
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),

    event_category_id: varchar("event_category_id", { length: 50 }).references(
      () => eventCategories.id,
      {
        onDelete: "set null",
      },
    ),

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
  (t) => [index("created_index").on(t.created_at)],
);

export type Event = InferSelectModel<typeof events>;

export const eventRelations = relations(events, ({ one }) => ({
  user: one(users, {
    fields: [events.user_id],
    references: [users.id],
  }),
  eventCategory: one(eventCategories, {
    fields: [events.event_category_id],
    references: [eventCategories.id],
  }),
}));
