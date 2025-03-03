import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { ulid } from "ulid";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const quotas = pgTable("quotas", {
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
});

export const quotaRelations = relations(quotas, ({ one }) => ({
  user: one(users, {
    fields: [quotas.user_id],
    references: [users.id],
  }),
}));
