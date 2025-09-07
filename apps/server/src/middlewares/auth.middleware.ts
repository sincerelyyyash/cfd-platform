import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

const SESSION_SECRET = process.env.SESSION_SECRET ?? "session_secret";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, SESSION_SECRET) as JwtPayload;
    (req as any).user = decoded;

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

