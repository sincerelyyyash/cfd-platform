"use client";

import React from "react";

type BrandProps = {
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  textClassName?: string;
  variant?: "delta" | "orbital" | "spark" | "glyph";
};

const sizeToDimension: Record<NonNullable<BrandProps["size"]>, number> = {
  sm: 24,
  md: 28,
  lg: 34,
};

export const Brand: React.FC<BrandProps> = ({ showText = true, size = "md", className = "", textClassName = "", variant = "delta" }) => {
  const dimension = sizeToDimension[size];

  return (
    <span className={`inline-flex items-center gap-2 ${className}`} aria-label="TradePrime logo">
      {variant === "delta" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width={dimension}
          height={dimension}
          className="opacity-95 text-neutral-100"
          aria-hidden="true"
          focusable="false"
        >
          {/* Minimal abstract triangle with inner stroke */}
          <polygon points="16,7.5 24,22.5 8,22.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M16 11.5 L16 18.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="20.5" cy="15.5" r="1.5" fill="currentColor" />
        </svg>
      )}
      {variant === "orbital" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width={dimension}
          height={dimension}
          className="opacity-95 text-neutral-100"
          aria-hidden="true"
          focusable="false"
        >
          {/* Circle with two orbital arcs */}
          <circle cx="16" cy="16" r="9.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
          <path d="M9 14.5a9 9 0 0 0 14 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <path d="M11 19.5a7 7 0 0 0 10 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </svg>
      )}
      {variant === "spark" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width={dimension}
          height={dimension}
          className="opacity-95 text-neutral-100"
          aria-hidden="true"
          focusable="false"
        >
          {/* Diamond spark with notch */}
          <path d="M16 6 L26 16 L16 26 L6 16 Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M16 10 L22 16 L16 22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </svg>
      )}
      {variant === "glyph" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width={dimension}
          height={dimension}
          className="opacity-95 text-neutral-100"
          aria-hidden="true"
          focusable="false"
        >
          {/* Abstract depth glyph: rounded square, soft top highlight, inner notch */}
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
            </linearGradient>
          </defs>
          <rect x="5" y="5" width="22" height="22" rx="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
          {/* top light edge */}
          <path d="M7 9 H25" stroke="url(#g1)" strokeWidth="1" />
          {/* inner cut + arc */}
          <path d="M12 16 C12 12.5 15 10 18 10 C21 10 24 12.5 24 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 20 C10 22 14 24 18 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
        </svg>
      )}
      {showText ? (
        <span className={`text-lg sm:text-xl font-semibold tracking-tight text-neutral-100 ${textClassName}`}>
          TradePrime
        </span>
      ) : null}
    </span>
  );
};

export default Brand;


