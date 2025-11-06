import type { Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { UserAuthSchema } from "../types/auth.types";
import { v4 as uuidv4 } from "uuid";
import { requestProducer } from "../utils/producer";
import { KafkaRequest } from "@repo/kafka-client/request";
import { sendLoginMail } from "../utils/mail";
import { sendRequestAndWait } from "./trade.controller";

const EMAIL_TOKEN_SECRET = process.env.EMAIL_TOKEN_SECRET ?? "email_secret";
const SESSION_SECRET = process.env.SESSION_SECRET ?? "session_secret";
const APP_BASE_URL = process.env.APP_BASE_URL ?? "http://localhost:8000/api/v1";
const FRONTEND_URL = process.env.FRONTEND_URL ?? process.env.WEB_APP_URL ?? "http://localhost:3000";

export const signUpUser = async (req: Request, res: Response) => {
  const parsed = UserAuthSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(403).json({ message: "Invalid inputs" });
  }

  const email = parsed.data.email;
  const id = uuidv4();
  const loginToken = jwt.sign({ id, email }, EMAIL_TOKEN_SECRET, {
    expiresIn: "10m",
  });

  try {
    if (process.env.NODE_ENV === "production") {

      sendLoginMail(email, loginToken);
      return res.json({ message: "Login email sent" });

    } else {

      console.log(`${FRONTEND_URL}/signin?token=${loginToken}`);
      return res.json({ message: "Login link logged to console" });

    }
  } catch {
    return res.status(400).json({ message: "Failed to send email" });
  }
};

export const signInUser = async (req: Request, res: Response) => {
  const token = req.query.token as string;

  if (!token) {
    return res.status(403).json({ message: "No token received" });
  }

  try {
    const { id, email } = jwt.verify(token, EMAIL_TOKEN_SECRET) as JwtPayload;


    let userCreated = false;
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const req_id = uuidv4();
        console.log(`[Server] Attempting to create user ${id} (attempt ${attempt}/${maxRetries})`);
        
        const createUserResponse = await sendRequestAndWait(
          req_id,
          new KafkaRequest({
            service: "user",
            action: "create-user",
            data: { id, email },
            message: "Create user from auth service"
          }),
          10000 // 10 second timeout
        );
        
        console.log(`[Server] User creation response (attempt ${attempt}):`, createUserResponse);
        

        if (createUserResponse?.statusCode === 200 || createUserResponse?.statusCode === 400) {
          userCreated = true;
          break;
        }
      } catch (err) {
        console.log(`[Server] User creation attempt ${attempt} failed:`, (err as Error).message);
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    if (!userCreated) {
      console.warn(`[Server] User ${id} was not created after ${maxRetries} attempts, but continuing with sign-in`);
    }

    const sessionToken = jwt.sign({ id, email }, SESSION_SECRET, {
      expiresIn: "1d",
    });

    if (process.env.NODE_ENV !== "production") {
      console.log("Session token:", sessionToken);
    }

    return res
      .cookie("accessToken", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .json({
        message: "Signed in successfully",
        sessionToken,
      });
  } catch (err) {
    console.error("Sign in error:", err);
    return res.status(403).json({ message: "Invalid or expired link" });
  }
};

export const verifySession = async (req: Request, res: Response) => {
  try {

    const user = (req as any).user;
    return res.json({
      success: true,
      message: "Session is valid",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to verify session", error: (err as Error).message });
  }
};

export const getUserBalance = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const userEmail = (req as any).user.email;
    console.log(`[Server] Getting balance for user: ${userId}`);
    
    let req_id = uuidv4();
    let response = await sendRequestAndWait(
      req_id,
      new KafkaRequest({
        service: "user",
        action: "get-balance",
        data: { userId },
        message: "Get user balance",
      }),
      10000 // 10 second timeout
    );
    
    console.log(`[Server] Balance response received:`, response);
    
    // If user not found (404), try to create them first
    if (response?.statusCode === 404 && userEmail) {
      console.log(`[Server] User ${userId} not found in engine, attempting to create...`);
      
      // Try to create user
      try {
        req_id = uuidv4();
        const createResponse = await sendRequestAndWait(
          req_id,
          new KafkaRequest({
            service: "user",
            action: "create-user",
            data: { id: userId, email: userEmail },
            message: "Create user from balance request",
          }),
          10000
        );
        
        console.log(`[Server] User creation response:`, createResponse);
        
        // If user was created successfully, retry balance request
        if (createResponse?.statusCode === 200 || createResponse?.statusCode === 400) {
          console.log(`[Server] User created, retrying balance request...`);
          req_id = uuidv4();
          response = await sendRequestAndWait(
            req_id,
            new KafkaRequest({
              service: "user",
              action: "get-balance",
              data: { userId },
              message: "Get user balance (retry after creation)",
            }),
            10000
          );
          console.log(`[Server] Balance response after user creation:`, response);
        }
      } catch (createErr) {
        console.error(`[Server] Failed to create user during balance fetch:`, createErr);
        // Continue with original 404 response
      }
    }
    
    // Check if response has error status code
    if (response?.statusCode && response.statusCode >= 400) {
      console.log(`[Server] Balance request failed with status ${response.statusCode}`);
      return res.status(response.statusCode).json(response);
    }
    
    // Return successful response
    return res.json(response);
  } catch (err) {
    console.error(`[Server] Error fetching balance:`, err);
    return res.status(500).json({ 
      message: "Failed to fetch balance", 
      error: (err as Error).message 
    });
  }
};

