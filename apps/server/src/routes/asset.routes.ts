import Router from "express"
import { getSupportedAssets } from "../controllers/asset.controller.ts"
import { getCandles } from "../controllers/asset.controller.ts"


const router = Router();

router.route("/supported-asset").get(getSupportedAssets);
router.route("/candles").get(getCandles);

export default router
