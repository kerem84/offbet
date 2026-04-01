"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "../types";

export function useProfile(userId: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    setProfile(data ?? null);
    setLoading(false);
  }, [userId]);

  const updateAvatar = useCallback(
    async (avatarUrl: string) => {
      const supabase = createClient();
      await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", userId);
      await refetch();
    },
    [userId, refetch]
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { profile, loading, updateAvatar };
}
