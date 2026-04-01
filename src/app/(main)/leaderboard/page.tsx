"use client";

import { useLeaderboard } from "@/features/leaderboard/hooks/use-leaderboard";
import { LeaderboardTable } from "@/features/leaderboard/components/leaderboard-table";

export default function LeaderboardPage() {
  const { entries, loading } = useLeaderboard();

  return (
    <div className="space-y-4">
      <h1 className="font-pixel text-lg text-arcade-yellow">HIGH SCORES</h1>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="font-pixel text-xs text-arcade-muted animate-pulse">
            YUKLENIYOR...
          </span>
        </div>
      ) : (
        <LeaderboardTable entries={entries} />
      )}
    </div>
  );
}
