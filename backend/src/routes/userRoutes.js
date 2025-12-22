import express from "express";
import { signup, signin, getUserAccount } from "../controllers/userController.js";
import { verifyUserToken } from "../middlewares/userAuth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/user/account", verifyUserToken, getUserAccount);

export default router;