import jwt from "jsonwebtoken";
import { AppliedEventModel } from "../models/applyEvent.js";
import { TechEventsModel } from "../models/TechEvents.js";
import { sendEmail } from "../utils/email.js";
import { getSuccessEmailTemplate } from "../utils/emailTemplates.js";

export const applyForEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const eventTitle = req.body.eventTitle;
    const eventType = req.body.eventType;
    const eventCity = req.body.EventCity;
    const StartDate = req.body.StartDate;
    const EndDate = req.body.EndDate;
    const Venue = req.body.Venue;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const event = await TechEventsModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const deadline = new Date(event.StartDate);
    deadline.setDate(deadline.getDate() - 1);

    if (new Date() >= deadline) {
      return res.status(400).json({ message: "Registration deadline has passed" });
    }

    const existingApplication = await AppliedEventModel.findOne({
      user: userId,
      event: eventId
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied to this event" });
    }

    const application = new AppliedEventModel({
      ...req.body,
      user: userId,
      eventTitle: eventTitle,
      eventType: eventType,
      Venue: Venue,
      StartDate: StartDate,
      EndDate: EndDate,
      EventCity: eventCity,
      admin: event.createdBy,
      event: eventId
    });

    await application.save();

    // Send Success Email
    try {
      console.log(`[DEBUG] Attempting to send application confirmation email to user ID: ${userId}`);
      const user = await import("../models/userModels.js").then(m => m.userModel.findById(userId));
      const { getEventAppliedEmailTemplate } = await import("../utils/emailTemplates.js");

      if (user) {
        console.log(`[DEBUG] User found: ${user.email}. Preparing email template...`);
        // Prepare event details object for the template
        const eventDetails = {
          EventTitle: event.EventTitle,
          EventDescription: event.EventDescription,
          StartDate: event.StartDate,
          EndDate: event.EndDate,
          Venue: event.Venue,
          City: event.City,
          OrganisationName: event.OrganisationName
        };

        const htmlContent = getEventAppliedEmailTemplate(user.username, eventDetails);

        const emailSent = await sendEmail({
          to: user.email,
          subject: `Application Confirmed: ${eventTitle}`,
          htmlContent: htmlContent
        });

        if (emailSent) {
          console.log(`[DEBUG] Application email successfully sent to ${user.email}`);
        } else {
          console.error(`[ERROR] Failed to send application email to ${user.email} (sendEmail returned false)`);
        }
      } else {
        console.error(`[ERROR] User with ID ${userId} not found for email sending.`);
      }
    } catch (emailError) {
      console.error("[EXCEPTION] Failed to send application success email:", emailError);
      // Continue execution
    }

    return res.status(201).json({
      message: "Application submitted successfully",
      applicationId: application._id
    });

  } catch (error) {
    console.error("Error applying for event:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getUserAppliedEvents = async (req, res) => {
  try {
    const userId = req.user._id;
    const events = await AppliedEventModel.find({ user: userId });
    res.status(200).json({
      message: "AppliedEvents",
      events: events
    });
  } catch (error) {
    console.error("Error fetching applied events:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getAllAppliedEvents = async (req, res) => {
  try {
    const events = await AppliedEventModel.find();
    res.status(200).json({
      message: "AppliedEvents",
      events: events
    });
  } catch (error) {
    console.error("Error fetching all applied events:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getUserApplications = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const applications = await AppliedEventModel.find({ user: decoded.id })
      .populate('event', 'EventTitle StartDate EndDate Venue')
      .sort({ createdAt: -1 });

    res.status(200).json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAdminAppliedEvents = async (req, res) => {
  try {
    const adminId = req.adminId;

    if (!adminId) {
      return res.status(400).json({ message: "Admin ID not found in request" });
    }

    // Find all events created by this admin
    const adminEvents = await TechEventsModel.find({ createdBy: adminId });

    if (adminEvents.length === 0) {
      return res.status(200).json({
        message: "No events found for this admin",
        applications: []
      });
    }

    // Get event IDs
    const eventIds = adminEvents.map(event => event._id);

    // Find all applications for these events
    let applications = await AppliedEventModel.find({
      event: { $in: eventIds }
    })
      .sort({ createdAt: -1 });

    // Populate user and event data
    try {
      applications = await AppliedEventModel.populate(applications, [
        { path: 'user', select: 'username email' },
        { path: 'event', select: 'EventTitle EventType StartDate EndDate Venue' }
      ]);
    } catch (populateError) {
      console.error("Populate error:", populateError);
    }

    res.status(200).json({
      message: "Admin's event applications",
      applications: applications,
      totalApplications: applications.length
    });
  } catch (error) {
    console.error("Error fetching admin applied events:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const checkApplicationStatus = async (req, res) => {
  try {
    const userId = req.userId; // Provided by verifyUserToken middleware
    const eventId = req.params.eventId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const application = await import("../models/applyEvent.js").then(m => m.AppliedEventModel.findOne({
      user: userId,
      event: eventId
    }));

    if (application) {
      return res.status(200).json({ hasApplied: true, applicationId: application._id });
    } else {
      return res.status(200).json({ hasApplied: false });
    }

  } catch (error) {
    console.error("Error checking application status:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const applicationId = req.params.applicationId;
    const userId = req.userId;

    const application = await AppliedEventModel.findOne({ _id: applicationId });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this application" });
    }

    await AppliedEventModel.findByIdAndDelete(applicationId);

    res.status(200).json({ message: "Application cancelled successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};