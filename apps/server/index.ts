import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRouter from "./src/routes/user.routes.ts"
import tradeRouter from "./src/routes/trade.routes.ts"
import assetRouter from "./src/routes/asset.routes.ts"


const PORT = process.env.PORT ?? 8000;


const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/v1", userRouter);
app.use("/api/v1", tradeRouter);
app.use("/api/v1", assetRouter);


app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

