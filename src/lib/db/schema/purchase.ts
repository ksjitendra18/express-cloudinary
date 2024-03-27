import { relations, sql } from "drizzle-orm";
import { sqliteTable, index, text, uniqueIndex } from "drizzle-orm/sqlite-core";

import { createId } from "@paralleldrive/cuid2";
import { plans, users } from ".";

export const purchase = sqliteTable("purchase", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  planId: text("plan_id")
    .references(() => plans.id)
    .notNull(),
  razorpayOrderId: text("razorpay_order_id").notNull(),
  razorpayPaymentId: text("razorpay_payment_id").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const purchaseRelations = relations(purchase, ({ many, one }) => ({
  user: one(users, {
    fields: [purchase.userId],
    references: [users.id],
  }),
  plan: one(plans, {
    fields: [purchase.planId],
    references: [plans.id],
  }),
}));

export type Purchase = typeof purchase.$inferSelect; // return type when queried
export type NewPurchase = typeof purchase.$inferInsert;
