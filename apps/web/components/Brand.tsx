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

export const Brand: React.FC<BrandProps> = ({ showText = true, size = "md", className = "", textClassName = "", variant }) => {
  const dimension = sizeToDimension[size];

  return (
    <span className={`inline-flex items-center gap-2 ${className}`} aria-label="TradePrime logo">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width={dimension}
        height={dimension}
        className="text-white flex-shrink-0"
        style={{ imageRendering: "pixelated" }}
        shapeRendering="crispEdges"
        aria-hidden="true"
        focusable="false"
      >
        {/* White dot in the middle */}
        <circle
          cx="16"
          cy="16"
          r="4"
          fill="currentColor"
          shapeRendering="crispEdges"
        />
      </svg>
      {showText ? (
        <span className={`text-lg sm:text-xl font-semibold tracking-tight text-neutral-100 ${textClassName}`}>
          TradePrime
        </span>
      ) : null}
    </span>
  );
};

export default Brand;


