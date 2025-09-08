import { prisma } from "@repo/database";
import { OrderStore } from "../Store/OrderStore";
import { UserStore } from "../Store/UserStore"
import { offset } from "./kafkaConsumer.service";

const userStore = UserStore.getInstance();
const orderStore = OrderStore.getInstance();

type SnapshotData = {
  userStore: any[];
  orderStore: any[];
  offset: string;
};

export const createSnapshot = async () => {
  const allUsers = Array.from(userStore.getAllUsers());
  const allOpenOrders = Array.from(orderStore.getAllOpenOrders());

  const data: SnapshotData = {
    "userStore": allUsers,
    "orderStore": allOpenOrders,
    "offset": offset,
  }
  try {
    const snapshot = await prisma.snapshot.create({
      data: {
        data
      }
    })

    if (!snapshot) {
      console.log("Snapshot failed");
    }
    console.log("Snapshot: data dump to db successfully.");
  } catch (err) {
    console.error("Error while creating snapshot" + err);
  }
}


export const getDataFromSnapshot = async () => {
  const snapshot = await prisma.snapshot.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!snapshot) {
    console.log("No snapshot found");
    return;
  }

  const data = snapshot.data as SnapshotData;

  const users = data.userStore;
  const orders = data.orderStore;
  const lastOffset = data.offset;

  userStore.addUsersFromScreenshot(users);
  orderStore.addOrdersFromScreenshot(orders);

  console.log(
    "Restored snapshot with",
    users.length,
    "users and",
    orders.length,
    "orders"
  );
  return { users, orders, lastOffset };
};


export const runSnapshotService = async () => {
  setInterval(() => {
    createSnapshot();
  }, 15000)
}
