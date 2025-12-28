import { SavedModel } from "../models/Saved.js";

export const saveEvent = async (req, res) => {
  try {
    const { eventid, save } = req.body;
    const userId = req.user._id;

    const savedEvent = await SavedModel.findOneAndUpdate(
      { eventid, userId },
      { save },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: save ? "Event Saved" : "Event Unsaved",
      event: savedEvent,
    });
  } catch (error) {
    console.error("Error saving event:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSavedEvents = async (req, res) => {
  try {
    const userId = req.user._id;

    const savedEvents = await SavedModel.find({
      userId,
      save: true,
    }).populate("eventid");

    const validSavedEvents = savedEvents.filter(savedEvent => savedEvent.eventid !== null);

    if (validSavedEvents.length !== savedEvents.length) {
      const orphanedIds = savedEvents
        .filter(savedEvent => savedEvent.eventid === null)
        .map(savedEvent => savedEvent._id);

      if (orphanedIds.length > 0) {
        SavedModel.deleteMany({ _id: { $in: orphanedIds } }).catch(err =>
          console.log("Cleanup of orphaned saved events failed:", err)
        );
      }
    }

    res.status(200).json({
      success: true,
      events: validSavedEvents,
    });
  } catch (error) {
    console.error("Error fetching saved events:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const checkSavedEvent = async (req, res) => {
  try {
    const { eventid } = req.params;
    const userId = req.user._id;

    const savedEvent = await SavedModel.findOne({
      eventid,
      userId,
      save: true,
    });

    res.status(200).json({
      isSaved: !!savedEvent,
    });
  } catch (error) {
    console.error("Error checking saved event:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};