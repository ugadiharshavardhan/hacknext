
import express from "express";
import userRoutes from "./src/routes/userRoutes.js";
import { app } from "./src/config/app.js";

// Create a fresh app instance or usage to avoid side effects if possible, 
// but "app" is a singleton from config/app.js. 
// We will just use it and mount routes like index.js does.

console.log("Setting up reproduction server...");

// Mock database connection or just skip it since request routing doesn't strictly depend on DB connection for *routing* 
// (unless middleware blocks it, but we don't have blocking middleware before routes)

// Mimic index.js
app.use((req, res, next) => {
    console.log(`[REPRO] ${req.method} ${req.url}`);
    next();
});

app.use("/", userRoutes);

const PORT = 5679;
const server = app.listen(PORT, async () => {
    console.log(`Reproduction server running on ${PORT}`);

    // Make a request
    try {
        const fetch = (await import("node-fetch")).default;
        const response = await fetch(`http://localhost:${PORT}/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "test@example.com" })
        });

        console.log("Response Status:", response.status);
        console.log("Response Body:", await response.text());

        server.close();
        process.exit(0);
    } catch (error) {
        console.error("Error during fetch:", error);
        server.close();
        process.exit(1);
    }
});
