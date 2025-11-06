"use client";
import AccountDropDown from "./AccountDropdown";
import AssetButton from "./AssetButton";
import BalanceDropDown from "./BalanceDropdown";
import { useTradeStore } from "@/store/useTradeStore";
import { useAuth } from "@/components/auth/AuthProvider";
import Brand from "@/components/Brand";

export default function TradingAppbar() {
	const selectedAsset = useTradeStore((s) => s.selectedAsset);
	const setSelectedAsset = useTradeStore((s) => s.setSelectedAsset);
	const { signedIn } = useAuth();

	return (
			<div className="sticky top-0 z-30 h-16 sm:h-20 bg-neutral-950 shadow-[0_1px_0_0_rgba(255,255,255,0.03),0_4px_12px_-4px_rgba(0,0,0,0.4)] backdrop-blur supports-[backdrop-filter]:bg-transparent flex items-center px-3 sm:px-4 justify-between">
			<div className="relative z-20 flex items-center gap-2 text-neutral-100">
				<Brand size="lg" showText={true} variant="orbital" className="hidden sm:flex" />
				<span className="sm:hidden">
					<Brand size="lg" showText={false} variant="orbital" />
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
						<div className="rounded-lg bg-neutral-900/30 hover:bg-neutral-800/40 transition-all duration-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
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

