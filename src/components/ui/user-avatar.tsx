import { getAvatar } from "@/lib/constants";

interface UserAvatarProps {
  avatarUrl: string | null;
  username: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { box: "w-6 h-6", emoji: "text-sm", letter: "text-[10px]" },
  md: { box: "w-10 h-10", emoji: "text-xl", letter: "text-sm" },
  lg: { box: "w-20 h-20", emoji: "text-4xl", letter: "text-xl" },
};

export function UserAvatar({ avatarUrl, username, size = "md" }: UserAvatarProps) {
  const s = sizeMap[size];
  const avatar = getAvatar(avatarUrl);

  if (avatar) {
    return (
      <div
        className={`${s.box} border-2 border-arcade-muted flex items-center justify-center shrink-0`}
        style={{ backgroundColor: avatar.bg }}
        title={avatar.label}
      >
        <span className={s.emoji} role="img" aria-label={avatar.label}>
          {avatar.emoji}
        </span>
      </div>
    );
  }

  // Fallback: first letter
  return (
    <div
      className={`${s.box} bg-arcade-border border-2 border-arcade-muted flex items-center justify-center shrink-0`}
    >
      <span className={`font-pixel ${s.letter} text-arcade-yellow`}>
        {username.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}
