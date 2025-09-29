"use client";
import AccountDropDown from "./AccountDropdown";
import AssetButton from "./AssetButton";
import BalanceDropDown from "./BalanceDropdown";
import { useTradeStore } from "@/store/useTradeStore";

export default function TradingAppbar() {
	const selectedAsset = useTradeStore((s) => s.selectedAsset);
	const setSelectedAsset = useTradeStore((s) => s.setSelectedAsset);

	return (
		<div className="h-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60 flex items-center px-4 justify-between">
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
					imageURL="/Ethereum.png"
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

			<div className="flex items-center gap-4">
				<div className="rounded-lg hover:bg-slate-900/70 border border-transparent hover:border-slate-800 transition-colors">
					<BalanceDropDown />
				</div>
				<div className="text-slate-300">Price Alert</div>
				<div>
					<AccountDropDown />
				</div>
				<button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors">
					Deposit
				</button>
			</div>
		</div>
	);
}

