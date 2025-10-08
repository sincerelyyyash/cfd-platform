"use client";
import AccountDropDown from "./AccountDropdown";
import AssetButton from "./AssetButton";
import BalanceDropDown from "./BalanceDropdown";
import { useTradeStore } from "@/store/useTradeStore";
import { Button } from "@/components/ui/button";

export default function TradingAppbar() {
	const selectedAsset = useTradeStore((s) => s.selectedAsset);
	const setSelectedAsset = useTradeStore((s) => s.setSelectedAsset);

	return (
			<div className="sticky top-0 z-30 h-16 sm:h-20 bg-neutral-950 shadow-[0_1px_0_0_rgba(255,255,255,0.03),0_4px_12px_-4px_rgba(0,0,0,0.4)] backdrop-blur supports-[backdrop-filter]:bg-transparent flex items-center px-3 sm:px-4 justify-between">
			<div className="relative z-20 flex items-center gap-2 text-neutral-100">
				<span aria-label="TradePrime" role="img" className="inline-flex items-center justify-center ml-2">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="34" height="34" className="opacity-95">
							<rect x="2" y="2" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="1.6"/>
							<path d="M10 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
							<path d="M16 10v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
							<path d="M16 10h4.5a4 4 0 0 1 0 8H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
					</span>
					{/* <span className="text-2xl sm:text-3xl font-semibold tracking-tight">TradePrime</span> */}
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
				<div className="rounded-lg bg-neutral-900/30 hover:bg-neutral-800/40 transition-all duration-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
					<BalanceDropDown />
				</div>
				<Button
					variant="outline"
					aria-label="Manage price alerts"
					className="inline-flex items-center gap-2 px-3 py-2 bg-neutral-900/30 hover:bg-neutral-800/40 border-neutral-800/50 text-zinc-200 hover:text-zinc-100 transition-all duration-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
				>
					{/* Bell icon */}
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-90">
						<path d="M12 3a6 6 0 00-6 6v2.586l-.707.707A1 1 0 006 14h12a1 1 0 00.707-1.707L18 11.586V9a6 6 0 00-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
						<path d="M9 18a3 3 0 006 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
					</svg>
					<span className="hidden sm:inline">Alerts</span>
				</Button>
				<div>
					<AccountDropDown />
				</div>
				<Button
					variant="primary"
					aria-label="Deposit funds"
					className="px-3 sm:px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 hover:text-sky-100 border-sky-500/30 transition-all duration-200 shadow-[inset_0_1px_0_0_rgba(14,165,233,0.3)]"
				>
					Deposit
				</Button>
			</div>
		</div>
	);
}

