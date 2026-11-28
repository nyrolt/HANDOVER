import fs from "fs";
import path from "path";
import postgres from "postgres";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const directUrl =
    process.env.DIRECT_URL ||
    "postgresql://postgres.zxpccuvckqhxjtwelvik:Handover%40%231257@aws-0-ap-south-1.pooler.supabase.com:5432/postgres";

  console.log("Connecting to Supabase PostgreSQL to run Handover schema migration...");
  const sql = postgres(directUrl, { ssl: "require", connect_timeout: 15 });

  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
    console.log("Executing schema.sql on Supabase...");
    await sql.unsafe(schemaSql);
    console.log("SUCCESS: All Handover tables created in Supabase!");

    // Verify created tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    console.log(
      "Tables in Supabase public schema:",
      tables.map((t) => t.table_name),
    );

    await sql.end();
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    await sql.end();
    process.exit(1);
  }
}

migrate();
