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
      variant={isActive ? "secondary" : "outline"}
      className={`w-32 gap-2 px-3 py-2 !font-medium ${isActive ? "ring-0" : ""}`}
      aria-pressed={isActive}
    >
      <Image
        src={imageURL}
        alt={text}
        width={24}
        height={24}
        className="rounded-full"
      />
      <span>{text}</span>
    </Button>
  );
}

