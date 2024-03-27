import { createId } from "@paralleldrive/cuid2";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { projects, users } from ".";
import { relations, sql } from "drizzle-orm";
import { folders } from "./folders";
import { apiKeys } from "./api-keys";

export const allowedFiles = sqliteTable("allowed_files", {
  id: text("id")
    .$default(() => createId())
    .primaryKey(),
  image: integer("image", { mode: "boolean" }).notNull().default(true),
  video: integer("video", { mode: "boolean" }).notNull().default(false),
  audio: integer("audio", { mode: "boolean" }).notNull().default(false),
  pdf: integer("pdf", { mode: "boolean" }).notNull().default(false),
  apps: integer("apps", { mode: "boolean" }).notNull().default(false),
  projectsId: text("projects_id").references(() => projects.id, {
    onDelete: "cascade",
  }),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const allowedFilesRelations = relations(
  allowedFiles,
  ({ one, many }) => ({
    project: one(projects, {
      fields: [allowedFiles.projectsId],
      references: [projects.id],
    }),
  })
);

export type AllowedFiles = typeof allowedFiles.$inferSelect;
