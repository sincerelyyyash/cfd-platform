import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRouter from "./src/routes/user.routes.ts"
import tradeRouter from "./src/routes/trade.routes.ts"
import assetRouter from "./src/routes/asset.routes.ts"
import { startConsumer } from "./src/utils/consumer.ts";

const PORT = process.env.PORT ?? 8000;


const app = express();

// Enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(bodyParser.json());
app.use(cookieParser());

startConsumer();

app.use("/api/v1", userRouter);
app.use("/api/v1", tradeRouter);
app.use("/api/v1", assetRouter);


app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

