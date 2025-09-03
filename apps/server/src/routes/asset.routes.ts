import Router from "express"
import { getSupportedAssets } from "../controllers/asset.controller.ts"


const router = Router();

router.route("/supported-asset").get(getSupportedAssets);

export default router
