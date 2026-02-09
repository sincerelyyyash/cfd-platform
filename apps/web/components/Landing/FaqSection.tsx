"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus, Minus } from "lucide-react";

import { PixelBlastCard } from "./features";

gsap.registerPlugin(ScrollTrigger);

const FAQS = [
    {
        question: "What assets can I trade on AXIS?",
        answer: "AXIS currently supports major cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), and Solana (SOL). We are continuously expanding our market offerings based on liquidity and user demand.",
    },
    {
        question: "How does the leverage system work?",
        answer: "You can trade with configurable leverage up to 50x depending on the asset. Leverage allows you to open larger positions with a smaller initial margin. However, please note that higher leverage also increases risk.",
    },
    {
        question: "Are there any trading fees?",
        answer: "We offer competitive fee structures with low spreads. There are no deposit fees. Trading fees are calculated based on your 30-day trading volume, with rebates available for high-volume market makers.",
    },
    {
        question: "How is my account secured?",
        answer: "We employ industry-standard security measures including cold storage for assets, real-time risk monitoring, and strict withdrawal whitelisting. Our infrastructure is built to protect user funds and data at all times.",
    },
    {
        question: "What is the minimum deposit?",
        answer: "There is no minimum deposit requirement to open an account. You can start trading with as little as $10, making AXIS accessible for traders of all levels.",
    },
];

export const FaqSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    useGSAP(
        () => {
            gsap.fromTo(
                ".faq-header",
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                    },
                }
            );

            gsap.fromTo(
                ".faq-item",
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".faq-list",
                        start: "top 80%",
                    },
                }
            );
        },
        { scope: sectionRef }
    );

    return (
        <section
            ref={sectionRef}
            id="faq"
            className="relative w-full bg-[#08080a] py-24 md:py-32 border-t border-white/[0.06]"
        >
            <div className="absolute right-0 top-0 w-[500px] h-[500px] rounded-full bg-[#B19EEF]/[0.02] blur-[120px]" />

            <div className="relative z-10 max-w-3xl mx-auto px-6">
                <div className="faq-header text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-8 h-px bg-[#B19EEF]/40" />
                        <span className="text-[11px] text-[#B19EEF] font-space tracking-[0.2em] uppercase">
                            FAQ
                        </span>
                        <div className="w-8 h-px bg-[#B19EEF]/40" />
                    </div>

                    <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.03em] text-white font-space">
                        Frequently asked questions
                    </h2>
                </div>

                <PixelBlastCard className="w-full h-auto" bgColor="bg-[#08080a]">
                    <div className="faq-list">
                        {FAQS.map((faq, index) => (
                            <div
                                key={index}
                                className={`faq-item w-full transition-all duration-300 border-b border-white/[0.06] last:border-0 ${openIndex === index ? "bg-white/[0.02]" : "bg-transparent hover:bg-white/[0.01]"}`}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left relative z-20"
                                >
                                    <span className={`text-[15px] font-space font-medium transition-colors duration-300 ${openIndex === index ? "text-white" : "text-neutral-400"
                                        }`}>
                                        {faq.question}
                                    </span>
                                    <div className={`ml-4 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}>
                                        {openIndex === index ? (
                                            <Minus className="w-4 h-4 text-[#B19EEF]" />
                                        ) : (
                                            <Plus className="w-4 h-4 text-neutral-500" />
                                        )}
                                    </div>
                                </button>
                                <div
                                    className={`grid transition-all duration-300 ease-in-out relative z-20 ${openIndex === index
                                        ? "grid-rows-[1fr] opacity-100"
                                        : "grid-rows-[0fr] opacity-0"
                                        }`}
                                >
                                    <div className="overflow-hidden">
                                        <div className="p-6 pt-0 text-[14px] text-neutral-500 font-ibm-plex-sans leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </PixelBlastCard>
            </div>
        </section>
    );
};
