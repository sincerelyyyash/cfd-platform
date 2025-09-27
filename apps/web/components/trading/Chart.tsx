import CandlestickChart from "./TradingViewChart";

export default function Charts() {
  return (
    <div className="w-full">
      <CandlestickChart data={[]} width={900} height={500} />
    </div>
  );
}


