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
      className={`flex items-center gap-2 p-2 rounded-lg w-32 justify-center transition-colors
        ${isActive ? "border-b border-2 borer-zinc-900 text-white" : "text-zinc-200 hover:bg-zinc-900"}`}
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

