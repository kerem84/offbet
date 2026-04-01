import type { Database } from "@/lib/supabase/database.types";

export type Badge = Database["public"]["Tables"]["badges"]["Row"];
export type UserBadge = Database["public"]["Tables"]["user_badges"]["Row"] & {
  badge: Badge;
};
