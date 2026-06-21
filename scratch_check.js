import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jnpxrecnusdopbeidfec.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpucHhyZWNudXNkb3BiZWlkZmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTU2MzYsImV4cCI6MjA5MzAzMTYzNn0.EX39L5t9vwvrVCJ_PyPreN0IEdyv0fbChHADLW-PGro";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  try {
    const { data, error } = await supabase.from("certificates").select("*").limit(1);
    if (error) {
      console.log("RESULT: Error querying certificates:", error.message);
    } else {
      console.log("RESULT: Success! Certificates table exists. Data:", data);
    }
  } catch (e) {
    console.log("RESULT: Exception thrown:", e.message);
  }
}

check();
