"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers";
import { CoinCounter } from "@/components/ui/coin-counter";
import { PixelButton } from "@/components/ui/pixel-button";
import { NotificationBell } from "@/features/notifications/components/notification-toast";

export function Navbar() {
  const { profile } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-arcade-card border-b-2 border-arcade-border flex items-center justify-between px-4">
      <Link
        href="/feed"
        className="font-pixel text-lg text-arcade-yellow tracking-widest hover:opacity-80 transition-opacity"
      >
        OFFBET
      </Link>

      <div className="flex items-center gap-4">
        {profile && (
          <>
            <NotificationBell />
            <CoinCounter amount={profile.points} size="sm" />

            <Link
              href={`/profile/${profile.id}`}
              className="font-pixel text-[10px] text-arcade-text hover:text-arcade-yellow transition-colors"
            >
              {profile.username}
            </Link>

            {profile.role === "admin" && (
              <Link
                href="/admin"
                className="font-pixel text-[10px] text-arcade-purple hover:opacity-80 transition-opacity"
              >
                ADMIN
              </Link>
            )}

            <PixelButton variant="ghost" size="sm" onClick={handleLogout}>
              CIKIS
            </PixelButton>
          </>
        )}
      </div>
    </header>
  );
}
