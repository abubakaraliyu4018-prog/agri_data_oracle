import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = "https://vtfvexikkctdtpjcbbqy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0ZnZleGlra2N0ZHRwamNiYnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4OTM4NDEsImV4cCI6MjA5ODQ2OTg0MX0.8cZadKT1kSD2tXFKcMeG4tJgucQNyOdWqhPFTg7kHSg";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
