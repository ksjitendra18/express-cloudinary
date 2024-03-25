import { createId } from "@paralleldrive/cuid2";
import {
  AnySQLiteColumn,
  integer,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";
import { users, projects } from ".";
import { relations, sql } from "drizzle-orm";
import { files } from "./files";

export const folders = sqliteTable(
  "folders",
  {
    id: text("id")
      .$default(() => createId())
      .primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    parentFolderId: text("parent_folder_id").references(
      (): AnySQLiteColumn => folders.id
    ),
    projectId: text("project_id").references(() => projects.id, {
      onDelete: "cascade",
    }),
    isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    parent_folder_id_slug_projectId_unq: unique().on(
      table.parentFolderId,
      table.slug,
      table.projectId
    ),
  })
);

export const folderRelations = relations(folders, ({ one, many }) => ({
  project: one(projects, {
    fields: [folders.projectId],
    references: [projects.id],
  }),
  files: many(files),
}));

export type Folder = typeof folders.$inferSelect;
