"use client";

import Image from "next/image";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Asset = {
  asset: string;
  bid: string;
  ask: string;
};

type AssetTableProps = {
  data: Asset[];
  caption?: string;
  selectedAsset?: string;
  onSelectAsset?: (asset: string) => void;
};

const assetLogos: Record<string, string> = {
  BTCUSDT: "/Bitcoin.png",
  ETHUSDT: "/Ethereum.png",
  SOLUSDT: "/Solana.png",
};

export function BidAskTable({
  data,
  caption = "Live bid and ask prices for top assets.",
  selectedAsset,
  onSelectAsset,
}: AssetTableProps) {
  return (
    <Table>
      <TableCaption>{caption}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px] border-r">Asset</TableHead>
          <TableHead className="text-right">Bid</TableHead>
          <TableHead className="text-right">Ask</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => {
          const shortName = row.asset.replace("USDT", "");
          const logo = assetLogos[row.asset] || "/default.png";
          const isSelected = row.asset === selectedAsset;

          return (
            <TableRow key={row.asset}>
              <TableCell
                className="font-medium border-r cursor-pointer flex items-center gap-2"
                onClick={() => onSelectAsset?.(row.asset)}
              >
                <Image src={logo} alt={shortName} width={20} height={20} className="rounded-full" />
                <span>{shortName}</span>
              </TableCell>
              <TableCell className={`text-right ${isSelected ? "border-2 border-blue-100 rounded-lg" : ""}`}>
                {row.bid}
              </TableCell>
              <TableCell className={`text-right ${isSelected ? "border-2 border-blue-100 rounded-lg" : ""}`}>
                {row.ask}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}


