"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers";
import { CoinCounter } from "@/components/ui/coin-counter";
import { PixelButton } from "@/components/ui/pixel-button";
import { NotificationBell } from "@/features/notifications/components/notification-toast";
import { sounds } from "@/lib/sounds";
import { UserAvatar } from "@/components/ui/user-avatar";

export function Navbar() {
  const { profile } = useAuth();
  const router = useRouter();
  const [soundOn, setSoundOn] = useState(true);

  function handleSoundToggle() {
    const next = sounds.toggle();
    setSoundOn(next);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-arcade-card border-b-2 border-arcade-border flex items-center justify-between px-4">
      <Link
        href="/feed"
        className="hover:opacity-80 transition-opacity"
      >
        <Image
          src="/logo.png"
          alt="OffBet"
          width={120}
          height={30}
          className="h-7 w-auto"
          priority
        />
      </Link>

      <div className="flex items-center gap-4">
        {profile && (
          <>
            <NotificationBell />
            <CoinCounter amount={profile.points} size="sm" />

            <Link
              href={`/profile/${profile.id}`}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <UserAvatar
                avatarUrl={profile.avatar_url}
                username={profile.username}
                size="sm"
              />
              <span className="font-pixel text-[10px] text-arcade-text">
                {profile.username}
              </span>
            </Link>

            {profile.role === "admin" && (
              <Link
                href="/admin"
                className="font-pixel text-[10px] text-arcade-purple hover:opacity-80 transition-opacity"
              >
                ADMIN
              </Link>
            )}

            <PixelButton variant="ghost" size="sm" onClick={handleSoundToggle}>
              {soundOn ? "🔊" : "🔇"}
            </PixelButton>

            <PixelButton variant="ghost" size="sm" onClick={handleLogout}>
              CIKIS
            </PixelButton>
          </>
        )}
      </div>
    </header>
  );
}
