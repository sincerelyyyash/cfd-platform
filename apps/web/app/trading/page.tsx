import AssetSidebar from "@/components/trading/AssetSidebar"
import Charts from "@/components/trading/Chart"
import TradePositions from "@/components/trading/TradePositions"
import TradingAppbar from "@/components/trading/TradingAppbar"
import TradingModal from "@/components/trading/TradingModal"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function TradingPage() {
  return (
    <div className="h-screen bg-black">
      <TradingAppbar />
      <div className="flex h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)]">
        <div className="flex-1 min-w-0">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={38} minSize={28} maxSize={55}>
              <div className="min-w-[300px] md:min-w-[340px] lg:min-w-[380px] xl:min-w-[420px] h-full">
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
        <div className="w-[360px] shrink-0 border-l border-neutral-900">
          <TradingModal />
        </div>
      </div>

    </div>
  )
}
