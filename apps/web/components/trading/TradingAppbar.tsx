"use client";
import AccountDropDown from "./AccountDropdown";
import AssetButton from "./AssetButton";
import BalanceDropDown from "./BalanceDropdown";
import { useTradeStore } from "@/store/useTradeStore";
import { useAuth } from "@/components/auth/AuthProvider";

export default function TradingAppbar() {
	const selectedAsset = useTradeStore((s) => s.selectedAsset);
	const setSelectedAsset = useTradeStore((s) => s.setSelectedAsset);
	const { signedIn } = useAuth();

	return (
		<div className="sticky top-0 z-30 h-16 sm:h-20 bg-[#08080a] border-b border-white/5 flex items-center px-6 justify-between">
			<div className="relative z-20 flex items-center gap-2 text-neutral-100">
				<span className="inline-flex items-center gap-1.5 bg-[#B19EEF]/15 border border-[#B19EEF]/30 px-2.5 py-0.5">
					<span className="text-[#B19EEF] text-sm md:text-base font-bold leading-none">
						✱
					</span>
					<span className="text-[#B19EEF] text-xs md:text-sm font-semibold tracking-widest font-space">
						AXIS
					</span>
				</span>
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

			<div className="flex items-center gap-2 sm:gap-3 min-w-[200px] justify-end">
				{signedIn ? (
					<>
						<div className="bg-neutral-900/30 hover:bg-neutral-800/40 transition-all duration-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
							<BalanceDropDown />
						</div>
						<div>
							<AccountDropDown />
						</div>
					</>
				) : null}
			</div>
		</div>
	);
}

