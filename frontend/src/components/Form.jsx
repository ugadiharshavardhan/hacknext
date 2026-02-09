import React, { useContext, useState } from "react";
import { RxCrossCircled } from "react-icons/rx";
import { FormContext } from "../contextApi/FormContext";
import Cookies from "js-cookie"
import toast from "react-hot-toast";
import { BACKEND_URL } from "../config";

const Form = ({ event }) => {
  const { form, setForm } = useContext(FormContext);
  const id = event?._id || form?.id;
  const token = Cookies.get("admin_token")
  console.log(token)

  const [formData, setFormData] = useState({
    EventTitle: event?.EventTitle || "",
    EventDescription: event?.EventDescription || "",
    EventType: event?.EventType || "",
    Organizer: event?.Organizer || "",
    OnlineorOffline:
      event?.OnlineorOffline === "true" ||
      event?.OnlineorOffline === true ||
      false,
    PricePool: event?.PricePool || "",
    OrganisationName: event?.OrganisationName || "",
    Slots: event?.Slots || "",
    City: event?.City || "",
    State: event?.State || "",
    Venue: event?.Venue || "",
    StartDate: event?.StartDate
      ? new Date(event.StartDate).toISOString().split("T")[0]
      : "",
    EndDate: event?.EndDate
      ? new Date(event.EndDate).toISOString().split("T")[0]
      : "",
    SpecifiedStacks: event?.SpecifiedStacks || "",
    FormLink: event?.FormLink || ""
  });

  // handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isUpdating = !!event;
    const url = isUpdating
      ? `${BACKEND_URL}/events/${id}`
      : `${BACKEND_URL}/events/post`;

    console.log(url)

    const method = isUpdating ? "PUT" : "POST";
    console.log(method)

    // Convert Slots to number
    const dataToSubmit = {
      ...formData,
      Slots: Number(formData.Slots)
    };

    const response = await fetch(url, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(dataToSubmit),
    });

    if (response.ok) {
      const data = await response.json();
      alert(isUpdating ? "Event Updated Successfully!" : "Event Created Successfully!");
      console.log(data);
    } else {
      alert("Something went wrong. Please try again!");
    }

    // Reset form after submission
    setFormData({
      EventTitle: "",
      EventDescription: "",
      EventType: "",
      Organizer: "",
      OnlineorOffline: false,
      PricePool: "",
      OrganisationName: "",
      City: "",
      State: "",
      Venue: "",
      Slots: "",
      StartDate: "",
      EndDate: "",
      SpecifiedStacks: "",
      FormLink: ""
    });

    // Close form modal
    setForm({ open: false, event: null });

    if (method === "PUT") {
      toast.success("Event Updated Succesfully!")
    }
    else {
      toast.success("Event Created Succesfully!")
    }

  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-950 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-6 rounded-2xl shadow-lg w-full max-w-2xl space-y-4"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {event ? "Update Event" : "Create New Event"}
          </h2>
          <RxCrossCircled
            className="text-red-500 cursor-pointer"
            size={28}
            onClick={() => setForm({ open: false, event: null })}
          />
        </div>

        <p className="text-gray-400 mb-4">
          {event
            ? "Edit the details to update the event"
            : "Fill in the details to create a new event"}
        </p>

        {/* Input fields */}
        <div>
          <label className="block text-sm mb-1">Event Title *</label>
          <input
            type="text"
            name="EventTitle"
            value={formData.EventTitle}
            onChange={handleChange}
            placeholder="Enter event title"
            className="w-full p-2 rounded-md bg-gray-800 border border-gray-700"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Event Description *</label>
          <input
            type="text"
            name="EventDescription"
            value={formData.EventDescription}
            onChange={handleChange}
            placeholder="Enter event description"
            className="w-full p-2 rounded-md bg-gray-800 border border-gray-700"
            required
          />
        </div>


        <div>
          <label className="block text-sm mb-1">Event Type *</label>
          <select
            name="EventType"
            value={formData.EventType}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-800 border border-gray-700"
            required
          >
            <option value="">Select type</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Tech Event">Tech Event</option>
            <option value="Workshop">Workshop</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Organizer *</label>
          <select
            name="Organizer"
            value={formData.Organizer}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-800 border border-gray-700"
            required
          >
            <option value="">Select organizer</option>
            <option value="College">College</option>
            <option value="Government">Government</option>
            <option value="TechCompany">Tech Company</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="OnlineorOffline"
            checked={formData.OnlineorOffline}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <label>Online or Offline Event</label>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col flex-1">
            <label>Organization Name</label>
            <input
              type="text"
              name="OrganisationName"
              value={formData.OrganisationName}
              onChange={handleChange}
              className="p-2 rounded-md bg-gray-800 border border-gray-700"
            />
          </div>
          <div className="flex flex-col flex-1">
            <label>Prize Pool</label>
            <input
              type="text"
              name="PricePool"
              value={formData.PricePool}
              onChange={handleChange}
              className="p-2 rounded-md bg-gray-800 border border-gray-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label>City</label>
            <input
              type="text"
              name="City"
              value={formData.City}
              onChange={handleChange}
              className="p-2 rounded-md bg-gray-800 border border-gray-700"
            />
          </div>
          <div>
            <label>State</label>
            <input
              type="text"
              name="State"
              value={formData.State}
              onChange={handleChange}
              className="p-2 rounded-md bg-gray-800 border border-gray-700"
            />
          </div>
          <div>
            <label>Venue</label>
            <input
              type="text"
              name="Venue"
              value={formData.Venue}
              onChange={handleChange}
              className="p-2 rounded-md bg-gray-800 border border-gray-700"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col">
            <label>Slots</label>
            <input
              type="text"
              name="Slots"
              value={formData.Slots}
              onChange={handleChange}
              className="p-2 rounded-md bg-gray-800 border border-gray-700"
            />
          </div>
          <div className="flex flex-col">
            <label>Start Date</label>
            <input
              type="date"
              name="StartDate"
              value={formData.StartDate}
              onChange={handleChange}
              className="p-2 rounded-md bg-gray-800 border border-gray-700"
            />
          </div>
          <div className="flex flex-col">
            <label>End Date</label>
            <input
              type="date"
              name="EndDate"
              value={formData.EndDate}
              onChange={handleChange}
              className="p-2 rounded-md bg-gray-800 border border-gray-700"
            />
          </div>
        </div>


        <div>
          <label className="block text-sm mb-1">Specified Stacks</label>
          <input
            type="text"
            name="SpecifiedStacks"
            value={formData.SpecifiedStacks}
            onChange={handleChange}
            placeholder="e.g., React, Node.js, AI/ML"
            className="w-full p-2 rounded-md bg-gray-800 border border-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Application Form Link</label>
          <input
            type="text"
            name="FormLink"
            value={formData.FormLink}
            onChange={handleChange}
            placeholder="Google Application Form link"
            className="w-full p-2 rounded-md bg-gray-800 border border-gray-700"
          />
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-purple-600 hover:bg-purple-700 rounded-md font-bold"
        >
          {event ? "Update Event" : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default Form;
