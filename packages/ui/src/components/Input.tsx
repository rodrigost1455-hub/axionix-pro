import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={twMerge(
            clsx(
              "w-full h-10 px-3 rounded-xl text-sm text-white placeholder:text-slate-500",
              "bg-white/[0.05] border border-white/[0.10]",
              "focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20",
              "transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20"
            ),
            className
          )}
          {...props}
        />
        {hint && !error && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={twMerge(
            clsx(
              "w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-500",
              "bg-white/[0.05] border border-white/[0.10]",
              "focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20",
              "transition-all duration-200 resize-none",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-red-500/50"
            ),
            className
          )}
          {...props}
        />
        {hint && !error && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={twMerge(
            clsx(
              "w-full h-10 px-3 rounded-xl text-sm text-white",
              "bg-[#0D0D1E] border border-white/[0.10]",
              "focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20",
              "transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-red-500/50"
            ),
            className
          )}
          {...props}
        >
          <option value="" disabled>Seleccionar...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#0D0D1E]">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
