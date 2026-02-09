import { MessageRequest } from "@repo/redis-client/request";
import { OrderStore } from "../Store/OrderStore";
import { UserStore } from "../Store/UserStore";
import { requestProducer, responseProducer } from "./producer.service";
import { Response } from "@repo/redis-client/response";

const userStore = UserStore.getInstance();
const orderStore = OrderStore.getInstance();

export const createUser = async (key: string, data: any) => {
  const { id } = data;
  console.log(`[Engine] createUser called with key=${key}, id=${id}`);

  const existingUser = userStore.getUserById(id);
  if (existingUser) {
    console.log(`[Engine] User ${id} already exists, returning 400`);
    await responseProducer(key, new Response({
      statusCode: 400,
      message: "User already exists",
      success: false,
    }))
    return;
  }

  try {
    const user = userStore.addUser(data);
    if (!user) {
      throw new Error("Failed to create user in store");
    }
    console.log(`[Engine] User ${id} created in store, balance=${user.balance}`);
    
    const response = new Response({
      statusCode: 200,
      message: "User created successfully",
      success: true,
      data: user,
    });
    
    console.log(`[Engine] Sending response for key=${key}:`, response);
    await responseProducer(key, response);
    console.log(`[Engine] Response sent for key=${key}`);

    await requestProducer("db", new MessageRequest({
      service: "db",
      action: "store-new-user",
      data: user,
      message: "Store new user in database."
    }))
    return;
  } catch (err) {
    console.error(`[Engine] Error creating user ${id}:`, err);
    await responseProducer(key, new Response({
      statusCode: 500,
      message: "Failed to create User.",
      success: false,
      data: (err as Error).message,
    }))
    return;
  }
}

export const getUserById = async (key: string, data: any) => {

  const { userId } = data;
  try {
    const user = userStore.getUserById(userId);
    if (!user) {
      return responseProducer(key, new Response(
        {
          statusCode: 404,
          success: false,
          message: "User not found."
        }
      ));
    }

    return responseProducer(key, new Response({
      statusCode: 200,
      success: true,
      message: "User fetched successfully.",
      data: user,
    }))

  } catch (err) {

    return responseProducer(key, new Response({
      statusCode: 500,
      success: false,
      message: "failed to fetch user.",
      data: (err as Error).message,
    }));

  }
}

export const getUserByEmail = async (key: string, data: any) => {
  const { email } = data;
  try {
    const user = userStore.getUserByEmail(email);
    if (!user) {
      return responseProducer(key, new Response(
        {
          statusCode: 404,
          success: false,
          message: "User not found."
        }
      ));
    }

    return responseProducer(key, new Response({
      statusCode: 200,
      success: true,
      message: "User fetched successfully.",
      data: user,
    }))

  } catch (err) {

    return responseProducer(key, new Response({
      statusCode: 500,
      success: false,
      message: "failed to fetch user.",
      data: (err as Error).message,
    }));

  }
}

export const getUserBalance = async (key: string, data: any) => {
  const { userId } = data;
  console.log(`[Engine] getUserBalance called with key=${key}, userId=${userId}`);
  
  try {
    const user = userStore.getUserById(userId);

    if (!user) {
      console.log(`[Engine] User ${userId} not found in store`);
      await responseProducer(key, new Response({
        statusCode: 404,
        success: false,
        message: "User not found",
      }))
      return;
    }

    const balance = user.balance;
    console.log(`[Engine] User ${userId} balance: ${balance}`);
    
    const response = new Response({
      statusCode: 200,
      success: true,
      message: "Balance fetched successfully",
      data: balance
    });
    
    console.log(`[Engine] Sending balance response for key=${key}:`, response);
    await responseProducer(key, response);
    console.log(`[Engine] Balance response sent for key=${key}`);
    return;
  } catch (err) {
    console.error(`[Engine] Error getting balance for user ${userId}:`, err);
    await responseProducer(key, new Response({
      statusCode: 500,
      success: false,
      message: "Failed to get balance.",
      data: (err as Error).message,
    }))
    return;
  }
}

export const getAllOpenOrders = async (key: string, data: any) => {
  const { userId } = data;
  try {
    const user = userStore.getUserById(userId);
    if (!user) {
      return responseProducer(key, new Response({
        statusCode: 404,
        success: false,
        message: "User not found"
      }))
    }

    const allOpenOrders = orderStore.getOpenOrders(userId);
    return responseProducer(key, new Response({
      statusCode: 200,
      success: true,
      message: "Open orders fetched successfully.",
      data: allOpenOrders || [],
    }))

  } catch (err) {
    return responseProducer(key, new Response({
      statusCode: 500,
      success: false,
      message: "Could not get orders",
      data: (err as Error).message,
    }))
  }
}

export const getAllClosedOrders = async (key: string, data: any) => {
  const { userId } = data;
  try {
    const user = userStore.getUserById(userId);
    if (!user) {
      return responseProducer(key, new Response({
        statusCode: 404,
        success: false,
        message: "User not found"
      }))
    }

    const allClosedOrders = orderStore.getClosedOrders(userId);
    if (!allClosedOrders || allClosedOrders.length < 1) {
      return responseProducer(key, new Response({
        statusCode: 200,
        success: true,
        message: "No closed orders found.",
        data: []
      }))
    }

    return responseProducer(key, new Response({
      statusCode: 200,
      success: true,
      message: "Closed orders fetched successfully.",
      data: allClosedOrders,
    }))

  } catch (err) {
    return responseProducer(key, new Response({
      statusCode: 500,
      success: false,
      message: "Could not get closed orders",
      data: (err as Error).message,
    }))
  }
}
