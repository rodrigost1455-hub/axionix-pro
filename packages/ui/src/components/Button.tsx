import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]",
  secondary:
    "bg-white/[0.06] hover:bg-white/[0.10] text-white border border-white/[0.10] hover:border-white/[0.20]",
  ghost: "bg-transparent hover:bg-white/[0.06] text-slate-400 hover:text-white border border-transparent",
  outline:
    "bg-transparent hover:bg-indigo-600/10 text-indigo-400 hover:text-indigo-300 border border-indigo-500/40 hover:border-indigo-500",
  danger: "bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 border border-red-500/30",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading = false, fullWidth = false, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={twMerge(
          clsx(
            "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed select-none",
            variants[variant],
            sizes[size],
            fullWidth && "w-full"
          ),
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
