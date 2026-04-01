import type { Database } from "@/lib/supabase/database.types";

export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
