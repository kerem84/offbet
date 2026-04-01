export const CATEGORIES = [
  { value: "ofis", label: "Ofis" },
  { value: "yemek", label: "Yemek" },
  { value: "toplanti", label: "Toplanti" },
  { value: "random", label: "Random" },
] as const;

export const REACTION_EMOJIS = ["🔥", "💀", "🤡", "😂", "🎰", "💰", "🎯", "👀"] as const;

export const AVATARS = Array.from({ length: 12 }, (_, i) => `/avatars/avatar-${i + 1}.png`);

export const STARTING_POINTS = 100;
