import AssetSidebar from "@/components/trading/AssetSidebar"
import Charts from "@/components/trading/Chart"
import TradePositions from "@/components/trading/TradePositions"
import TradingAppbar from "@/components/trading/TradingAppbar"
import TradingModal from "@/components/trading/TradingModal"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

export default function TradingPage() {
  return (
    <div className="h-screen">
      <TradingAppbar />
      <ResizablePanelGroup>
        <ResizablePanel className="w-1/4"><AssetSidebar rows={[]} /></ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="flex-1">
          <div className="h-full flex flex-col">
            <div className="flex-1">
              <Charts />
            </div>
            <div className="h-2" />
            <div className="h-[35%]">
              <TradePositions />
            </div>
          </div>
        </ResizablePanel>
        <ResizablePanel className="w-1/4"><TradingModal /></ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}


