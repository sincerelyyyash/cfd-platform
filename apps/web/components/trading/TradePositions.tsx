import { TradeTable } from "./TradeDataTable";

const trades = [
  { asset: "BTC", bid: "$27,500", ask: "$27,520" },
  { asset: "ETH", bid: "$1,750", ask: "$1,755" },
  { asset: "SOL", bid: "$22.40", ask: "$22.55" },
  { asset: "XRP", bid: "$0.50", ask: "$0.51" },
  { asset: "ADA", bid: "$0.27", ask: "$0.28" },
];

export default function TradePositions() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row justify-center gap-4 p-4">
          <button className="hover:border p-2 rounded-lg">Open</button>
          <button className="hover:border p-2 rounded-lg">Pending</button>
          <button className="hover:border p-2 rounded-lg">Closed</button>
        </div>
        <div className="flex flex-row justify-center gap-4 p-4">
          <div>Dropdown menu</div>
          <div>x</div>
        </div>
      </div>
      <div className="p-4">
        <TradeTable data={trades} />
      </div>
    </div>

  )
}


