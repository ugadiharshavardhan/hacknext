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
      event?.OnlineorOffline === "Online" || event?.OnlineorOffline === "true" || event?.OnlineorOffline === true
        ? "Online"
        : "Offline", // Use string "Online" or "Offline" instead of boolean
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
    const { name, value } = e.target;

    setFormData(prev => {
      const newData = { ...prev, [name]: value };

      // If event type changes to Tech Event, default to Offline
      if (name === "EventType" && value === "Tech Event") {
        newData.OnlineorOffline = "Offline";
      }
      return newData;
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
      OnlineorOffline: "Offline",
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
    <div className="min-h-screen flex justify-center items-center bg-gray-50/90 dark:bg-gray-950/90 backdrop-blur-sm z-50 fixed inset-0 overflow-y-auto pt-10 pb-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-2xl space-y-4 text-gray-900 dark:text-white my-auto"
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

        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {event
            ? "Edit the details to update the event"
            : "Fill in the details to create a new event"}
        </p>

        {/* Input fields */}
        <div>
          <label className="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">Event Title *</label>
          <input
            type="text"
            name="EventTitle"
            value={formData.EventTitle}
            onChange={handleChange}
            placeholder="Enter event title"
            className="w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">Event Description *</label>
          <input
            type="text"
            name="EventDescription"
            value={formData.EventDescription}
            onChange={handleChange}
            placeholder="Enter event description"
            className="w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
            required
          />
        </div>


        <div>
          <label className="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">Event Type *</label>
          <select
            name="EventType"
            value={formData.EventType}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
            required
          >
            <option value="">Select type</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Tech Event">Tech Event</option>
            <option value="Workshop">Workshop</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">Organizer *</label>
          <select
            name="Organizer"
            value={formData.Organizer}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
            required
          >
            <option value="">Select organizer</option>
            <option value="College">College</option>
            <option value="Government">Government</option>
            <option value="TechCompany">Tech Company</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {/* Show Online/Offline toggle for all event types */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">Event Format *</label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="OnlineorOffline"
                value="Online"
                checked={formData.OnlineorOffline === "Online"}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
              />
              <span className="text-gray-700 dark:text-gray-300">Online Event</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="OnlineorOffline"
                value="Offline"
                checked={formData.OnlineorOffline === "Offline"}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
              />
              <span className="text-gray-700 dark:text-gray-300">Offline Event</span>
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col flex-1">
            <label className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-1">Organization Name</label>
            <input
              type="text"
              name="OrganisationName"
              value={formData.OrganisationName}
              onChange={handleChange}
              placeholder="e.g. Google, Stanford University"
              className="p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-1">Prize Pool</label>
            <input
              type="text"
              name="PricePool"
              value={formData.PricePool}
              onChange={handleChange}
              placeholder="e.g. $10,000 or Swag"
              className="p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {formData.OnlineorOffline === "Offline" && (
            <>
              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-1 block">City</label>
                <input
                  type="text"
                  name="City"
                  value={formData.City}
                  onChange={handleChange}
                  placeholder="e.g. San Francisco"
                  className="w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
                  required={formData.OnlineorOffline === "Offline"}
                />
              </div>
              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-1 block">State</label>
                <input
                  type="text"
                  name="State"
                  value={formData.State}
                  onChange={handleChange}
                  placeholder="e.g. CA"
                  className="w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
                  required={formData.OnlineorOffline === "Offline"}
                />
              </div>
            </>
          )}
          <div className={formData.OnlineorOffline === "Online" ? "md:col-span-3" : ""}>
            <label className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-1 block">
              {formData.OnlineorOffline === "Online" ? "Online Method / Link" : "Venue"}
            </label>
            <input
              type="text"
              name="Venue"
              value={formData.Venue}
              onChange={handleChange}
              placeholder={formData.OnlineorOffline === "Online" ? "e.g. Zoom Link, Google Meet, Discord" : "e.g. 123 Tech Avenue"}
              className="w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
              required
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-1 block">Slots</label>
            <input
              type="number"
              name="Slots"
              value={formData.Slots}
              onChange={handleChange}
              placeholder="e.g. 100"
              className="p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-1 block">Start Date</label>
            <input
              type="date"
              name="StartDate"
              value={formData.StartDate}
              onChange={handleChange}
              className="p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-1 block">End Date</label>
            <input
              type="date"
              name="EndDate"
              value={formData.EndDate}
              onChange={handleChange}
              className="p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
            />
          </div>
        </div>


        <div>
          <label className="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">Specified Stacks</label>
          <input
            type="text"
            name="SpecifiedStacks"
            value={formData.SpecifiedStacks}
            onChange={handleChange}
            placeholder="e.g., React, Node.js, AI/ML"
            className="w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">Application Form Link</label>
          <input
            type="text"
            name="FormLink"
            value={formData.FormLink}
            onChange={handleChange}
            placeholder="Google Application Form link"
            className="w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-violet-600 text-white rounded-md font-bold transition-colors cursor-pointer"
        >
          {event ? "Update Event" : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default Form;
