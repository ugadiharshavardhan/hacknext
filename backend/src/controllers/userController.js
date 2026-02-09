import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import { v2 as cloudinary } from "cloudinary";
import { userModel } from "../models/userModels.js";
import { sendEmail } from "../utils/email.js";
import { getWelcomeEmailTemplate, getOtpEmailTemplate } from "../utils/emailTemplates.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});


export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const UserRules = z.object({
    username: z.string().min(4).max(20),
    email: z.email(),
    password: z.string().min(6).max(15)
  });

  const parsedData = UserRules.safeParse({ username, email, password });
  if (!parsedData.success) {
    const errors = parsedData.error.errors.map(err => `${err.path[0]}: ${err.message}`).join(', ');
    return res.status(400).json({ message: `Validation failed: ${errors}` });
  }

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await userModel.create({
    username,
    email,
    password: hashedPassword
  });

  // Send Welcome Email
  try {
    console.log(`Attempting to send welcome email to: ${email}`);
    const htmlContent = getWelcomeEmailTemplate(username);
    const emailSent = await sendEmail({
      to: email,
      subject: "Welcome to HackNext!",
      htmlContent: htmlContent
    });

    if (!emailSent) {
      console.error(`Failed to send welcome email to ${email} (sendEmail returned false). Check server logs for Brevo API response.`);
    } else {
      console.log(`Welcome email successfully sent to ${email}`);
    }
  } catch (emailError) {
    console.error("Exception while sending welcome email:", emailError);
    // Continue execution, do not fail the request
  }

  res.status(201).json({ message: "User created", result: newUser });
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  const isUserPresent = await userModel.findOne({ email });
  if (!isUserPresent) return res.status(400).json({ message: "Invalid email" });

  const verification = await bcrypt.compare(password, isUserPresent.password);
  if (!verification) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ id: isUserPresent._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.status(200).json({ message: "Signin successful", jwt_token: token });
};

// export const getUserAccount = async (req, res) => {
//   try {
//     // Get fresh user data from database
//     const user = await userModel.findById(req.user._id).select('-password');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json({
//       userDetails: user,
//     });
//   } catch (error) {
//     console.error("Error fetching user account:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

export const getUserAccount = async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");

    const user = await userModel
      .findById(req.user._id)
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      userDetails: user,
    });
  } catch (error) {
    console.error("Error fetching user account:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    if (!req.user?._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Check for existing profile image and delete it
    try {
      const existingUser = await userModel.findById(req.user._id);
      if (existingUser?.profileImage) {
        // Extract public_id using regex to handle versions and folders correctly
        // Matches: .../upload/(optional version)/ (captured public_id) .extension
        const publicIdMatch = existingUser.profileImage.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);

        if (publicIdMatch && publicIdMatch[1]) {
          const publicId = publicIdMatch[1];
          console.log(`Attempting to delete old image. URL: ${existingUser.profileImage}, Extracted Public ID: ${publicId}`);

          const result = await cloudinary.uploader.destroy(publicId);
          console.log(`Cloudinary destroy result: ${JSON.stringify(result)}`);
        } else {
          console.warn(`Could not extract public_id from URL: ${existingUser.profileImage}`);
        }
      }
    } catch (err) {
      console.warn("Old profile image deletion skipped:", err.message);
      // Continue with upload even if deletion fails
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "hackathon-profiles",
      width: 300,
      height: 300,
      crop: "fill"
    });

    const user = await userModel.findByIdAndUpdate(
      req.user._id,
      { profileImage: result.secure_url },
      { new: true, select: "-password" }
    );

    // SAFE DELETE
    try {
      await fs.unlink(req.file.path);
    } catch (err) {
      console.warn("File cleanup skipped:", err.message);
    }

    return res.status(200).json({
      success: true,
      profileImage: user.profileImage
    });

  } catch (error) {
    console.error("Profile upload error:", error);

    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (err) {
        console.warn("Cleanup failed:", err.message);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Error uploading profile image"
    });
  }
};

// REMOVE PROFILE IMAGE
export const removeProfileImage = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.profileImage) {
      const publicId = user.profileImage
        .split("/")
        .pop()
        .split(".")[0];

      try {
        await cloudinary.uploader.destroy(`hackathon-profiles/${publicId}`);
      } catch (err) {
        console.warn("Cloudinary delete skipped:", err.message);
      }
    }

    // Remove from DB
    user.profileImage = "";
    await user.save();

    return res.status(200).json({
      message: "Profile image removed successfully",
    });
  } catch (error) {
    console.error("Remove image error:", error);
    return res.status(500).json({
      message: "Server error while removing profile image",
    });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    console.log(`Sending OTP ${otp} to ${email}`);

    // Send OTP Email
    const htmlContent = getOtpEmailTemplate(user.username, otp);

    const emailSent = await sendEmail({
      to: email,
      subject: "Password Reset OTP - HackNext",
      htmlContent: htmlContent
    });

    if (emailSent) {
      return res.status(200).json({ message: "OTP sent to your email" });
    } else {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// VERIFY OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const user = await userModel.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    return res.status(200).json({ message: "OTP verified successfully" });

  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "Email, OTP, and new password are required" });
  }

  try {
    const user = await userModel.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });

  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
