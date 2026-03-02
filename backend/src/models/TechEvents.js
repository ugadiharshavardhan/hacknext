import { Schema, model } from "mongoose";

const TechEventsFormat = {
    EventTitle: { type: String, required: true },
    EventDescription: { type: String, required: true },
    EventType: { type: String, required: true },
    Organizer: { type: String, required: true },
    OnlineorOffline: { type: String, required: true },
    PricePool: { type: String, required: false },
    OrganisationName: { type: String, required: true },
    City: { type: String, required: false },
    State: { type: String, required: false },
    Venue: { type: String, required: true },
    Slots: { type: Number, required: true },
    StartDate: { type: Date, required: true },
    EndDate: { type: Date, required: true },
    SpecifiedStacks: { type: String, required: true },
    FormLink: { type: String, required: false },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "admindetails",
        required: true
    }
};

const TechEventsSchema = new Schema(TechEventsFormat, { timestamps: true });
export const TechEventsModel = model("TechEvents", TechEventsSchema);
