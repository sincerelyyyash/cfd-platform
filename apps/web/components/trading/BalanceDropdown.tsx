import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function BalanceDropDown() {
  return (
    <div className="p-2 width-60">
      <DropdownMenu >
        <DropdownMenuTrigger className="text-zinc-100 hover:text-zinc-200 transition-colors">5000 USD</DropdownMenuTrigger>
        <DropdownMenuContent className="bg-neutral-900/95 border-neutral-800/50 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.4)]">
          <DropdownMenuLabel className="text-zinc-100">My Account</DropdownMenuLabel>
          {/* <DropdownMenuSeparator /> */}
          <DropdownMenuItem className="text-zinc-200 hover:bg-neutral-800/50">Balance: </DropdownMenuItem>
          <DropdownMenuItem className="text-zinc-200 hover:bg-neutral-800/50">Equity: </DropdownMenuItem>
          <DropdownMenuItem className="text-zinc-200 hover:bg-neutral-800/50">Margin: </DropdownMenuItem>
          <DropdownMenuItem className="text-zinc-200 hover:bg-neutral-800/50">Free Margin: </DropdownMenuItem>
          <DropdownMenuItem className="text-zinc-200 hover:bg-neutral-800/50">Margin level: </DropdownMenuItem>
          <DropdownMenuItem className="text-zinc-200 hover:bg-neutral-800/50">Account Leverage: </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu></div>
  )
}
