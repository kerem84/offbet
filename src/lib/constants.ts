export const CATEGORIES = [
  { value: "ofis", label: "Ofis" },
  { value: "yemek", label: "Yemek" },
  { value: "toplanti", label: "Toplanti" },
  { value: "random", label: "Random" },
] as const;

export const REACTION_EMOJIS = ["🔥", "💀", "🤡", "😂", "🎰", "💰", "🎯", "👀"] as const;

export interface AvatarOption {
  id: string;
  emoji: string;
  label: string;
  bg: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: "avatar-1",  emoji: "🥷",    label: "Ninja",    bg: "#1a1a2e" },
  { id: "avatar-2",  emoji: "🤖",    label: "Robot",    bg: "#16213e" },
  { id: "avatar-3",  emoji: "👽",    label: "Uzayli",   bg: "#0f3460" },
  { id: "avatar-4",  emoji: "🏴‍☠️", label: "Korsan",   bg: "#533483" },
  { id: "avatar-5",  emoji: "🚀",    label: "Astronot", bg: "#2b2d42" },
  { id: "avatar-6",  emoji: "🧙",    label: "Buyucu",   bg: "#4a0e4e" },
  { id: "avatar-7",  emoji: "⚔️",    label: "Viking",   bg: "#3d0c02" },
  { id: "avatar-8",  emoji: "🧟",    label: "Zombi",    bg: "#1b4332" },
  { id: "avatar-9",  emoji: "🛡️",   label: "Sovalye",  bg: "#023047" },
  { id: "avatar-10", emoji: "🐱",    label: "Kedi",     bg: "#3a0ca3" },
  { id: "avatar-11", emoji: "🐉",    label: "Ejderha",  bg: "#6a040f" },
  { id: "avatar-12", emoji: "💀",    label: "Iskelet",  bg: "#212529" },
];

export function getAvatar(avatarId: string | null): AvatarOption | null {
  if (!avatarId) return null;
  return AVATAR_OPTIONS.find((a) => a.id === avatarId) ?? null;
}

export const STARTING_POINTS = 100;
