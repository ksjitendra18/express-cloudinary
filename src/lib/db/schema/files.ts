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
import { folders } from "./folders";

// for root files folderId is prefixed with root_oz:projectId

export const files = sqliteTable("files", {
  id: text("id")
    .$default(() => createId())
    .primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  size: integer("size").notNull(),
  mimeType: text("mime_type").notNull(),
  dimensions: text("dimensions"),
  isChild: integer("is_child", { mode: "boolean" }).default(false),
  folderId: text("folder_id").references(() => folders.id, {
    onDelete: "cascade",
  }),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
// export const files = sqliteTable("files", {
//   id: text("id")
//     .$default(() => createId())
//     .primaryKey(),
//   name: text("name").notNull(),
//   slug: text("slug").notNull(),
//   folderId: text("folder_id").references(() => folders.id, {
//     onDelete: "cascade",
//   }),

//   isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
//   createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
// });

export const filesRelations = relations(files, ({ one, many }) => ({
  folder: one(folders, {
    fields: [files.folderId],
    references: [folders.id],
  }),
}));

export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;
