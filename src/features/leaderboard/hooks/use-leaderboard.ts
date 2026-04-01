"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { LeaderboardEntry } from "../types";

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("id, username, avatar_url, points, total_wins, total_losses")
      .order("points", { ascending: false });

    const mapped: LeaderboardEntry[] = (data ?? []).map((profile, index) => ({
      ...profile,
      rank: index + 1,
    }));

    setEntries(mapped);
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();

    const supabase = createClient();

    const channel = supabase
      .channel("leaderboard-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => refetch()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return { entries, loading, refetch };
}
