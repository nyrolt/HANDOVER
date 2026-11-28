import fs from "fs";
import path from "path";
import postgres from "postgres";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigrations() {
  const directUrl =
    process.env.DIRECT_URL ||
    "postgresql://postgres.zxpccuvckqhxjtwelvik:Handover%40%231257@aws-0-ap-south-1.pooler.supabase.com:5432/postgres";

  console.log("Connecting to Supabase PostgreSQL to run migrations...");
  const sql = postgres(directUrl, { ssl: "require", connect_timeout: 15 });

  try {
    const migration0002 = fs.readFileSync(
      path.join(__dirname, "migrations", "0002_submissions_verification_reconciliation.sql"),
      "utf-8"
    );
    console.log("Executing migration 0002_submissions_verification_reconciliation.sql...");
    await sql.unsafe(migration0002);
    console.log("SUCCESS: Migration 0002 executed successfully on Supabase!");

    // List all public tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    console.log("All tables in Supabase public schema:", tables.map((t) => t.table_name));

    await sql.end();
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    await sql.end();
    process.exit(1);
  }
}

runMigrations();
