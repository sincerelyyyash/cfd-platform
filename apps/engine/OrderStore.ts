
type Orders = {
  id: string,
  userId: string,
  type: "long" | "short",
  status: "open" | "closed" | "pending"
  asset: string,
  entryPrice: number,
  leverage?: number,
  margin?: number,
  exitPrice?: number,
  pnL?: number,
  slippage?: number,
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
    // const newOrder: Orders = {
    //   id: uuidv4(),
    //   ...orderData,
    // };

    const newOrder = orderData
    this.orders.set(newOrder.id, newOrder);
    return newOrder;
  }

  closeOrder(orderId: string, userId: string, status: statusType): any {
    return Array.from(this.orders.values()).filter(order => order.userId === userId && order.status === status)
  }

}

