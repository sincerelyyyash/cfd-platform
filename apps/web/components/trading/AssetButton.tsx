"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type ButtonProps = {
  imageURL: string;
  text: string;
  isActive?: boolean;
  onClickAction: () => void;
};

export default function AssetButton({
  imageURL,
  text,
  isActive,
  onClickAction,
}: ButtonProps) {
  return (
    <Button
      onClick={onClickAction}
      variant="ghost"
      className={`w-36 gap-3 px-4 py-2 font-bitcount rounded-[1px] text-sm uppercase tracking-wide transition-all duration-300 border ${isActive
        ? "bg-[#B19EEF] hover:bg-[#9f85e8] text-black border-transparent font-bold hover:scale-[1.02]"
        : "bg-transparent hover:bg-white/[0.05] text-neutral-400 font-medium border-white/10 hover:border-white/20 hover:text-white"
        }`}
      aria-pressed={isActive}
    >
      <Image
        src={imageURL}
        alt={text}
        width={20}
        height={20}
        className="rounded-full"
      />
      <span>{text}</span>
    </Button>
  );
}

