import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculatePayout } from "@/features/bets/utils";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // Parse request body
  const { betId, resolution } = (await req.json()) as {
    betId: string;
    resolution: boolean;
  };

  // Verify caller is admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (callerProfile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Fetch all wagers for this bet
  const { data: wagers } = await supabase
    .from("wagers")
    .select("id, user_id, side, amount")
    .eq("bet_id", betId);

  // No wagers — just mark bet as resolved and return
  if (!wagers || wagers.length === 0) {
    await supabase
      .from("bets")
      .update({
        status: "resolved",
        resolution,
        resolved_by: user.id,
      })
      .eq("id", betId);

    return NextResponse.json({ success: true });
  }

  // Calculate payouts
  const payouts = calculatePayout(wagers, resolution);

  // Process each wager: update payout, update profile stats, insert notification
  for (const wager of wagers) {
    const payout = payouts.get(wager.user_id) ?? 0;
    const won = wager.side === resolution;

    // Update wager payout
    await supabase
      .from("wagers")
      .update({ payout })
      .eq("id", wager.id);

    // Fetch current profile stats
    const { data: profile } = await supabase
      .from("profiles")
      .select("points, total_wins, total_losses")
      .eq("id", wager.user_id)
      .single();

    if (profile) {
      await supabase
        .from("profiles")
        .update({
          points: profile.points + payout,
          total_wins: won ? profile.total_wins + 1 : profile.total_wins,
          total_losses: won ? profile.total_losses : profile.total_losses + 1,
        })
        .eq("id", wager.user_id);
    }

    // Insert notification
    const title = won ? "KAZANDIN!" : "KAYBETTIN!";
    const message = won
      ? `Bahsi kazandin! ${payout} puan hesabina eklendi.`
      : `Bahsi kaybettin. ${wager.amount} puan gitti.`;

    await supabase.from("notifications").insert({
      user_id: wager.user_id,
      type: "bet_resolved",
      title,
      message,
      bet_id: betId,
      read: false,
    });
  }

  // Mark bet as resolved
  await supabase
    .from("bets")
    .update({
      status: "resolved",
      resolution,
      resolved_by: user.id,
    })
    .eq("id", betId);

  // Check and award badges for all affected users
  const userIds = [...new Set(wagers.map((w) => w.user_id))];
  for (const uid of userIds) {
    await supabase.rpc("check_and_award_badges", { p_user_id: uid });
  }

  return NextResponse.json({ success: true });
}
