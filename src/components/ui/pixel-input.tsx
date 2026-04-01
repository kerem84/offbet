import { forwardRef, InputHTMLAttributes } from "react";

interface PixelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const PixelInput = forwardRef<HTMLInputElement, PixelInputProps>(
  ({ label, className = "", id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={id}
            className="font-pixel text-[10px] text-arcade-muted uppercase"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={[
            "bg-arcade-bg border-2 border-arcade-border px-3 py-2 text-sm",
            "focus:border-arcade-yellow focus:outline-none transition-colors",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
      </div>
    );
  }
);

PixelInput.displayName = "PixelInput";

export { PixelInput };
