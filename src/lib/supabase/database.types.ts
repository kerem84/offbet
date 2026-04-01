export type BetStatus = "draft" | "pending" | "active" | "resolved" | "cancelled";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          points: number;
          total_wins: number;
          total_losses: number;
          role: "user" | "admin";
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          points?: number;
          total_wins?: number;
          total_losses?: number;
          role?: "user" | "admin";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      bets: {
        Row: {
          id: string;
          creator_id: string;
          title: string;
          description: string | null;
          category: string;
          status: BetStatus;
          resolution: boolean | null;
          resolved_by: string | null;
          min_wager: number;
          max_wager: number;
          deadline: string;
          resolve_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          title: string;
          description?: string | null;
          category: string;
          status?: BetStatus;
          resolution?: boolean | null;
          resolved_by?: string | null;
          min_wager?: number;
          max_wager?: number;
          deadline: string;
          resolve_date?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["bets"]["Insert"]>;
      };
      wagers: {
        Row: {
          id: string;
          bet_id: string;
          user_id: string;
          side: boolean;
          amount: number;
          payout: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          bet_id: string;
          user_id: string;
          side: boolean;
          amount: number;
          payout?: number | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["wagers"]["Insert"]>;
      };
      reactions: {
        Row: {
          id: string;
          bet_id: string;
          user_id: string;
          emoji: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          bet_id: string;
          user_id: string;
          emoji: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reactions"]["Insert"]>;
      };
      comments: {
        Row: {
          id: string;
          bet_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          bet_id: string;
          user_id: string;
          content: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["comments"]["Insert"]>;
      };
      badges: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          condition_type: string;
          condition_value: number;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon: string;
          condition_type: string;
          condition_value: number;
        };
        Update: Partial<Database["public"]["Tables"]["badges"]["Insert"]>;
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          earned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
          earned_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_badges"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          bet_id: string | null;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          bet_id?: string | null;
          read?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
    };
  };
};
