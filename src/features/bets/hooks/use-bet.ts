"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Bet } from "../types";

export function useBet(id: string) {
  const [bet, setBet] = useState<Bet | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!id) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("bets")
      .select("*, creator:profiles!creator_id(id, username, avatar_url), wagers(id, user_id, side, amount)")
      .eq("id", id)
      .single();

    setBet((data as Bet) ?? null);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    refetch();

    const supabase = createClient();

    const betChannel = supabase
      .channel(`bet-${id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bets", filter: `id=eq.${id}` },
        () => refetch()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wagers", filter: `bet_id=eq.${id}` },
        () => refetch()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(betChannel);
    };
  }, [id, refetch]);

  return { bet, loading, refetch };
}
