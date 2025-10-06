import { Search } from "lucide-react"

export default function SearchBar() {
	return (
		<div className="border border-slate-800 bg-black/60 rounded-lg flex items-center w-full px-2 py-1 h-10 focus-within:ring-2 focus-within:ring-neutral-400/40">
			<Search className="w-4 h-4 text-slate-400 mr-2" />
			<input
				type="text"
				placeholder="Search assets..."
				className="w-full bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-500"
				aria-label="Search assets"
			/>
		</div>
	)
}

