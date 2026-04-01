import type { Database } from "@/lib/supabase/database.types";

export type Reaction = Database["public"]["Tables"]["reactions"]["Row"];

export type Comment = Database["public"]["Tables"]["comments"]["Row"] & {
  user: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
};
