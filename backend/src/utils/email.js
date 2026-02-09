import 'dotenv/config'; // Ensure env vars are loaded
import axios from 'axios';

/**
 * Sends an email using Brevo (Sendinblue) Transactional Email API.
 * 
 * @param {Object} options - Email options.
 * @param {string} options.to - Recipient email address.
 * @param {string} options.subject - Email subject line.
 * @param {string} options.htmlContent - HTML content of the email.
 * @returns {Promise<boolean>} - Returns true if email was sent successfully, false otherwise.
 */
export const sendEmail = async ({ to, subject, htmlContent }) => {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.EMAIL_FROM;

    console.log("--- sendEmail Utility Called ---");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Sender: ${senderEmail}`);
    console.log(`API Key Present: ${!!apiKey}`); // Do not log the actual key

    if (!apiKey || !senderEmail) {
        console.error("BREVO_API_KEY or EMAIL_FROM is missing in environment variables.");
        return false;
    }

    const url = 'https://api.brevo.com/v3/smtp/email';

    const data = {
        sender: {
            name: "HackNext",
            email: senderEmail
        },
        to: [
            {
                email: to
            }
        ],
        subject: subject,
        htmlContent: htmlContent
    };

    console.log("Sending payload to Brevo:", JSON.stringify({ ...data, htmlContent: "..." })); // Log structure but hide content

    try {
        const response = await axios.post(url, data, {
            headers: {
                "accept": "application/json",
                "api-key": apiKey,
                "content-type": "application/json"
            }
        });

        console.log(`Brevo API Response Status: ${response.status}`);
        console.log("Brevo API Response Body:", JSON.stringify(response.data, null, 2));

        if (response.status === 200 || response.status === 201) {
            console.log("Email sent successfully (according to Brevo API).");
            return true;
        }

        console.error("Unexpected status code from Brevo:", response.status);
        return false;

    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Brevo API Error Response:", JSON.stringify(error.response.data, null, 2));
            console.error("Status Code:", error.response.status);
        } else if (error.request) {
            // The request was made but no response was received
            console.error("No response received from Brevo:", error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error setting up email request:", error.message);
        }
        return false;
    }
};
