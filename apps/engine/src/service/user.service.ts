import { KafkaRequest } from "@repo/kafka-client/request";
import { OrderStore } from "../Store/OrderStore";
import { UserStore } from "../Store/UserStore";
import { requestProducer, responseProducer } from "./kafkaProducer.service";
import { Response } from "@repo/kafka-client/response";

const userStore = UserStore.getInstance();
const orderStore = OrderStore.getInstance();

export const createUser = async (key: string, data: any) => {
  const { id } = data;

  const existingUser = userStore.getUserById(id);
  if (existingUser) {
    return responseProducer(key, new Response({
      statusCode: 400,
      message: "User already exists",
      success: false,
    }))
  }

  try {
    const user = userStore.addUser(data);
    responseProducer(key, new Response({
      statusCode: 200,
      message: "User created successfully",
      success: true,
      data: user,
    }))

    requestProducer("db", new KafkaRequest({
      service: "db",
      action: "store-new-user",
      data: user,
      message: "Store new user in database."
    }))
    return;
  } catch (err) {
    return responseProducer(key, new Response({
      statusCode: 500,
      message: "Failed to create User.",
      success: false,
      data: (err as Error).message,
    }))
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
  try {
    const user = userStore.getUserById(userId);

    if (!user) {
      return responseProducer(key, new Response({
        statusCode: 404,
        success: false,
        message: "User not found",
      }))
    }

    const balance = user?.balance;
    return responseProducer(key, new Response({
      statusCode: 200,
      success: true,
      message: "Balance fetched successfully",
      data: balance
    }))
  } catch (err) {
    return responseProducer(key, new Response({
      statusCode: 500,
      success: false,
      message: "Failed to get balance.",
      data: (err as Error).message,
    }))
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
    if (allOpenOrders.length < 1 || !allOpenOrders) {
      return responseProducer(key, new Response({
        statusCode: 400,
        success: false,
        message: "No open orders found."
      }))
    }

    return responseProducer(key, new Response({
      statusCode: 200,
      success: true,
      message: "Open orders fetched successfully.",
      data: allOpenOrders,
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

// export const getAllOrders = async()=>{
//
// }
