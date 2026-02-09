import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {Space_Grotesk} from "next/font/google";
import { ProvidersWrapper } from "@/components/ProvidersWrapper";
import { Analytics } from "@vercel/analytics/next";

const bitcount = localFont({
  src: "./fonts/BitcountPropSingle.ttf",
  variable: "--font-bitcount",
  weight: "100 900",
});

const ibmPlexSans = localFont({
  src: "./fonts/IBMPlexSans.ttf",
  variable: "--font-ibm-plex-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Axis",
  description: "Navigate Markets with Axis",
};

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`antialiased min-h-screen flex flex-col ${bitcount.variable} ${ibmPlexSans.variable} ${spaceGrotesk.variable}`}
      >
        <ProvidersWrapper>
          {children}
        </ProvidersWrapper>
        <Analytics />
      </body>
    </html>
  );
}
