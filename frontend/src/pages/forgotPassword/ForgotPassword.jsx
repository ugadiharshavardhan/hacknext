import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaCode, FaEnvelope, FaLock, FaKey, FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ForgotPassword() {
    const navigate = useNavigate();

    // Steps: 1 = Email, 2 = OTP, 3 = New Password
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleHome = () => navigate("/", { replace: true });

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) return toast.error("Please enter your email");

        setLoading(true);
        try {
            const response = await fetch("http://localhost:5678/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setStep(2);
            } else {
                toast.error(data.message || "Failed to send OTP");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp) return toast.error("Please enter the OTP");

        setLoading(true);
        try {
            const response = await fetch("http://localhost:5678/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setStep(3);
            } else {
                toast.error(data.message || "Invalid OTP");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        if (newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        setLoading(true);
        try {
            const response = await fetch("http://localhost:5678/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message); // "Password reset successfully"
                setStep(1); // Reset step (optional, or navigate)
                setEmail("");
                setOtp("");
                setNewPassword("");
                setConfirmPassword("");
                navigate("/signin", { replace: true });
            } else {
                toast.error(data.message || "Failed to reset password");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[#0f1225] to-[#14172e] relative flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/30"></div>

            {/* Header */}
            <header onClick={handleHome} className="absolute cursor-pointer top-6 left-6 z-20">
                <div className="flex items-center gap-2">
                    <FaCode size={34} className="text-indigo-400" />
                    <h1 className="text-2xl md:text-3xl font-bold text-white">HackNext</h1>
                </div>
                <button
                    onClick={handleHome}
                    className="mt-2 text-sm px-4 py-1 rounded-lg border border-white/20 text-gray-200 hover:border-white/40 transition"
                >
                    Back
                </button>
            </header>

            <div className="relative z-10 w-full max-w-[400px]">
                <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">

                    <h2 className="text-2xl font-bold text-white text-center mb-2">
                        {step === 1 && "Forgot Password"}
                        {step === 2 && "Enter OTP"}
                        {step === 3 && "Reset Password"}
                    </h2>

                    <p className="text-gray-400 text-center text-sm mb-6">
                        {step === 1 && "Enter your email to receive a 6-digit OTP code."}
                        {step === 2 && `We sent a code to ${email}. Check your inbox.`}
                        {step === 3 && "Create a new strong password for your account."}
                    </p>

                    <form onSubmit={step === 1 ? handleSendOtp : step === 2 ? handleVerifyOtp : handleResetPassword}>

                        {/* Step 1: Email */}
                        {step === 1 && (
                            <div>
                                <label className="text-gray-300 text-xs font-semibold mb-1 block">EMAIL ADDRESS</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <FaEnvelope />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/10 text-white placeholder-gray-500 border border-white/5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 2: OTP */}
                        {step === 2 && (
                            <div>
                                <label className="text-gray-300 text-xs font-semibold mb-1 block">OTP CODE</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <FaKey />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        maxLength="6"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/10 text-white placeholder-gray-500 border border-white/5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition tracking-widest text-lg"
                                        placeholder="123456"
                                    />
                                </div>
                                <div className="text-right mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-indigo-400 text-xs hover:underline"
                                    >
                                        Wrong email?
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: New Password */}
                        {step === 3 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-gray-300 text-xs font-semibold mb-1 block">NEW PASSWORD</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <FaLock />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/10 text-white placeholder-gray-500 border border-white/5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-gray-300 text-xs font-semibold mb-1 block">CONFIRM PASSWORD</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <FaLock />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/10 text-white placeholder-gray-500 border border-white/5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 w-full py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {step === 1 && "Send OTP Code"}
                                    {step === 2 && "Verify OTP"}
                                    {step === 3 && "Reset Password"}
                                </>
                            )}
                        </button>

                    </form>

                    {step === 1 && (
                        <div className="mt-6 text-center">
                            <Link to="/signin" className="text-gray-400 text-sm hover:text-white transition flex items-center justify-center gap-2">
                                <FaArrowLeft size={12} /> Back to Login
                            </Link>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
