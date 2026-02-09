import 'dotenv/config'; // Ensure env vars are loaded

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
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": apiKey,
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        });

        console.log(`Brevo API Response Status: ${response.status}`);

        const responseData = await response.json();
        console.log("Brevo API Response Body:", JSON.stringify(responseData, null, 2));

        if (!response.ok) {
            console.error("Error sending email via Brevo.");
            return false;
        }

        console.log("Email sent successfully (according to Brevo API).");
        return true;

    } catch (error) {
        console.error("Network/Unexpected error sending email:", error);
        return false;
    }
};
