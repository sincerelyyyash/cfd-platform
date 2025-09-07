import type { Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { UserAuthSchema } from "../types/auth.types";

const EMAIL_TOKEN_SECRET = process.env.EMAIL_TOKEN_SECRET ?? "email_secret";
const SESSION_SECRET = process.env.SESSION_SECRET ?? "session_secret";
const APP_BASE_URL = process.env.APP_BASE_URL ?? "http://localhost:8000/api/v1";

export const signUpUser = async (req: Request, res: Response) => {
  const parsed = UserAuthSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(403).json({ message: "Invalid inputs" });
  }

  const email = parsed.data.email;
  const loginToken = jwt.sign({ email }, EMAIL_TOKEN_SECRET, {
    expiresIn: "10m",
  });

  try {
    if (process.env.NODE_ENV === "production") {
      return res.json({ message: "Login email sent" });
    } else {
      console.log(
        `${APP_BASE_URL}/signin/verify?token=${loginToken}`
      );
      return res.json({ message: "Login link logged to console" });
    }
  } catch (err) {
    return res.status(400).json({ message: "Failed to send email" });
  }
};

export const signInUser = async (req: Request, res: Response) => {
  const token = req.query.token as string;

  if (!token) {
    return res.status(403).json({ message: "No token received" });
  }

  try {
    const { email } = jwt.verify(token, EMAIL_TOKEN_SECRET) as JwtPayload;
    const userId = email;

    const sessionToken = jwt.sign(
      { email, userId },
      SESSION_SECRET,
      { expiresIn: "1d" }
    );

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
        ...(process.env.NODE_ENV !== "production" ? { sessionToken } : {})
      });
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired link" });
  }
};

