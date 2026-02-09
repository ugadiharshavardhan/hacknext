import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { signup, signin, getUserAccount, uploadProfileImage, removeProfileImage, forgotPassword, verifyOtp, resetPassword } from "../controllers/userController.js";
import { verifyUserToken } from "../middlewares/userAuth.js";

const router = express.Router();
console.log("--- userRoutes loaded ---");

const uploadDir = path.join(process.cwd(), "uploads/profile-images");

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg"];
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Invalid file type"), false);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.get("/user/account", verifyUserToken, getUserAccount);

router.post(
  "/user/upload-profile",
  verifyUserToken,
  upload.single("profileImage"),
  uploadProfileImage
);

router.delete(
  "/user/remove-profile",
  verifyUserToken,
  removeProfileImage
);


export default router;
