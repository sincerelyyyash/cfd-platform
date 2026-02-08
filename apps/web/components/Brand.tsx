"use client";

import React from "react";

type BrandProps = {
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  textClassName?: string;
  variant?: "delta" | "orbital" | "spark" | "glyph";
};

export const Brand: React.FC<BrandProps> = ({ showText = true, className = "", textClassName = "" }) => {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} aria-label="Compass logo">
      {showText ? (
        <span className={`text-lg sm:text-xl font-bold tracking-tight text-white font-bitcount ${textClassName}`}>
          Compass
        </span>
      ) : null}
    </span>
  );
};

export default Brand;
