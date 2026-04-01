export type BetStatus = "draft" | "pending" | "active" | "resolved" | "cancelled";

type ProfileInsert = {
  id: string;
  username: string;
  avatar_url?: string | null;
  points?: number;
  total_wins?: number;
  total_losses?: number;
  role?: "user" | "admin";
  created_at?: string;
};

type BetInsert = {
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

type WagerInsert = {
  id?: string;
  bet_id: string;
  user_id: string;
  side: boolean;
  amount: number;
  payout?: number | null;
  created_at?: string;
};

type ReactionInsert = {
  id?: string;
  bet_id: string;
  user_id: string;
  emoji: string;
  created_at?: string;
};

type CommentInsert = {
  id?: string;
  bet_id: string;
  user_id: string;
  content: string;
  created_at?: string;
};

type BadgeInsert = {
  id?: string;
  name: string;
  description: string;
  icon: string;
  condition_type: string;
  condition_value: number;
};

type UserBadgeInsert = {
  id?: string;
  user_id: string;
  badge_id: string;
  earned_at?: string;
};

type NotificationInsert = {
  id?: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  bet_id?: string | null;
  read?: boolean;
  created_at?: string;
};

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
        Insert: ProfileInsert;
        Update: Partial<ProfileInsert>;
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
        Insert: BetInsert;
        Update: Partial<BetInsert>;
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
        Insert: WagerInsert;
        Update: Partial<WagerInsert>;
      };
      reactions: {
        Row: {
          id: string;
          bet_id: string;
          user_id: string;
          emoji: string;
          created_at: string;
        };
        Insert: ReactionInsert;
        Update: Partial<ReactionInsert>;
      };
      comments: {
        Row: {
          id: string;
          bet_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: CommentInsert;
        Update: Partial<CommentInsert>;
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
        Insert: BadgeInsert;
        Update: Partial<BadgeInsert>;
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          earned_at: string;
        };
        Insert: UserBadgeInsert;
        Update: Partial<UserBadgeInsert>;
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
        Insert: NotificationInsert;
        Update: Partial<NotificationInsert>;
      };
    };
  };
};
