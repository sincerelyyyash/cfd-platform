import { TradeTable } from "./TradeDataTable";

const trades = [
	{
		asset: "BTC",
		bid: "$27,500",
		ask: "$27,520",
	},
	{
		asset: "ETH",
		bid: "$1,750",
		ask: "$1,755",
	},
	{
		asset: "SOL",
		bid: "$22.40",
		ask: "$22.55",
	},
	{
		asset: "XRP",
		bid: "$0.50",
		ask: "$0.51",
	},
	{
		asset: "ADA",
		bid: "$0.27",
		ask: "$0.28",
	},
]


export default function() {
	return (
		<div className="flex flex-col gap-2 bg-slate-950/40 border-t border-slate-900 rounded-lg">
			<div className="flex flex-row justify-between items-center">
				<div className="flex flex-row justify-center gap-2 sm:gap-4 p-3 sm:p-4">
					<button className="px-3 py-2 rounded-md bg-slate-900/60 text-slate-200 hover:bg-slate-900 border border-slate-800">Open</button>
					<button className="px-3 py-2 rounded-md bg-slate-900/60 text-slate-200 hover:bg-slate-900 border border-slate-800">Pending</button>
					<button className="px-3 py-2 rounded-md bg-slate-900/60 text-slate-200 hover:bg-slate-900 border border-slate-800">Closed</button>
				</div>
				<div className="flex flex-row justify-center gap-4 p-3 sm:p-4 text-slate-400">
					<div>Dropdown menu</div>
					<div>x</div>
				</div>
			</div>
			<div className="p-3 sm:p-4">
				<TradeTable data={trades} />
			</div>
		</div>

	)
}
