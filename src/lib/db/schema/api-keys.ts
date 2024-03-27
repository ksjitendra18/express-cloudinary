import { createId } from "@paralleldrive/cuid2";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { folders } from "./folders";
import { projects } from "./project";

export const apiKeys = sqliteTable("api_key", {
  id: text("id")
    .$default(() => createId())
    .primaryKey(),
  name: text("name").notNull(),
  key: text("key").notNull().unique(),
  projectId: text("project_id").references(() => projects.id, {
    onDelete: "cascade",
  }),
  readAccess: integer("read_access", { mode: "boolean" }).default(true),
  writeAccess: integer("write_access", { mode: "boolean" }).default(false),
  isBlocked: integer("is_blocked", { mode: "boolean" }).default(false),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const apiKeysrelations = relations(apiKeys, ({ one, many }) => ({
  project: one(projects, {
    fields: [apiKeys.projectId],
    references: [projects.id],
  }),
}));

export type ApiKeys = typeof apiKeys.$inferSelect;
