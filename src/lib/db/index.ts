import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import dotnev from "dotenv";

dotnev.config();

// const databaseUrl = "libsql://ozservealpha-rs823.turso.io";
// const databaseToken =
//   "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MTExOTE4MTgsImlkIjoiZDAyMmRlM2QtYzE3YS00OGY5LTg5ODEtY2JhYzZjOTRiZjlhIn0.SYg_sZhPNiTyKZsP_2cXX5YLeTFGxvuzYhCFHHILma6yi9wgUqB71LZxze1XoVUqxEFfRkAc8uBj0dzEoavgBQ";

const databaseUrl = process.env.DATABASE_URL;
const databaseToken = process.env.DATABASE_AUTH_TOKEN;

console.log("database", databaseUrl);
if (!databaseUrl || !databaseToken) {
  throw new Error("Missing Database Credentials");
}

const client = createClient({
  url: databaseUrl,
  authToken: databaseToken,
});

export const db = drizzle(client, { schema, logger: false });
