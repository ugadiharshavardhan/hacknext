
import fetch from 'node-fetch';

const test = async () => {
    console.log("Testing forgot password endpoint...");
    try {
        const response = await fetch("http://localhost:5678/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "test@example.com" }),
        });
        console.log("Status:", response.status);
        const text = await response.text();
        console.log("Body:", text);
    } catch (e) {
        console.error("Error:", e);
    }
};

test();
