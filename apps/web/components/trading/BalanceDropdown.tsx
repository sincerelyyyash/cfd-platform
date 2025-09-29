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
        <DropdownMenuTrigger >5000 USD</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          {/* <DropdownMenuSeparator /> */}
          <DropdownMenuItem>Balance: </DropdownMenuItem>
          <DropdownMenuItem>Equity: </DropdownMenuItem>
          <DropdownMenuItem>Margin: </DropdownMenuItem>
          <DropdownMenuItem>Free Margin: </DropdownMenuItem>
          <DropdownMenuItem>Margin level: </DropdownMenuItem>
          <DropdownMenuItem>Account Leverage: </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu></div>
  )
}
