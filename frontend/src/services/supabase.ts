import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://zxpccuvckqhxjtwelvik.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_gyDTUwRs-CoYD6sqmUB42A_DYKQhQK_";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export async function checkSupabaseConnection(): Promise<{
  connected: boolean;
  error?: string | null;
}> {
  try {
    const { error } = await supabase.from("_handover_healthcheck").select("*").limit(1);
    // If the table doesn't exist yet, it will return a specific PGRST204/PGRST200 or 42P01 error,
    // which confirms the HTTP connection and credentials are valid!
    if (
      error &&
      error.code !== "PGRST204" &&
      error.code !== "42P01" &&
      !error.message.includes("relation")
    ) {
      return { connected: false, error: error.message };
    }
    return { connected: true, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error connecting to Supabase";
    return { connected: false, error: message };
  }
}
