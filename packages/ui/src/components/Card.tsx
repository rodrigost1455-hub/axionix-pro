import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "highlight";
  padding?: "none" | "sm" | "md" | "lg";
}

const variants = {
  default: "bg-white/[0.04] border border-white/[0.08]",
  bordered: "bg-transparent border border-white/[0.12]",
  highlight: "bg-indigo-600/10 border border-indigo-500/30",
};

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({ variant = "default", padding = "md", className, children, ...props }: CardProps) {
  return (
    <div
      className={twMerge(
        clsx("rounded-2xl transition-all duration-200", variants[variant], paddings[padding]),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge("mb-5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={twMerge("text-lg font-semibold text-white", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={twMerge("text-sm text-slate-400 mt-1", className)} {...props}>
      {children}
    </p>
  );
}
