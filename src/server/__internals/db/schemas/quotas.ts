import {
  integer,
  pgTable,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { ulid } from "ulid";
import { users } from "./users";
import { InferSelectModel, relations } from "drizzle-orm";

export const quotas = pgTable(
  "quotas",
  {
    id: varchar("id", { length: 50 })
      .primaryKey()
      .$defaultFn(() => ulid()),

    year: integer("year").notNull(),
    month: integer("month").notNull(),
    count: integer("count").notNull().default(0),

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
  (t) => [unique("per_month_quota_unique").on(t.user_id, t.month, t.year)],
);

export type Quota = InferSelectModel<typeof quotas>;

export const quotaRelations = relations(quotas, ({ one }) => ({
  user: one(users, {
    fields: [quotas.user_id],
    references: [users.id],
  }),
}));
