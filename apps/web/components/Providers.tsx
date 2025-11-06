"use client";

import * as React from "react";
import dynamic from "next/dynamic";

const AuthProvider = dynamic(() => import("@/components/auth/AuthProvider").then((mod) => ({ default: mod.AuthProvider })), {
  ssr: false,
  loading: () => null,
});

const WebSocketProvider = dynamic(() => import("@/components/WebSocketProvider").then((mod) => ({ default: mod.WebSocketProvider })), {
  ssr: false,
  loading: () => null,
});

const Sonar = dynamic(() => import("@/components/ui/sonar").then((mod) => ({ default: mod.Sonar })), {
  ssr: false,
  loading: () => null,
});

const Footer = dynamic(() => import("@/components/Footer").then((mod) => ({ default: mod.default })), {
  ssr: false,
  loading: () => null,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <AuthProvider>
      <WebSocketProvider>
        {children}
        <Footer />
        <Sonar />
      </WebSocketProvider>
    </AuthProvider>
  );
}

