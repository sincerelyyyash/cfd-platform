"use client";

import { BidAskTable } from "./BidAskTable";
import SearchBar from "./SearchBar";

type TradeRow = {
  asset: string;
  bid: string;
  ask: string;
};

type Props = {
  rows: TradeRow[];
  selectedAsset?: string;
  onSelectAsset?: (asset: string) => void;
};

export default function AssetSidebar({ rows, selectedAsset, onSelectAsset }: Props) {
  return (
    <div className="flex flex-col p-6">
      <div className="flex flex-row justify-between py-4 text-zinc-100 font-bold tracking-wide">
        <div>Instruments</div>
        <div>x</div>
      </div>

      <div className="py-4">
        <SearchBar />
      </div>

      <div>
        {rows.length > 0 ? (
          <BidAskTable data={rows} selectedAsset={selectedAsset} onSelectAsset={onSelectAsset} />
        ) : (
          <p className="text-zinc-400 text-sm">Waiting for live data...</p>
        )}
      </div>
    </div>
  );
}


