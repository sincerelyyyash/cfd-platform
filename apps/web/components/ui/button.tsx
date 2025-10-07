"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "destructive"
  | "ghost"
  | "outline";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

// Base depth-enhanced styles (dark theme focused)
const baseStyles =
  // layout
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl overflow-hidden isolate px-4 py-2 text-sm font-semibold tabular-nums select-none transition-all duration-200 ease-out focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60";

// Shared depth tokens
const depthTokens = {
  topBorder: "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:rounded-t-[inherit] before:content-['']",
  bottomBorder: "after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:rounded-b-[inherit] after:content-['']",
  focusRing:
    "focus-visible:ring-2 focus-visible:ring-neutral-400/30 focus-visible:ring-offset-0",
};

const variantClasses: Record<ButtonVariant, string> = {
  // Emerald primary (buy / CTA)
  primary: cn(
    "relative text-emerald-100",
    // base surface with soft gradient
    "bg-gradient-to-b from-emerald-600/70 via-emerald-600/60 to-emerald-700/70",
    // light top + dark bottom accents
    depthTokens.topBorder,
    "before:bg-emerald-200/20",
    depthTokens.bottomBorder,
    "after:bg-emerald-950/40",
    // layered outer shadows (glow + drop)
    "shadow-[0_-2px_8px_-6px_rgba(16,185,129,0.45),0_6px_16px_-6px_rgba(0,0,0,0.75)]",
    // hover lift
    "hover:shadow-[0_-3px_10px_-6px_rgba(52,211,153,0.55),0_10px_22px_-8px_rgba(0,0,0,0.85)] hover:from-emerald-500/70 hover:to-emerald-700/80",
    // active pressed (inset)
    "active:shadow-inner active:from-emerald-700/70 active:to-emerald-800/80 active:translate-y-[1px]",
    depthTokens.focusRing
  ),

  // Neutral secondary
  secondary: cn(
    "relative text-zinc-100",
    "bg-gradient-to-b from-neutral-800/80 via-neutral-900/80 to-black",
    depthTokens.topBorder,
    "before:bg-white/5",
    depthTokens.bottomBorder,
    "after:bg-black/60",
    "shadow-[0_-2px_8px_-6px_rgba(255,255,255,0.06),0_6px_16px_-6px_rgba(0,0,0,0.8)]",
    "hover:shadow-[0_-3px_10px_-6px_rgba(255,255,255,0.08),0_10px_22px_-8px_rgba(0,0,0,0.9)]",
    "active:shadow-inner active:from-neutral-900 active:to-black active:translate-y-[1px]",
    depthTokens.focusRing
  ),

  // Success (maps to emerald as well, but slightly lighter)
  success: cn(
    "relative text-emerald-100",
    "bg-gradient-to-b from-emerald-500/70 via-emerald-600/70 to-emerald-700/80",
    depthTokens.topBorder,
    "before:bg-emerald-100/25",
    depthTokens.bottomBorder,
    "after:bg-emerald-950/40",
    "shadow-[0_-2px_8px_-6px_rgba(16,185,129,0.4),0_6px_16px_-6px_rgba(0,0,0,0.75)]",
    "hover:shadow-[0_-3px_10px_-6px_rgba(52,211,153,0.5),0_10px_22px_-8px_rgba(0,0,0,0.85)]",
    "active:shadow-inner active:from-emerald-600/80 active:to-emerald-800/80 active:translate-y-[1px]",
    depthTokens.focusRing
  ),

  // Destructive (sell)
  destructive: cn(
    "relative text-rose-100",
    "bg-gradient-to-b from-rose-600/70 via-rose-600/60 to-rose-700/80",
    depthTokens.topBorder,
    "before:bg-rose-100/25",
    depthTokens.bottomBorder,
    "after:bg-rose-950/40",
    "shadow-[0_-2px_8px_-6px_rgba(244,63,94,0.45),0_6px_16px_-6px_rgba(0,0,0,0.75)]",
    "hover:shadow-[0_-3px_10px_-6px_rgba(251,113,133,0.55),0_10px_22px_-8px_rgba(0,0,0,0.85)] hover:from-rose-500/70 hover:to-rose-700/80",
    "active:shadow-inner active:from-rose-700/80 active:to-rose-800/80 active:translate-y-[1px]",
    depthTokens.focusRing
  ),

  // Ghost (tertiary)
  ghost: cn(
    "relative text-zinc-300 bg-transparent",
    "hover:bg-white/5",
    depthTokens.focusRing
  ),

  // Outline (subtle container with depth)
  outline: cn(
    "relative text-zinc-200",
    "bg-gradient-to-b from-transparent via-transparent to-transparent border border-neutral-800/70",
    depthTokens.topBorder,
    "before:bg-white/5",
    depthTokens.bottomBorder,
    "after:bg-black/50",
    "hover:bg-white/5",
    depthTokens.focusRing
  ),
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", fullWidth, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          fullWidth ? "w-full" : undefined,
          variantClasses[variant],
          // micro interactions
          !disabled && "hover:-translate-y-[0.5px] active:translate-y-[0.5px]",
          className,
        )}
        disabled={disabled}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };

