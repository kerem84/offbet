"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { UserBadge } from "../types";

export function useBadges(userId: string) {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const supabase = createClient();

    supabase
      .from("user_badges")
      .select("*, badge:badges(*)")
      .eq("user_id", userId)
      .order("earned_at", { ascending: false })
      .then(({ data }) => {
        setBadges((data as UserBadge[]) ?? []);
        setLoading(false);
      });
  }, [userId]);

  return { badges, loading };
}
