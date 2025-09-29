import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"

type Asset = {
	asset: string
	bid: string
	ask: string
}

type AssetTableProps = {
	data: Asset[]
	caption?: string
}

export function TradeTable({
	data,
	caption = "Open Positions",
}: AssetTableProps) {
	return (
		<Table className="border border-slate-900/80 rounded-lg overflow-hidden">
			<TableCaption className="text-slate-500">{caption}</TableCaption>
			<TableHeader>
				<TableRow className="bg-slate-950/60">
					<TableHead className="w-[100px] border-r border-slate-900 text-slate-300">Symbol</TableHead>
					<TableHead className="text-right text-slate-300">Type</TableHead>
					<TableHead className="text-right text-slate-300">Volume</TableHead>
					<TableHead className="text-right text-slate-300">Open Price</TableHead>
					<TableHead className="text-right text-slate-300">Current Price</TableHead>
					<TableHead className="text-right text-slate-300">P/L</TableHead>
					<TableHead className="text-right text-slate-300">Open Time</TableHead>
					<TableHead className="text-right text-slate-300">Close Time</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((row) => (
					<TableRow key={row.asset} className="hover:bg-slate-900/40 transition-colors">
						<TableCell className="font-medium border-r border-slate-900 text-slate-200">{row.asset}</TableCell>
						<TableCell className="text-right text-slate-200">{row.bid}</TableCell>
						<TableCell className="text-right text-slate-200">{row.ask}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}

