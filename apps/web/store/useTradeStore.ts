import { create } from "zustand";

interface TradeData {
  event_type: string;
  event_time: number;
  asset: string;
  price: number;
  quantity: number;
  trade_time: number;
  ask: number;
  bid: number;
  decimals: number;
}

interface TradeState {
  trades: Record<string, TradeData>;
  updateTrade: (trade: TradeData) => void;

  selectedAsset: string | "BTCUSDT";
  setSelectedAsset: (asset: string) => void;
}

export const useTradeStore = create<TradeState>((set) => ({
  trades: {},
  updateTrade: (trade) =>
    set((state) => ({
      trades: { ...state.trades, [trade.asset]: trade },
    })),

  selectedAsset: "BTCUSDT",
  setSelectedAsset: (asset) => set(() => ({ selectedAsset: asset })),
}));

