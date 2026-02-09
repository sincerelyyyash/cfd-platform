"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { sonar } from "@/components/ui/sonar";

export default function AccountDropDown() {
  const { setSignedIn } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await fetch("/api/v1/auth/signout", {
        method: "POST",
        credentials: "include",
      }).catch(() => {
      });

      const cookieOptions = [
        "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
        "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax",
        "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure",
      ];

      cookieOptions.forEach(cookie => {
        document.cookie = cookie;
      });

      setSignedIn(false);

      sonar.success("Signed out", "You have been signed out successfully.");

      setTimeout(() => {
        router.push("/signin");
      }, 500);
    } catch (error) {
      setSignedIn(false);
      document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      router.push("/signin");
    }
  };

  return (
    <div className="p-2 width-60">
      <DropdownMenu>
        <DropdownMenuTrigger
          className="text-neutral-400 hover:text-white transition-colors p-2 rounded-[1px] hover:bg-white/5"
          aria-label="Account menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-[#08080a] border-white/5 shadow-2xl min-w-[160px]">
          <DropdownMenuItem
            className="text-neutral-400 hover:text-white hover:bg-white/5 font-space text-xs uppercase tracking-wide cursor-pointer focus:bg-white/5 focus:text-white transition-colors"
            onClick={handleSignOut}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
