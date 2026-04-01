"use client";

type Size = "sm" | "md" | "lg";

interface CoinCounterProps {
  amount: number;
  size?: Size;
}

const coinSizeClasses: Record<Size, string> = {
  sm: "w-5 h-5 text-[10px]",
  md: "w-7 h-7 text-xs",
  lg: "w-9 h-9 text-sm",
};

const amountSizeClasses: Record<Size, string> = {
  sm: "text-[10px]",
  md: "text-xs",
  lg: "text-sm",
};

function CoinCounter({ amount, size = "md" }: CoinCounterProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={[
          "flex items-center justify-center",
          "bg-arcade-yellow text-arcade-bg rounded-full font-bold animate-coin-spin",
          coinSizeClasses[size],
        ].join(" ")}
      >
        $
      </div>
      <span className={["font-pixel text-arcade-yellow", amountSizeClasses[size]].join(" ")}>
        {amount}
      </span>
    </div>
  );
}

export { CoinCounter };
