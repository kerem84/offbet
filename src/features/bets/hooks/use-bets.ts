"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Bet } from "../types";
import type { BetStatus } from "@/lib/supabase/database.types";

export function useBets(status: BetStatus = "active") {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("bets")
      .select("*, creator:profiles!creator_id(id, username, avatar_url), wagers(id, user_id, side, amount)")
      .eq("status", status)
      .order("created_at", { ascending: false });

    setBets((data as Bet[]) ?? []);
    setLoading(false);
  }, [status]);

  useEffect(() => {
    refetch();

    const supabase = createClient();

    const betsChannel = supabase
      .channel(`bets-${status}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bets" },
        () => refetch()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wagers" },
        () => refetch()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(betsChannel);
    };
  }, [refetch]);

  return { bets, loading, refetch };
}
