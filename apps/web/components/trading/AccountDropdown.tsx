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
        <DropdownMenuTrigger >Account</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuItem>Suggest a feature </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Sign Out</DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu></div>
  )
}
