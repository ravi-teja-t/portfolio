import { connection } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  // node:sqlite is synchronous, so Next can't tell this handler reads a database
  // and would prerender it at build time. This defers it to request time.
  await connection();

  const { version } = getDb()
    .prepare("SELECT sqlite_version() AS version")
    .get() as { version: string };

  return Response.json({ status: "ok", sqlite: version });
}
