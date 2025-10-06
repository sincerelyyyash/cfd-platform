"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "black" | "white" | "ghost";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const baseStyles =
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50";

const variantClasses: Record<ButtonVariant, string> = {
  black:
    "bg-black text-white hover:bg-neutral-900 focus-visible:ring-neutral-600",
  white:
    "bg-white text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-600",
  ghost:
    "bg-transparent text-slate-200 hover:bg-slate-900/60 focus-visible:ring-neutral-600",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "black", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantClasses[variant], className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };

