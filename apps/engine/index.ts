import Express from "express";
import { RedisSubscriber } from "./RedisClient";

const PORT = process.env.PORT ?? 3001
const app = Express();

app.use(Express.json());

RedisSubscriber();

app.listen(PORT, () => {
  console.log("Server running on port: " + PORT)
})


