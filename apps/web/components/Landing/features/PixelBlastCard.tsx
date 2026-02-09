"use client";

import dynamic from "next/dynamic";

const PixelBlast = dynamic(() => import("../../ui/PixelBlast"), { ssr: false });

interface PixelBlastCardProps {
    children: React.ReactNode;
    className?: string;
    bgColor?: string;
}

export const PixelBlastCard = ({
    children,
    className = "h-[280px] md:h-[300px]",
    bgColor = "bg-[#111114]",
}: PixelBlastCardProps) => (
    <div className={`relative group flex flex-col p-[1px] ${className}`}>
        <div className="absolute inset-0 z-0">
            <PixelBlast
                variant="square"
                pixelSize={3}
                color="#B19EEF"
                patternDensity={1.2}
                patternScale={2}
                speed={0.4}
                edgeFade={0}
                enableRipples={true}
                rippleIntensityScale={0.5}
            />
        </div>
        <div className={`relative z-10 ${bgColor} w-full flex-1 overflow-hidden transition-all duration-300`}>
            {children}
        </div>
    </div>
);
