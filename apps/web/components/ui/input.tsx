"use client";
import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`shadow-input flex h-10 w-full rounded-md border px-3 py-2 text-sm text-black placeholder:text-neutral-400 focus-visible:ring-[2px] focus-visible:ring-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-white dark:placeholder:text-neutral-600 ${className ?? ""}`}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export default Input;


