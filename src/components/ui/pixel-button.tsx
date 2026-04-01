"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { sounds } from "@/lib/sounds";

type Variant = "primary" | "danger" | "ghost" | "yes" | "no";
type Size = "sm" | "md" | "lg";

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-arcade-yellow text-arcade-bg border-arcade-yellow hover:bg-arcade-yellow/90",
  danger:  "bg-arcade-red   text-arcade-bg border-arcade-red   hover:bg-arcade-red/90",
  ghost:   "bg-transparent  text-arcade-muted border-arcade-muted hover:bg-arcade-muted/10",
  yes:     "bg-arcade-green text-arcade-bg border-arcade-green hover:bg-arcade-green/90",
  no:      "bg-arcade-red   text-arcade-bg border-arcade-red   hover:bg-arcade-red/90",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-[10px]",
  md: "px-5 py-2.5 text-xs",
  lg: "px-8 py-3.5 text-sm",
};

const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, onClick, ...props }, ref) => {
    function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
      sounds.play("blip");
      onClick?.(e);
    }

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={[
          "font-pixel border-2 transition-all",
          "hover:animate-shake active:animate-press-down",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </button>
    );
  }
);

PixelButton.displayName = "PixelButton";

export { PixelButton };
