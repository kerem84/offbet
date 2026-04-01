"use client";

import { PixelCard } from "@/components/ui/pixel-card";
import { CoinCounter } from "@/components/ui/coin-counter";
import { useAuth } from "@/components/providers";
import { AvatarPicker } from "./avatar-picker";
import { BadgeCollection } from "@/features/badges/components/badge-collection";
import type { Profile } from "../types";

interface UserProfileProps {
  profile: Profile;
  onUpdateAvatar?: (url: string) => void;
}

export function UserProfile({ profile, onUpdateAvatar }: UserProfileProps) {
  const { profile: authProfile } = useAuth();
  const isOwnProfile = authProfile?.id === profile.id;

  const totalGames = profile.total_wins + profile.total_losses;
  const winRate = totalGames > 0 ? Math.round((profile.total_wins / totalGames) * 100) : 0;

  return (
    <div className="space-y-4">
      <PixelCard>
        <div className="flex items-center gap-4">
          {/* Avatar placeholder */}
          <div className="w-20 h-20 bg-arcade-border border-2 border-arcade-muted flex items-center justify-center shrink-0">
            <span className="font-pixel text-xl text-arcade-yellow">
              {profile.username.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="space-y-1.5">
            <p className="font-pixel text-sm text-arcade-text">{profile.username}</p>
            {profile.role === "admin" && (
              <span className="inline-block px-2 py-0.5 border border-arcade-purple text-arcade-purple font-pixel text-[9px]">
                ADMIN
              </span>
            )}
          </div>
        </div>
      </PixelCard>

      <PixelCard>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="space-y-1 text-center">
            <p className="font-pixel text-[9px] text-arcade-muted">PUAN</p>
            <CoinCounter amount={profile.points} size="sm" />
          </div>
          <div className="space-y-1 text-center">
            <p className="font-pixel text-[9px] text-arcade-muted">GALIS</p>
            <span className="font-pixel text-sm text-arcade-green">{profile.total_wins}</span>
          </div>
          <div className="space-y-1 text-center">
            <p className="font-pixel text-[9px] text-arcade-muted">KAYIP</p>
            <span className="font-pixel text-sm text-arcade-red">{profile.total_losses}</span>
          </div>
        </div>

        <div className="border-t border-arcade-border pt-3 text-center">
          <p className="font-pixel text-[9px] text-arcade-muted mb-1">KAZANMA ORANI</p>
          <span className="font-pixel text-base text-arcade-yellow">{winRate}%</span>
        </div>
      </PixelCard>

      {isOwnProfile && onUpdateAvatar && (
        <PixelCard>
          <p className="font-pixel text-[9px] text-arcade-muted mb-3">AVATAR SEC</p>
          <AvatarPicker
            selected={profile.avatar_url}
            onSelect={onUpdateAvatar}
          />
        </PixelCard>
      )}

      <BadgeCollection userId={profile.id} />
    </div>
  );
}
