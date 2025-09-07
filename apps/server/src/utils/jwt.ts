import jwt, { type JwtPayload } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

interface DecodedToken extends JwtPayload {
  id: string;
}


export const generateToken = (id: string) => {
  const token = jwt.sign({ id: id }, JWT_SECRET, { expiresIn: "1h" });
  return token
}

export const decodeToken = (token: string) => {
  const decodedToken = jwt.verify(token, JWT_SECRET) as DecodedToken;
  return decodedToken;
}
