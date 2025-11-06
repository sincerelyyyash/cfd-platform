"use client";

import dynamic from "next/dynamic";
export const ProvidersWrapper = dynamic(
  () => import("./Providers").then((mod) => ({ default: mod.Providers })),
  {
    ssr: false,
    loading: () => null,
  }
);

