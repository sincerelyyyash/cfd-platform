import Image from "next/image";

type Testimonial = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  brand?: string;
  quote: string;
  highlight: string;
  timeframe: string;
};

const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Aarav Mehta",
    role: "Options Trader",
    avatar: "/Bitcoin.png",
    brand: "/tradeprime-logo.svg",
    quote:
      "Execution feels instant. The depth and fills gave me the confidence to size up without slippage surprises.",
    highlight: "+34% realized PnL",
    timeframe: "Last 30 days",
  },
  {
    id: "t2",
    name: "Sarah Lin",
    role: "Quant Trader",
    avatar: "/ethereum.png",
    brand: "/vercel.svg",
    quote:
      "Data access is clean and consistent. Streaming quotes with minimal drift let our models react in time.",
    highlight: "<12ms median latency",
    timeframe: "Live",
  },
  {
    id: "t3",
    name: "Diego Alvarez",
    role: "Portfolio Trader",
    avatar: "/Solana.png",
    brand: "/next.svg",
    quote:
      "Risk tools are pragmatic. I can see exposure and act before it becomes a problem. The UI stays out of the way.",
    highlight: "Risk reduced 22%",
    timeframe: "Quarter to date",
  },
  {
    id: "t4",
    name: "Mina Park",
    role: "Algorithmic Trader",
    avatar: "/globe.svg",
    brand: "/file.svg",
    quote:
      "Integration took an afternoon. WebSocket reliability has been boring.",
    highlight: "99.99% uptime",
    timeframe: "Rolling 90d",
  },
  {
    id: "t5",
    name: "Kenji Sato",
    role: "Market Maker",
    avatar: "/Bitcoin.png",
    brand: "/window.svg",
    quote:
      "Order book quality holds up during volatility. We can quote tighter without getting clipped constantly.",
    highlight: "Spread tightened 8bps",
    timeframe: "High vol days",
  },
  {
    id: "t6",
    name: "Olivia Reed",
    role: "Professional Trader",
    avatar: "/ethereum.png",
    brand: "/tradeprime-logo.svg",
    quote:
      "The team sweats details. Micro-interactions make heavy workflows feel light, and clients notice.",
    highlight: "NPS 71",
    timeframe: "This release",
  },
];

export default function TestimonialsSection() {
  return (
    <section
      aria-label="User testimonials"
      className="relative min-h-[100svh] sm:min-h-[80vh] overflow-hidden flex items-center py-10 sm:py-16"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-28 sm:-top-40 left-1/2 h-[240px] w-[420px] sm:h-[360px] sm:w-[640px] lg:h-[420px] lg:w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-b from-neutral-300/10 to-transparent blur-2xl sm:blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_400px_at_50%_-20%,rgba(255,255,255,0.06),transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-900/20 to-neutral-950" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-neutral-100 sm:text-3xl">
            Voices from our community
          </h2>
          <p className="mt-3 text-pretty text-sm text-neutral-400 sm:text-base">
            Real experiences from traders and partners who build with us every day.
          </p>
        </div>

        <ul
          role="list"
          className="mt-8 sm:mt-10 grid auto-rows-fr grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((item) => (
            <li key={item.id} className="h-full">
              <figure
                tabIndex={0}
                aria-label={`Testimonial by ${item.name}`}
                className="group flex h-full flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500/60"
              >
                <blockquote className="text-pretty text-base leading-7 text-neutral-200 sm:text-lg sm:leading-8">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <span className="relative inline-flex">
                    <span className="absolute inset-0 rounded-full bg-white/5 blur-sm" />
                    <span className="relative rounded-full bg-neutral-950 p-0.5 ring-1 ring-white/10">
                      <Image
                        src={item.avatar}
                        alt={`${item.name} avatar`}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                        priority={false}
                      />
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-neutral-100">
                      {item.name}
                    </span>
                    <span className="block truncate text-xs text-neutral-400">{item.role}</span>
                  </span>
                  {item.brand && (
                    <span className="ml-auto opacity-80 transition-opacity group-hover:opacity-100">
                      <Image
                        src={item.brand}
                        alt={`${item.name} brand`}
                        width={24}
                        height={24}
                        className="h-5 w-5 object-contain"
                      />
                    </span>
                  )}
                </figcaption>
                <div className="mt-6 h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}


