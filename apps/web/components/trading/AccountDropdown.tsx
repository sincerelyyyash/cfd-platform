import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AccountDropDown() {
  return (
    <div className="p-2 width-60">
      <DropdownMenu >
        <DropdownMenuTrigger className="text-zinc-100 hover:text-zinc-200 transition-colors">Account</DropdownMenuTrigger>
        <DropdownMenuContent className="bg-neutral-900/95 border-neutral-800/50 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.4)]">
          <DropdownMenuLabel className="text-zinc-100">My Account</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-neutral-800/50" />
          <DropdownMenuItem className="text-zinc-200 hover:bg-neutral-800/50">Support</DropdownMenuItem>
          <DropdownMenuItem className="text-zinc-200 hover:bg-neutral-800/50">Suggest a feature </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-neutral-800/50" />
          <DropdownMenuItem className="text-zinc-200 hover:bg-neutral-800/50">Sign Out</DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu></div>
  )
}
