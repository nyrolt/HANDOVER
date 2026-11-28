import { sql } from "../db/supabase.js";

async function main() {
  console.log("Testing live connection to Supabase PostgreSQL...");
  try {
    const res = await sql`SELECT NOW() as current_time, current_database() as db;`;
    console.log("SUCCESS: Handover is successfully connected to Supabase PostgreSQL!", res);
    await sql.end();
    process.exit(0);
  } catch (err) {
    console.error("FAILED to connect to Supabase:", err);
    await sql.end();
    process.exit(1);
  }
}

main();
