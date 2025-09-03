import Router from "express"
import { tradeClose, tradeOpen } from "../controllers/trade.controller";

const router = Router();

router.route("/trade/create").post(tradeOpen);
router.route("/trade/close").post(tradeClose);

export default router;
