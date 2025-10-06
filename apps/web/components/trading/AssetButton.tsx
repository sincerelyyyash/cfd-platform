"use client";
import Image from "next/image";

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
    <button
      onClick={onClickAction}
      className={`flex items-center gap-2 p-2 rounded-lg w-32 justify-center transition-colors border
        ${isActive ? "border-slate-900 bg-black/70 text-zinc-200" : "border-slate-900/60 bg-black/30 text-slate-200 hover:bg-black/60"}`}
    >
      <Image
        src={imageURL}
        alt={text}
        width={24}
        height={24}
        className="rounded-full"
      />
      <span>{text}</span>
    </button>
  );
}

