import type { Badge } from "../types";

interface BadgeDisplayProps {
  badge: Badge;
  earned?: boolean;
}

export function BadgeDisplay({ badge, earned = true }: BadgeDisplayProps) {
  return (
    <div className="relative group flex flex-col items-center gap-1">
      {/* Tooltip */}
      <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-10 w-36 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-arcade-card border border-arcade-border px-2 py-1.5 text-center">
          <p className="font-pixel text-[8px] text-arcade-text leading-relaxed">
            {badge.description}
          </p>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-arcade-border" />
        </div>
      </div>

      {/* Badge body */}
      <div
        className={[
          "w-10 h-10 border-2 flex items-center justify-center transition-all",
          earned
            ? "border-arcade-purple bg-arcade-purple/10"
            : "border-arcade-border opacity-40",
        ].join(" ")}
      >
        <span className="text-lg leading-none" role="img" aria-label={badge.name}>
          {(badge as Badge & { icon?: string }).icon ?? "🏆"}
        </span>
      </div>

      <p className="font-pixel text-[8px] text-arcade-muted text-center leading-tight max-w-[40px] truncate">
        {badge.name}
      </p>
    </div>
  );
}
