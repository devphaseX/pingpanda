import { InferSelectModel, relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  timestamp,
  unique,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { Plan } from "../../constants/enums";
import { quotas } from "./quotas";
import { eventCategories } from "./event_categories";

export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 50 }).primaryKey(),
    external_id: varchar("external_id", { length: 50 }).notNull(),
    quota_limit: integer("quota_limit").notNull(),
    plan: varchar("plan", { length: 50 })
      .notNull()
      .$type<Plan>()
      .default(Plan.FREE),

    email: varchar("email", { length: 255 }).unique().notNull(),
    apiKey: varchar("api_key", { length: 255 }).unique(),
    discord_id: varchar("discord_id", { length: 50 }),
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
  (t) => [index("user_email_index"), index("user_api_key_index")],
);

export type User = InferSelectModel<typeof users>;

export const usersRelations = relations(users, ({ many }) => ({
  quota: many(quotas),
  event_category: many(eventCategories),
}));
