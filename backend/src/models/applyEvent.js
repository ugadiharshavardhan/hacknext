import mongoose from "mongoose";

const AppliedEventSchema = new mongoose.Schema({

  eventTitle: { type: String, required: true },
  eventType: { type: String, required: true },
  EventCity: { type: String, required: false },
  StartDate: { type: String, required: false },
  EndDate: { type: String, required: false },
  Venue: { type: String, required: false },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  phoneNumber: { type: String, required: true },

  institution: { type: String, required: true },
  role: { type: String, required: true },
  skills: { type: String, required: true },

  // Hackathon specific fields
  teamName: { type: String, required: false },
  teamLeadName: { type: String, required: false },
  membersCount: { type: Number, required: false, min: 1 },
  experienceLevel: { type: String, required: false }, // For Hackathons
  ideaDescription: { type: String, required: false },

  // Workshop specific fields
  reasonForAttending: { type: String, required: false },
  proficiency: { type: String, required: false }, // Beginner, Intermediate, Advanced
  expectedOutcomes: { type: String, required: false },

  // Tech Event specific fields
  professionalStatus: { type: String, required: false },
  areasOfInterest: { type: String, required: false },
  previousEventExperience: { type: String, required: false },


  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "admindetails", required: true }, // admin who created the event
  event: { type: mongoose.Schema.Types.ObjectId, ref: "TechEvents", required: true }
}, { timestamps: true });


export const AppliedEventModel = mongoose.model("AppliedEvent", AppliedEventSchema);
