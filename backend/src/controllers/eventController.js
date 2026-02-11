import { TechEventsModel } from "../models/TechEvents.js";
import { AppliedEventModel } from "../models/applyEvent.js";

export const getAllEvents = async (req, res) => {
  try {
    const events = await TechEventsModel.find().populate("createdBy", "email");

    // Calculate remaining slots for each event
    const eventsWithSlots = await Promise.all(events.map(async (event) => {
      const appliedCount = await AppliedEventModel.countDocuments({ event: event._id });
      return {
        ...event.toObject(),
        Slots: Math.max(0, event.Slots - appliedCount) // Ensure non-negative
      };
    }));

    res.status(200).json({ message: "All Events", allevents: eventsWithSlots });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await TechEventsModel.findById(req.params.eventid);
    if (!event) {
      return res.status(404).json({ message: "Event Not Found" });
    }

    const appliedCount = await AppliedEventModel.countDocuments({ event: req.params.eventid });
    const eventWithSlots = {
      ...event.toObject(),
      Slots: Math.max(0, event.Slots - appliedCount)
    };

    res.status(200).json(eventWithSlots);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAdminEvents = async (req, res) => {
  try {
    const events = await TechEventsModel.find({ createdBy: req.adminId });
    res.status(200).json({ message: "Admin's events", events });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createEvent = async (req, res) => {
  try {
    const newEvent = new TechEventsModel({
      ...req.body,
      createdBy: req.adminId
    });

    await newEvent.save();
    res.status(200).json({
      message: "Event Created Successfully",
      EventDetails: newEvent
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await TechEventsModel.findOne({ _id: req.params.id, createdBy: req.adminId });
    if (!event) return res.status(404).json({ message: "Event not found or not owned by you" });

    Object.assign(event, req.body);
    await event.save();

    res.status(200).json({ message: "Event updated", event });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await TechEventsModel.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.adminId
    });

    if (!deletedEvent)
      return res.status(404).json({ message: "Event not found or not owned by you" });

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};