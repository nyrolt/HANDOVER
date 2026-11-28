import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

export const SUPABASE_URL = process.env.SUPABASE_URL || "https://zxpccuvckqhxjtwelvik.supabase.co";
export const SUPABASE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_gyDTUwRs-CoYD6sqmUB42A_DYKQhQK_";

export const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres.zxpccuvckqhxjtwelvik:Handover%40%231257@aws-0-ap-south-1.pooler.supabase.com:6543/postgres";

// 1. Supabase Client SDK
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Direct PostgreSQL Client (for server queries with SSL)
export const sql = postgres(DATABASE_URL, {
  ssl: "require",
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export default { supabase, sql };
