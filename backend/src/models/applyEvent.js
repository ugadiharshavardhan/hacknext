import mongoose from "mongoose";

const AppliedEventSchema = new mongoose.Schema({
  
  eventTitle:{type:String,required:true},
  eventType:{type:String,required:true},
  EventCity: { type: String, required: false },
  StartDate: { type: String, required: false },
  EndDate: { type: String, required: false },
  Venue: { type: String, required: false },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  phoneNumber: { type: String, required: true },

  
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },

  institution: { type: String, required: true }, 
  role: { type: String, required: true },
  skills: { type: String, required: true },

  teamName: { type: String, required: true },
  teamLeadName: { type: String, required: false },
  membersCount: { type: Number, required: true, min: 1 }, 


  ideaDescription: { type: String, required: true },

  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "admindetails", required: true }, // admin who created the event
  event: { type: mongoose.Schema.Types.ObjectId, ref: "TechEvents", required: true }
}, { timestamps: true });

export const AppliedEventModel = mongoose.model("AppliedEvent", AppliedEventSchema);
