"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Comment } from "../types";

export function useComments(betId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    if (!betId) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("comments")
      .select("*, user:profiles!user_id(id, username, avatar_url)")
      .eq("bet_id", betId)
      .order("created_at", { ascending: true });

    setComments((data as Comment[]) ?? []);
    setLoading(false);
  }, [betId]);

  const addComment = useCallback(
    async (userId: string, content: string) => {
      const supabase = createClient();
      await supabase.from("comments").insert({
        bet_id: betId,
        user_id: userId,
        content: content.trim(),
      });
    },
    [betId]
  );

  const deleteComment = useCallback(async (commentId: string) => {
    const supabase = createClient();
    await supabase.from("comments").delete().eq("id", commentId);
  }, []);

  useEffect(() => {
    fetchComments();

    const supabase = createClient();

    const channel = supabase
      .channel(`comments-${betId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `bet_id=eq.${betId}`,
        },
        () => fetchComments()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [betId, fetchComments]);

  return { comments, loading, addComment, deleteComment };
}
