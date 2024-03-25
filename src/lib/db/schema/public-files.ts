import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const publicFiles = sqliteTable("public_files", {
  id: text("id")
    .$default(() => createId())
    .primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
