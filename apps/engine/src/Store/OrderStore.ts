
export type Orders = {
  id: string,
  userId: string,
  type: "long" | "short",
  status: "open" | "closed" | "pending"
  asset: string,
  quantity: number,
  entryPrice: number,
  leverage?: number,
  margin?: number,
  exitPrice?: number,
  pnL?: number,
  slippage?: number,
  stopLoss?: number,
  takeProfit: number,
  liquidated?: boolean,
}


export enum statusType {
  open = "open",
  closed = "closed",
  pending = "pending",
}



export class OrderStore {
  private static instance: OrderStore;
  private orders: Map<string, Orders> = new Map();

  private constructor() { }


  public static getInstance(): OrderStore {
    if (!OrderStore.instance) {
      OrderStore.instance = new OrderStore();
    }
    return OrderStore.instance;
  }

  createOrder(orderData: any): Orders {

    const newOrder = orderData
    this.orders.set(newOrder.id, newOrder);
    return newOrder;
  }

  closeOrder(order: Orders, exitPrice: number, pnL: number, liquidated: boolean) {
    order.status = statusType.closed;
    order.exitPrice = exitPrice;
    order.pnL = pnL;
    order.liquidated = liquidated

  }

  getAllOpenOrders() {
    return Array.from(this.orders.values()).filter(order => order.status === statusType.open);
  }
  getOpenOrders(userId: string) {
    return Array.from(this.orders.values()).filter(order => order.userId === userId && order.status === statusType.open);
  }

  getClosedOrders(userId: string) {
    return Array.from(this.orders.values()).filter(order => order.userId === userId && order.status === statusType.closed)
  }

  getOrderById(orderId: string) {
    const order = this.orders.get(orderId);
    return order
  }

  addOrdersFromScreenshot(data: [string, Orders][]) {
    for (const [key, value] of data) {
      this.orders.set(key, value);
    }
  }

}

