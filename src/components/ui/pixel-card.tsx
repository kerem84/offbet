import { HTMLAttributes } from "react";

interface PixelCardProps extends HTMLAttributes<HTMLDivElement> {
  glowColor?: string;
}

function PixelCard({ glowColor, className = "", style, children, ...props }: PixelCardProps) {
  const glowStyle = glowColor
    ? { "--glow-color": glowColor, ...style } as React.CSSProperties
    : style;

  return (
    <div
      className={[
        "crt-overlay bg-arcade-card border-2 border-arcade-border p-4",
        "transition-all hover:border-arcade-muted",
        glowColor ? "hover:[box-shadow:0_0_16px_2px_var(--glow-color)]" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={glowStyle}
      {...props}
    >
      {children}
    </div>
  );
}

export { PixelCard };
