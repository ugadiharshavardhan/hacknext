import express from "express";
import { registerAdmin, loginAdmin } from "../controllers/adminController.js";
import { getAdminAppliedEvents } from "../controllers/applicationController.js";
import { verifyAdmin } from "../middlewares/authorizeAdmin.js";

const router = express.Router();

router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);
router.get("/admin/applied-events", verifyAdmin, getAdminAppliedEvents);

export default router;