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

export function TradeTable({ data, caption = "Open Positions" }: AssetTableProps) {
  return (
    <Table>
      <TableCaption>{caption}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] border-r">Symbol</TableHead>
          <TableHead className="text-right">Type</TableHead>
          <TableHead className="text-right">Volume</TableHead>
          <TableHead className="text-right">Open Price</TableHead>
          <TableHead className="text-right">Current Price</TableHead>
          <TableHead className="text-right">P/L</TableHead>
          <TableHead className="text-right">Open Time</TableHead>
          <TableHead className="text-right">Close Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.asset} className="gap-4">
            <TableCell className="font-medium border-r">{row.asset}</TableCell>
            <TableCell className="text-right">{row.bid}</TableCell>
            <TableCell className="text-right">{row.ask}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}


