"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Reaction } from "../types";

export function useReactions(betId: string) {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReactions = useCallback(async () => {
    if (!betId) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("reactions")
      .select("*")
      .eq("bet_id", betId);

    setReactions(data ?? []);
    setLoading(false);
  }, [betId]);

  const toggleReaction = useCallback(
    async (emoji: string, userId: string) => {
      const supabase = createClient();
      const existing = reactions.find(
        (r) => r.emoji === emoji && r.user_id === userId
      );

      if (existing) {
        await supabase.from("reactions").delete().eq("id", existing.id);
      } else {
        await supabase
          .from("reactions")
          .insert({ bet_id: betId, user_id: userId, emoji });
      }
    },
    [betId, reactions]
  );

  useEffect(() => {
    fetchReactions();

    const supabase = createClient();

    const channel = supabase
      .channel(`reactions-${betId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reactions",
          filter: `bet_id=eq.${betId}`,
        },
        () => fetchReactions()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [betId, fetchReactions]);

  return { reactions, loading, toggleReaction };
}
