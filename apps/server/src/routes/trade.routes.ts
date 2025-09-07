import Router from "express"
import { tradeClose, tradeOpen } from "../controllers/trade.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.route("/trade/create").post(verifyJWT, tradeOpen);
router.route("/trade/close").post(verifyJWT, tradeClose);

export default router;
