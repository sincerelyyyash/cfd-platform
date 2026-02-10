"use client";
import { useState } from "react";
import AssetSidebar from "@/components/trading/AssetSidebar"
import Charts from "@/components/trading/Chart"
import TradePositions from "@/components/trading/TradePositions"
import TradingAppbar from "@/components/trading/TradingAppbar"
import TradingModal from "@/components/trading/TradingModal"
import MobileBottomNav from "@/components/trading/MobileBottomNav"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
export const dynamic = 'force-dynamic';

type MobileTab = "chart" | "trade" | "markets" | "positions";

export default function TradingPage() {
  const [mobileTab, setMobileTab] = useState<MobileTab>("chart");

  return (
    <div className="h-screen bg-[#08080a]">
      <TradingAppbar />

      <div className="hidden lg:flex h-[calc(100vh-5rem)]">
        <div className="flex-1 min-w-0">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={26} minSize={24} maxSize={33}>
              <div className="min-w-[180px] md:min-w-[204px] lg:min-w-[228px] xl:min-w-[252px] h-full">
                <AssetSidebar />
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>
              <ResizablePanelGroup direction="vertical" id="charts-positions-group">
                <ResizablePanel defaultSize={60}>
                  <div className="min-w-0">
                    <Charts />
                  </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={40}><TradePositions /></ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        <div className="w-[360px] shrink-0 bg-[#08080a] shadow-[inset_1px_0_0_0_rgba(255,255,255,0.03)]">
          <TradingModal />
        </div>
      </div>

      <div className="lg:hidden flex flex-col h-[calc(100vh-3.5rem)] pb-14">
        <div className="flex-1 min-h-0 overflow-y-auto">
          {mobileTab === "chart" && <Charts />}
          {mobileTab === "trade" && <TradingModal />}
          {mobileTab === "markets" && <AssetSidebar />}
          {mobileTab === "positions" && <TradePositions />}
        </div>
      </div>

      <MobileBottomNav activeTab={mobileTab} onTabChange={setMobileTab} />
    </div>
  )
}
