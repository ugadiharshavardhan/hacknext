import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AdminModel } from "../models/adminModel.js";

export const registerAdmin = async (req, res) => {
  const { email, code } = req.body;
  const AdminRules = z.object({
    email: z.email(),
    code: z.string()
  });

  const AdminData = AdminRules.safeParse({ email, code });
  if (!AdminData.success) return res.status(400).json({ message: "Invalid input" });

  const existingAdmin = await AdminModel.findOne({ email });
  if (existingAdmin) return res.status(400).json({ message: "Email already exists" });

  const hashedAdminCode = await bcrypt.hash(code, 10);
  const newAdmin = await AdminModel.create({ email, code: hashedAdminCode });

  res.status(201).json({ message: "Admin created", admin: newAdmin });
};

export const loginAdmin = async (req, res) => {
  const { email, code } = req.body;
  const isAdminPresent = await AdminModel.findOne({ email });
  if (!isAdminPresent) return res.status(400).json({ message: "Invalid Email" });

  const AdminVerify = await bcrypt.compare(code, isAdminPresent.code);
  if (!AdminVerify) return res.status(400).json({ message: "Invalid CODE" });

  const AdminToken = jwt.sign({ id: isAdminPresent._id }, process.env.SECRET_KEY, { expiresIn: "7d" });
  res.status(200).json({ message: "Login Successful", adminToken: AdminToken });
};

export const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.adminId;
    const admin = await AdminModel.findById(adminId).select('-code');
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ admin });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};