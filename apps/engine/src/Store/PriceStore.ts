export interface PriceData {
  price: number;
  decimal: number;
  timestamp: number;
  offset: string;
}

export const prices = new Map<string, PriceData>();

export const updatePrice = (asset: string, price: number, decimal: number, timestamp: number, offset: string) => {
  prices.set(asset, { price, decimal, timestamp, offset });
};

export const getPrice = (asset: string): PriceData | undefined => {
  return prices.get(asset);
};
