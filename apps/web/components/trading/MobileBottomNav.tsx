"use client";

type MobileTab = "chart" | "trade" | "markets" | "positions";

interface MobileBottomNavProps {
    activeTab: MobileTab;
    onTabChange: (tab: MobileTab) => void;
}

const tabs: { id: MobileTab; label: string; icon: React.ReactNode }[] = [
    {
        id: "markets",
        label: "Markets",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <path d="M4 4v16h16" strokeLinecap="square" />
                <path d="M8 16l4-6 4 4 4-8" strokeLinecap="square" strokeLinejoin="miter" />
            </svg>
        ),
    },
    {
        id: "chart",
        label: "Chart",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <rect x="3" y="8" width="4" height="12" strokeLinecap="square" />
                <rect x="10" y="4" width="4" height="16" strokeLinecap="square" />
                <rect x="17" y="10" width="4" height="10" strokeLinecap="square" />
            </svg>
        ),
    },
    {
        id: "trade",
        label: "Trade",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <path d="M7 4v16" strokeLinecap="square" />
                <path d="M4 7l3-3 3 3" strokeLinecap="square" strokeLinejoin="miter" />
                <path d="M17 20V4" strokeLinecap="square" />
                <path d="M14 17l3 3 3-3" strokeLinecap="square" strokeLinejoin="miter" />
            </svg>
        ),
    },
    {
        id: "positions",
        label: "Positions",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="square" />
            </svg>
        ),
    },
];

export default function MobileBottomNav({ activeTab, onTabChange }: MobileBottomNavProps) {
    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#08080a] border-t border-white/5 lg:hidden"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
            <div className="flex items-center justify-around h-14">
                {tabs.map((tab) => {
                    const isActive = tab.id === activeTab;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={
                                "relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors duration-200 " +
                                (isActive
                                    ? "text-white"
                                    : "text-neutral-500 active:text-neutral-300")
                            }
                            aria-label={tab.label}
                            aria-pressed={isActive}
                        >
                            {tab.icon}
                            <span className="text-[9px] font-bold uppercase tracking-wider font-space">
                                {tab.label}
                            </span>
                            {isActive && (
                                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-white" />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
