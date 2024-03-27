import { createId } from "@paralleldrive/cuid2";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { users } from ".";
import { relations, sql } from "drizzle-orm";
import { folders } from "./folders";
import { apiKeys } from "./api-keys";

export const plans = sqliteTable("plans", {
  id: text("id")
    .$default(() => createId())
    .primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  pricePerMonth: integer("price_month").notNull(),
  pricePerYear: integer("price_year").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// export const plansRelations = relations(plans, ({ one, many }) => ({}));

export type Plans = typeof plans.$inferSelect;
