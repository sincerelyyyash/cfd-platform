import Router from "express"
import { tradeClose, tradeOpen, listOpenOrders, listClosedOrders } from "../controllers/trade.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.route("/trade/create").post(verifyJWT, tradeOpen);
router.route("/trade/close").post(verifyJWT, tradeClose);
router.route("/trade/open").get(verifyJWT, listOpenOrders);
router.route("/trade/closed").get(verifyJWT, listClosedOrders);

export default router;
