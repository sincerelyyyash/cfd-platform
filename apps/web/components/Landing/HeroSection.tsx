import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";

const Sphere = dynamic(() => import("./Sphere"), { ssr: false });

const NAV_ITEMS = [
  { label: "Features", href: "#", index: "01" },
  { label: "About", href: "#", index: "02" },
  { label: "Architecture", href: "#", index: "03" },
  { label: "Contact", href: "#", index: "04" },
];

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power4.out", duration: 1 },
    });

    tl.fromTo(
      ".hero-sphere",
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 1.8, ease: "expo.out" }
    )
      .fromTo(
        ".hero-wordmark",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=1.4"
      )
      .fromTo(
        ".hero-tag",
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, duration: 0.7 },
        "-=1.0"
      )
      .fromTo(
        ".hero-line",
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.08 },
        "-=0.8"
      )
      .fromTo(
        ".hero-rule",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: "power2.inOut" },
        "-=0.5"
      )
      .to(
        ".hero-sub",
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.4"
      )
      .to(
        ".hero-cta",
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 },
        "-=0.4"
      )
      .fromTo(
        ".hero-nav-item",
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.06 },
        "-=0.6"
      );
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-[#08080a] overflow-hidden"
      aria-label="Hero section"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 right-[20%] -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-white/[0.02] blur-[120px] pointer-events-none" />
      </div>

      <div className="hero-sphere absolute inset-0 z-[1] hidden md:block pointer-events-none">
        <div className="absolute top-20 right-0 w-[70%] lg:w-[65%] h-[calc(100%-5rem)]">
          <Sphere />
        </div>
      </div>

      <div className="absolute inset-0 z-[2] pointer-events-none bg-gradient-to-r from-[#08080a] via-[#08080a]/80 to-transparent" />
      <div className="absolute inset-0 z-[2] pointer-events-none bg-gradient-to-t from-[#08080a] via-transparent to-[#08080a]/40" />

      <div className="relative z-10 h-full w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-between py-10 md:py-12 pb-16 md:pb-20">

        <div className="flex items-start justify-between">
          <div className="hero-wordmark">
            <span className="text-[13px] tracking-[0.4em] uppercase text-neutral-400 font-space font-medium">
              AXIS
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-8">
          <div className="max-w-2xl">

            <div className="hero-tag flex items-center gap-3 mb-6">
              <span className="inline-block w-5 h-px bg-neutral-600" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-600 font-ibm-plex-sans font-medium">
                Institutional Execution Terminal
              </span>
            </div>

            <div className="mb-5">
              <div className="overflow-hidden mb-0.5">
                <h1 className="hero-line text-[clamp(3rem,8vw,7rem)] font-bold tracking-[-0.045em] text-white leading-[0.9] font-space">
                  Trade
                </h1>
              </div>
              <div className="overflow-hidden mb-0.5">
                <h1 className="hero-line text-[clamp(3rem,8vw,7rem)] font-semibold tracking-[-0.045em] text-neutral-500 leading-[0.9] font-space">
                  with Precision
                </h1>
              </div>
              <div className="overflow-hidden">
                <h1 className="hero-line text-[clamp(3rem,8vw,7rem)] font-bold tracking-[-0.045em] text-white leading-[0.9] font-space">
                  on{" "}
                  <span className="font-ibm-plex-sans font-medium italic text-white tracking-[-0.02em]">
                    AXIS
                  </span>
                </h1>
              </div>
            </div>

            <div className="hero-rule origin-left w-12 h-px bg-neutral-700 mb-5" />

            <p className="hero-sub max-w-sm text-[14px] text-neutral-500 font-ibm-plex-sans leading-[1.7] mb-8 opacity-0 translate-y-4">
              Trading execution terminal for systematic teams, combining low-latency routing, live risk, and position-aware controls in one surface.
            </p>

            <div className="flex flex-row items-center gap-3">
              <Link
                href="/trading"
                className="hero-cta group relative inline-flex items-center gap-2 px-6 py-2.5 bg-white text-[#08080a] text-[13px] font-medium tracking-wide transition-all duration-300 hover:bg-neutral-200 font-space opacity-0 translate-y-3"
                tabIndex={0}
                aria-label="Start trading"
              >
                <span>Start Trading</span>
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                href="/signin"
                className="hero-cta group inline-flex items-center px-6 py-2.5 text-[13px] font-medium text-neutral-500 hover:text-white border border-white/[0.08] hover:border-white/20 transition-all duration-300 font-space opacity-0 translate-y-3"
                tabIndex={0}
                aria-label="Sign in to your account"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end gap-2 shrink-0 pb-1">
            <nav
              className="flex flex-col items-end gap-2"
              aria-label="Page sections"
            >
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.index}
                  href={item.href}
                  className="hero-nav-item group flex items-center gap-3 transition-colors duration-300"
                  tabIndex={0}
                >
                  <span className="text-[10px] text-neutral-700 font-mono transition-colors duration-300 group-hover:text-neutral-500">
                    {item.index}
                  </span>
                  <span className="w-4 h-px bg-neutral-800 group-hover:bg-neutral-500 group-hover:w-6 transition-all duration-300" />
                  <span className="text-[11px] tracking-[0.2em] uppercase text-neutral-600 group-hover:text-white transition-colors duration-300 font-space font-medium">
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

      </div>
    </section>
  );
};
