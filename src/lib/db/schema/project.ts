import { createId } from "@paralleldrive/cuid2";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { users } from ".";
import { relations, sql } from "drizzle-orm";
import { folders } from "./folders";

export const projects = sqliteTable(
  "projects",
  {
    id: text("id")
      .$default(() => createId())
      .primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    isBlocked: integer("is_blocked", { mode: "boolean" }).default(false),
    isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    slug_userId_unq: unique().on(table.userId, table.slug),
  })
);

export const projectRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  folders: many(folders),
}));

export type Project = typeof projects.$inferSelect;
