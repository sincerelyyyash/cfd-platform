import type { Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { sendLoginMail } from "../utils/mail";
import { UserAuthSchema } from "../types/auth.types";
import { Queue } from "bullmq";

const usersQueue = new Queue("users", {
  connection: {
    host: '127.0.0.1',
    port: 6379,
  },
});

async function addUsersToQueue(userId: string) {
  await usersQueue.add("users", userId);
}


const JWT_SECRET = process.env.JWT_SECRET ?? "Secret_password"

export const signUpUser = async (req: Request, res: Response) => {
  const parsed = UserAuthSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(403).json({
      message: "Invalid inputs, please try again."
    })
  }

  const email = parsed.data.email;

  const token = jwt.sign({ email: email }, JWT_SECRET)

  try {
    sendLoginMail(email, token);
  } catch (err) {
    return res.status(400).json({
      message: "Failed to sign in.",
      error: (err as Error).message,
    })
  }

}

export const signInUser = async (req: Request, res: Response) => {
  const token = req.query.token as string;


  if (!token) {
    return res.status(403).json({
      message: "no token received"
    })
  }
  try {
    const { email } = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const accessToken = jwt.sign({ email: email }, JWT_SECRET);

    return res.cookie("token", accessToken).json({
      message: "Sign in successfull"
    })

  } catch (err) {
    return res.status(500).json({
      message: "Internal server error, please try again."
    })
  }

}

export const getUsdBalance = async (req: Request, res: Response) => {
  const user = (req as any).user;

  const userId = user.userId;

  // try{
  //   await
  // }
}

export const getAllAssetsBalance = async (req: Request, res: Response) => {
  const user = (req as any).user;
  // const 

}
