import mongoose from "mongoose";
import { userModel } from "../src/models/userModels.js";
import { config } from "dotenv";
import path from "path";

// Load env vars
config({ path: path.join(process.cwd(), ".env") });

const TEST_EMAIL = "test_forgot_pw@example.com";
const NEW_PASSWORD = "new_secure_password_123";

async function runTest() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/hacknext");
        console.log("Connected to MongoDB");

        // 1. Create/Reset Test User
        await userModel.deleteOne({ email: TEST_EMAIL });
        const user = await userModel.create({
            username: "TestUser",
            email: TEST_EMAIL,
            password: "old_password_123"
        });
        console.log("Test user created:", user.email);

        // 2. Simulate Forgot Password Request (Generate OTP)
        // We can't easily call the controller directly without mocking req/res, 
        // so we'll simulate the logic here to verify the model/DB part.
        // Ideally we'd use supertest for integration tests, but this script is for quick verification.

        console.log("--- Simulating /forgot-password ---");
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();
        console.log(`OTP generated and saved: ${otp}`);

        // 3. Simulate Verify OTP
        console.log("--- Simulating /verify-otp ---");
        const verifyUser = await userModel.findOne({
            email: TEST_EMAIL,
            otp: otp,
            otpExpires: { $gt: Date.now() }
        });

        if (!verifyUser) {
            throw new Error("OTP Verification Failed!");
        }
        console.log("OTP Verified successfully");

        // 4. Simulate Reset Password
        console.log("--- Simulating /reset-password ---");
        // hashing would happen in controller, here we just check if we can update
        verifyUser.password = "hashed_new_password";
        verifyUser.otp = null;
        verifyUser.otpExpires = null;
        await verifyUser.save();

        const finalUser = await userModel.findOne({ email: TEST_EMAIL });
        if (finalUser.otp !== null) {
            throw new Error("OTP not cleared after reset!");
        }
        console.log("Password reset successfully and OTP cleared.");

    } catch (error) {
        console.error("Test Failed:", error);
    } finally {
        await mongoose.disconnect();
    }
}

runTest();
