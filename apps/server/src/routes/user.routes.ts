import Router from "express";
import { signInUser, signUpUser, getUserBalance, verifySession } from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.route("/signup").post(signUpUser);
router.route("/signin/verify").get(signInUser);
router.route("/auth/verify").get(verifyJWT, verifySession);
router.route("/balance").get(verifyJWT, getUserBalance);

export default router;

