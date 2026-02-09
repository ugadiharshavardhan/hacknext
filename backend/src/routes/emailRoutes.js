import express from "express";
import { testWelcomeEmail, testSuccessEmail } from "../controllers/emailController.js";

const router = express.Router();

router.post("/test-welcome", testWelcomeEmail);
router.post("/test-success", testSuccessEmail);

export default router;
