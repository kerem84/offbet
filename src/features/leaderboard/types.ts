export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar_url: string | null;
  points: number;
  total_wins: number;
  total_losses: number;
  rank: number;
}
