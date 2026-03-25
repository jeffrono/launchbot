import { defineConfig } from "prisma/config";
import * as fs from "fs";

// Load env files locally (.env.local takes priority over .env)
for (const envFile of [".env.local", ".env"]) {
  if (fs.existsSync(envFile)) {
    const content = fs.readFileSync(envFile, "utf-8");
    for (const line of content.split("\n")) {
      const match = line.match(/^(\w+)="?([^"]*)"?$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2];
      }
    }
  }
}

// Prefer unpooled URL for schema push (needed for DDL), fall back to pooled
const rawUrl =
  process.env["DATABASE_URL_UNPOOLED"] ||
  process.env["POSTGRES_URL_NON_POOLING"] ||
  process.env["DATABASE_URL"] ||
  "";

// Strip channel_binding param which Prisma doesn't support
const url = rawUrl.replace(/[?&]channel_binding=[^&]*/g, "");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: { url },
});
