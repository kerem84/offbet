import type { Database } from "@/lib/supabase/database.types";

export type Bet = Database["public"]["Tables"]["bets"]["Row"] & {
  creator: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
  wagers: {
    id: string;
    user_id: string;
    side: boolean;
    amount: number;
  }[];
};

export type Wager = Database["public"]["Tables"]["wagers"]["Row"];
