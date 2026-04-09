import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { HTMLAttributes } from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "indigo";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-white/[0.08] text-slate-300 border border-white/[0.12]",
  success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  danger: "bg-red-500/10 text-red-400 border border-red-500/20",
  info: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  indigo: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
};

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold",
          variants[variant]
        ),
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function PlanBadge({ plan }: { plan: string }) {
  const config: Record<string, { variant: BadgeVariant; label: string }> = {
    FREE: { variant: "default", label: "Gratis" },
    BASIC: { variant: "info", label: "Básico" },
    PRO: { variant: "indigo", label: "Pro" },
    PREMIUM: { variant: "warning", label: "Premium" },
  };
  const { variant, label } = config[plan] ?? config.FREE;
  return <Badge variant={variant}>{label}</Badge>;
}
