import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import type { BenchmarkConfig } from "./config";
import { jsonRequest } from "./http";
import { joinPath } from "./utils";

export type AuthContext = {
  token: string;
  userId: string;
  email: string;
};

const decodeJwtPayload = (token: string): { id?: string; email?: string } => {
  const [, encoded] = token.split(".");
  if (!encoded) {
    return {};
  }
  try {
    const json = Buffer.from(encoded, "base64url").toString("utf8");
    return JSON.parse(json);
  } catch {
    return {};
  }
};

const requestSignup = async (config: BenchmarkConfig, email: string) => {
  try {
    await jsonRequest<{ message: string }>({
      url: joinPath(config.baseUrl, "/signup"),
      method: "POST",
      body: { email },
      timeoutMs: config.requestTimeoutMs,
    });
  } catch {
    // intentionally ignore signup failures (user may already exist)
  }
};

const performSignin = async (config: BenchmarkConfig, email: string, userId: string) => {
  const token = jwt.sign({ id: userId, email }, config.emailTokenSecret, { expiresIn: "10m" });
  const signinUrl = joinPath(config.baseUrl, `/signin/verify?token=${encodeURIComponent(token)}`);
  const response = await jsonRequest<{ sessionToken?: string }>({
    url: signinUrl,
    method: "GET",
    timeoutMs: config.requestTimeoutMs,
  });

  if (!response.ok || !response.data?.sessionToken) {
    throw new Error("Failed to obtain session token");
  }

  return response.data.sessionToken;
};

export const ensureAuthContext = async (config: BenchmarkConfig): Promise<AuthContext> => {
  if (config.sessionToken) {
    const decoded = decodeJwtPayload(config.sessionToken);
    return {
      token: config.sessionToken,
      userId: decoded.id ?? "unknown-user",
      email: decoded.email ?? config.email,
    };
  }

  const email = config.email;
  const userId = randomUUID();
  await requestSignup(config, email);
  const sessionToken = await performSignin(config, email, userId);

  return { token: sessionToken, userId, email };
};

export const bearerHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

