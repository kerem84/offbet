"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers";
import { useBets } from "@/features/bets/hooks/use-bets";
import { PixelButton } from "@/components/ui/pixel-button";
import { PixelCard } from "@/components/ui/pixel-card";
import { CoinCounter } from "@/components/ui/coin-counter";
import { calculateOdds } from "@/features/bets/utils";
import { STARTING_POINTS } from "@/lib/constants";

interface UserRow {
  id: string;
  username: string;
  points: number;
  total_wins: number;
  total_losses: number;
  role: string;
  created_at: string;
}

function useUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("id, username, points, total_wins, total_losses, role, created_at")
      .order("created_at", { ascending: true });
    setUsers((data as UserRow[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, refetch: fetchUsers };
}

export default function AdminPage() {
  const { profile, loading: authLoading } = useAuth();
  const { bets: pendingBets, loading: pendingLoading, refetch: refetchPending } = useBets("pending");
  const { bets: activeBets, loading: activeLoading, refetch: refetchActive } = useBets("active");
  const { users, loading: usersLoading, refetch: refetchUsers } = useUsers();
  const [resolving, setResolving] = useState<string | null>(null);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="font-pixel text-xs text-arcade-muted animate-pulse">YUKLENIYOR...</span>
      </div>
    );
  }

  if (profile?.role !== "admin") {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="font-pixel text-lg text-arcade-red tracking-widest">
          ERISIM ENGELLENDI
        </span>
      </div>
    );
  }

  async function handleApprove(betId: string) {
    setResolving(betId);
    const supabase = createClient();
    await supabase.from("bets").update({ status: "active" }).eq("id", betId);

    // Check Troll badge for the bet creator
    const { data: bet } = await supabase
      .from("bets")
      .select("creator_id")
      .eq("id", betId)
      .single();

    if (bet?.creator_id) {
      const { error: badgeError } = await supabase.rpc("check_and_award_badges", { p_user_id: bet.creator_id });
      if (badgeError) console.error("Badge check failed:", badgeError);
    }

    await refetchPending();
    setResolving(null);
  }

  async function handleReject(betId: string) {
    setResolving(betId);
    const supabase = createClient();
    await supabase.from("bets").update({ status: "cancelled" }).eq("id", betId);
    await refetchPending();
    setResolving(null);
  }

  async function handleResolve(betId: string, resolution: boolean) {
    setResolving(betId);
    await fetch("/api/resolve-bet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ betId, resolution }),
    });
    await refetchActive();
    setResolving(null);
  }

  async function toggleAdmin(userId: string, currentRole: string) {
    setUpdatingUser(userId);
    const supabase = createClient();
    const newRole = currentRole === "admin" ? "user" : "admin";
    await supabase.from("profiles").update({ role: newRole }).eq("id", userId);
    await refetchUsers();
    setUpdatingUser(null);
  }

  async function resetPoints(userId: string) {
    setUpdatingUser(userId);
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ points: STARTING_POINTS, total_wins: 0, total_losses: 0 })
      .eq("id", userId);
    await refetchUsers();
    setUpdatingUser(null);
  }

  async function addPoints(userId: string, amount: number) {
    setUpdatingUser(userId);
    const supabase = createClient();
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ points: user.points + amount })
      .eq("id", userId);
    await refetchUsers();
    setUpdatingUser(null);
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center gap-3 border-b-2 border-arcade-border pb-4">
        <h1 className="font-pixel text-lg text-arcade-yellow tracking-widest">ADMIN PANELI</h1>
        <span className="font-pixel text-[10px] text-arcade-muted border border-arcade-border px-2 py-0.5">
          {profile.username}
        </span>
      </div>

      {/* Section 1 — Pending Bets */}
      <section className="space-y-4">
        <h2 className="font-pixel text-sm text-arcade-muted tracking-widest">
          ONAY BEKLEYEN BAHISLER
          <span className="ml-2 text-arcade-yellow">({pendingBets.length})</span>
        </h2>

        {pendingLoading ? (
          <span className="font-pixel text-[10px] text-arcade-muted animate-pulse">YUKLENIYOR...</span>
        ) : pendingBets.length === 0 ? (
          <div className="flex items-center justify-center py-10 border-2 border-dashed border-arcade-border">
            <span className="font-pixel text-[10px] text-arcade-muted">BEKLEYEN BAHIS YOK</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingBets.map((bet) => (
              <PixelCard key={bet.id} className="space-y-3">
                <div className="space-y-1">
                  <p className="font-pixel text-xs text-arcade-yellow truncate">{bet.title}</p>
                  <p className="font-pixel text-[10px] text-arcade-muted">
                    @{bet.creator.username}
                  </p>
                  {bet.description && (
                    <p className="font-pixel text-[10px] text-arcade-muted/70 line-clamp-2">
                      {bet.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 pt-1">
                  <PixelButton
                    variant="yes"
                    size="sm"
                    disabled={resolving === bet.id}
                    onClick={() => handleApprove(bet.id)}
                  >
                    ONAYLA
                  </PixelButton>
                  <PixelButton
                    variant="danger"
                    size="sm"
                    disabled={resolving === bet.id}
                    onClick={() => handleReject(bet.id)}
                  >
                    REDDET
                  </PixelButton>
                </div>
              </PixelCard>
            ))}
          </div>
        )}
      </section>

      {/* Section 2 — User Management */}
      <section className="space-y-4">
        <h2 className="font-pixel text-sm text-arcade-muted tracking-widest">
          KULLANICI YONETIMI
          <span className="ml-2 text-arcade-yellow">({users.length})</span>
        </h2>

        {usersLoading ? (
          <span className="font-pixel text-[10px] text-arcade-muted animate-pulse">YUKLENIYOR...</span>
        ) : (
          <div className="border-2 border-arcade-border">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_80px_60px_60px_120px_140px] gap-2 px-4 py-3 border-b-2 border-arcade-border bg-arcade-card">
              <span className="font-pixel text-[10px] text-arcade-muted">OYUNCU</span>
              <span className="font-pixel text-[10px] text-arcade-muted text-right">PUAN</span>
              <span className="font-pixel text-[10px] text-arcade-muted text-right">W</span>
              <span className="font-pixel text-[10px] text-arcade-muted text-right">L</span>
              <span className="font-pixel text-[10px] text-arcade-muted text-center">ROL</span>
              <span className="font-pixel text-[10px] text-arcade-muted text-center">ISLEM</span>
            </div>

            {/* Table Rows */}
            {users.map((user) => {
              const isSelf = user.id === profile.id;
              const isUpdating = updatingUser === user.id;

              return (
                <div
                  key={user.id}
                  className="grid grid-cols-[1fr_80px_60px_60px_120px_140px] gap-2 px-4 py-3 border-b border-arcade-border items-center hover:bg-arcade-card/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-arcade-text">{user.username}</span>
                    {isSelf && (
                      <span className="font-pixel text-[8px] text-arcade-muted">(SEN)</span>
                    )}
                  </div>
                  <span className="text-right">
                    <CoinCounter amount={user.points} size="sm" />
                  </span>
                  <span className="text-sm text-arcade-green text-right">{user.total_wins}</span>
                  <span className="text-sm text-arcade-red text-right">{user.total_losses}</span>
                  <div className="text-center">
                    <span
                      className={`font-pixel text-[10px] px-2 py-0.5 border ${
                        user.role === "admin"
                          ? "text-arcade-purple border-arcade-purple"
                          : "text-arcade-muted border-arcade-border"
                      }`}
                    >
                      {user.role === "admin" ? "ADMIN" : "USER"}
                    </span>
                  </div>
                  <div className="flex gap-1 justify-center">
                    {!isSelf && (
                      <PixelButton
                        variant={user.role === "admin" ? "danger" : "primary"}
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => toggleAdmin(user.id, user.role)}
                      >
                        {user.role === "admin" ? "KALDIR" : "ADMIN"}
                      </PixelButton>
                    )}
                    <PixelButton
                      variant="ghost"
                      size="sm"
                      disabled={isUpdating}
                      onClick={() => resetPoints(user.id)}
                      title="Puani ve istatistikleri sifirla"
                    >
                      RESET
                    </PixelButton>
                    <PixelButton
                      variant="yes"
                      size="sm"
                      disabled={isUpdating}
                      onClick={() => addPoints(user.id, 50)}
                      title="50 puan ekle"
                    >
                      +50
                    </PixelButton>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Section 3 — Resolve Active Bets */}
      <section className="space-y-4">
        <h2 className="font-pixel text-sm text-arcade-muted tracking-widest">
          AKTIF BAHISLERI COZUMLE
          <span className="ml-2 text-arcade-yellow">({activeBets.length})</span>
        </h2>

        {activeLoading ? (
          <span className="font-pixel text-[10px] text-arcade-muted animate-pulse">YUKLENIYOR...</span>
        ) : activeBets.length === 0 ? (
          <div className="flex items-center justify-center py-10 border-2 border-dashed border-arcade-border">
            <span className="font-pixel text-[10px] text-arcade-muted">AKTIF BAHIS YOK</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBets.map((bet) => {
              const { pool } = calculateOdds(bet.wagers);
              const wagerCount = bet.wagers.length;
              const isResolving = resolving === bet.id;

              return (
                <PixelCard key={bet.id} className="space-y-3">
                  <div className="space-y-1">
                    <p className="font-pixel text-xs text-arcade-yellow truncate">{bet.title}</p>
                    <div className="flex gap-4">
                      <span className="font-pixel text-[10px] text-arcade-muted">
                        {wagerCount} BAHIS
                      </span>
                      <span className="font-pixel text-[10px] text-arcade-green">
                        {pool} PUAN HAVUZ
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <PixelButton
                      variant="yes"
                      size="sm"
                      disabled={isResolving}
                      onClick={() => handleResolve(bet.id, true)}
                    >
                      EVET KAZANDI
                    </PixelButton>
                    <PixelButton
                      variant="no"
                      size="sm"
                      disabled={isResolving}
                      onClick={() => handleResolve(bet.id, false)}
                    >
                      HAYIR KAZANDI
                    </PixelButton>
                  </div>
                </PixelCard>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
