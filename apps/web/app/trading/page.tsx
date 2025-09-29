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
    <div className="h-screen">
      <TradingAppbar />
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25}><AssetSidebar /></ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={55}>
              <Charts />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={35}><TradePositions /></ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizablePanel defaultSize={25}><TradingModal /></ResizablePanel>
      </ResizablePanelGroup>

    </div>
  )
}
