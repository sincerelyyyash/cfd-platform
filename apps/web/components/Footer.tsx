import Link from "next/link";

const Footer = () => {
  return (
    <footer
      className="w-full bg-[oklch(0.145_0_0)] text-[oklch(0.82_0_0)] border-t border-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-white/5 text-white/80" aria-hidden>
              TP
            </span>
            <p className="text-sm leading-6 text-white/70">
              © {new Date().getFullYear()} TradePrime. All rights reserved.
            </p>
          </div>
          <nav aria-label="Footer" className="flex items-center gap-6">
            <Link
              href="/trading"
              className="text-sm text-white/70 hover:text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded px-1"
            >
              Trading
            </Link>
            <Link
              href="/"
              className="text-sm text-white/70 hover:text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded px-1"
            >
              Home
            </Link>
            <a
              href="mailto:support@tradeprime.app"
              className="text-sm text-white/70 hover:text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded px-1"
            >
              Support
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


