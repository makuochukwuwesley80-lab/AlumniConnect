"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GlassInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  (
    {
      className,
      type,
      icon,
      error,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const inputType =
      type === "password"
        ? showPassword
          ? "text"
          : "password"
        : type;

    return (
      <div className="w-full">
        <div
          className={cn(
            "relative overflow-hidden rounded-[24px]",
            "border border-white/20",
            "bg-white/75",
            "backdrop-blur-3xl",
            "shadow-[0_10px_40px_rgba(0,0,0,.08)]",
            "transition-all duration-300",
            "focus-within:border-sky-400",
            "focus-within:ring-4",
            "focus-within:ring-sky-400/20",
            error && "border-red-400 ring-2 ring-red-300/20"
          )}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/10" />

          {icon && (
            <div className="absolute left-5 top-1/2 z-10 -translate-y-1/2 text-slate-500">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={props.id}
            name={props.name}
            autoComplete={props.autoComplete}
            type={inputType}
            disabled={disabled}
            className={cn(
              "relative z-10 h-16 w-full bg-transparent",
              "text-slate-900",
              "placeholder:text-slate-500",
              "outline-none",
              icon ? "pl-14 pr-14" : "px-5",
              type === "password" && "pr-14",
              disabled && "cursor-not-allowed opacity-50",
              className
            )}
            {...props}
          />

          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 z-10 -translate-y-1/2 text-slate-500 transition hover:text-sky-500"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          )}
        </div>

        {error && (
          <p className="mt-2 ml-2 text-sm font-medium text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

GlassInput.displayName = "GlassInput";

export default GlassInput;
