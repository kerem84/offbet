"use client";

import { use } from "react";
import { useProfile } from "@/features/users/hooks/use-profile";
import { UserProfile } from "@/features/users/components/user-profile";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { id } = use(params);
  const { profile, loading, updateAvatar } = useProfile(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="font-pixel text-xs text-arcade-muted animate-pulse">
          YUKLENIYOR...
        </span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-20 border-2 border-dashed border-arcade-border">
        <span className="font-pixel text-[10px] text-arcade-red">
          KULLANICI BULUNAMADI
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <UserProfile profile={profile} onUpdateAvatar={updateAvatar} />
    </div>
  );
}
