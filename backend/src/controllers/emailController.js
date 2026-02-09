import { sendEmail } from "../utils/email.js";
import { getWelcomeEmailTemplate, getSuccessEmailTemplate } from "../utils/emailTemplates.js";

export const testWelcomeEmail = async (req, res) => {
    const { email, username } = req.body;
    if (!email || !username) {
        return res.status(400).json({ message: "Email and username are required" });
    }

    const htmlContent = getWelcomeEmailTemplate(username);
    const success = await sendEmail({
        to: email,
        subject: "Welcome to HackNext!",
        htmlContent: htmlContent
    });

    if (success) {
        return res.status(200).json({ message: "Welcome email sent successfully" });
    } else {
        return res.status(500).json({ message: "Failed to send welcome email" });
    }
};

export const testSuccessEmail = async (req, res) => {
    const { email, username, actionDetails } = req.body;
    if (!email || !username || !actionDetails) {
        return res.status(400).json({ message: "Email, username, and actionDetails are required" });
    }

    const htmlContent = getSuccessEmailTemplate(username, actionDetails);
    const success = await sendEmail({
        to: email,
        subject: "Action Completed Successfully",
        htmlContent: htmlContent
    });

    if (success) {
        return res.status(200).json({ message: "Success email sent successfully" });
    } else {
        return res.status(500).json({ message: "Failed to send success email" });
    }
};
