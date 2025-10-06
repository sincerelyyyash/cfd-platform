"use client";
import AccountDropDown from "./AccountDropdown";
import AssetButton from "./AssetButton";
import BalanceDropDown from "./BalanceDropdown";
import { useTradeStore } from "@/store/useTradeStore";

export default function TradingAppbar() {
	const selectedAsset = useTradeStore((s) => s.selectedAsset);
	const setSelectedAsset = useTradeStore((s) => s.setSelectedAsset);

	return (
		<div className="sticky top-0 z-30 h-16 sm:h-20 border-b border-neutral-900 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/60 flex items-center px-3 sm:px-4 justify-between">
			<div className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-xl font-bold text-transparent sm:text-4xl">
				TradePrime
			</div>

			<div className="flex items-center gap-3 sm:gap-4">
				<AssetButton
					imageURL="/Bitcoin.png"
					text="BTC"
					isActive={selectedAsset === "BTCUSDT"}
					onClickAction={() => setSelectedAsset("BTCUSDT")}
				/>
				<AssetButton
					imageURL="/ethereum.png"
					text="ETH"
					isActive={selectedAsset === "ETHUSDT"}
					onClickAction={() => setSelectedAsset("ETHUSDT")}
				/>
				<AssetButton
					imageURL="/Solana.png"
					text="SOL"
					isActive={selectedAsset === "SOLUSDT"}
					onClickAction={() => setSelectedAsset("SOLUSDT")}
				/>
			</div>

			<div className="flex items-center gap-2 sm:gap-3">
				<div className="rounded-lg border border-neutral-900 bg-black/40 hover:bg-black/60 transition-colors">
					<BalanceDropDown />
				</div>
				<button
					type="button"
					aria-label="Manage price alerts"
					className="inline-flex items-center gap-2 rounded-lg border border-neutral-900 bg-black/40 px-3 py-2 text-zinc-300 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-neutral-600/40"
				>
					{/* Bell icon */}
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-90">
						<path d="M12 3a6 6 0 00-6 6v2.586l-.707.707A1 1 0 006 14h12a1 1 0 00.707-1.707L18 11.586V9a6 6 0 00-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
						<path d="M9 18a3 3 0 006 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
					</svg>
					<span className="hidden sm:inline">Alerts</span>
				</button>
				<div>
					<AccountDropDown />
				</div>
				<button
					className="px-3 sm:px-4 py-2 rounded-lg border border-emerald-700/60 bg-emerald-600/15 text-emerald-300 hover:bg-emerald-700/25 focus:outline-none focus:ring-2 focus:ring-emerald-600/40"
				>
					Deposit
				</button>
			</div>
		</div>
	);
}

