"use client";

import { useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers";
import { sounds } from "@/lib/sounds";

export function useWager() {
  const { profile, refreshProfile } = useAuth();

  const placeWager = useCallback(
    async (betId: string, side: boolean, amount: number): Promise<boolean> => {
      if (!profile) return false;
      if (profile.points < amount) return false;

      const supabase = createClient();

      const { error: wagerError } = await supabase.from("wagers").insert({
        bet_id: betId,
        user_id: profile.id,
        side,
        amount,
      });

      if (wagerError) {
        // Handle duplicate wager (unique constraint violation)
        if (wagerError.code === "23505") {
          return false;
        }
        return false;
      }

      const { error: pointsError } = await supabase
        .from("profiles")
        .update({ points: profile.points - amount })
        .eq("id", profile.id);

      if (pointsError) return false;

      // Check High Roller badge
      await supabase.rpc("check_high_roller", {
        p_user_id: profile.id,
        p_amount: amount,
      });

      await refreshProfile();
      sounds.play("coin");
      return true;
    },
    [profile, refreshProfile]
  );

  return { placeWager };
}
