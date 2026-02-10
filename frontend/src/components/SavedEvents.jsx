import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { ThreeDot } from "react-loading-indicators";
import { FaExternalLinkAlt, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { BACKEND_URL } from "../config";

function SavedEvents() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        setLoading(true);

        const url = `${BACKEND_URL}/user/savedevents`;
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("jwt_token")}`,
          },
        };
        const response = await fetch(url, options);
        const data = await response.json();

        setEvents(data.events || []);
      } catch (error) {
        console.error("Error fetching saved events:", error);
        toast.error("Failed to load saved events");
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, []);

  const handleRemove = async (eventid) => {
    try {
      const url = `${BACKEND_URL}/user/saved`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("jwt_token")}`,
        },
        body: JSON.stringify({ eventid, save: false }),
      };

      const response = await fetch(url, options);
      const data = await response.json();

      if (response.ok) {
        setEvents((prevEvents) => prevEvents.filter((item) => item.eventid._id !== eventid));
        toast.success("Event removed from saved list");
      } else {
        toast.error(data.message || "Failed to remove event");
      }
    } catch (error) {
      console.error("Error removing event:", error);
      toast.error("Something went wrong");
    }
  };

  const Data = events
    .map((each) => each.eventid)
    .filter((event) => event !== null);

  return (
    <div className="pt-20 w-full min-h-screen px-4 sm:px-6 lg:px-8">
      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <ThreeDot color="#6366f1" size="medium" />
        </div>
      ) : Data.length === 0 ? (
        <div className="flex flex-col justify-center items-center text-center h-[70vh]">
          <h1 className="text-white font-bold text-3xl md:text-4xl mb-4">
            No Saved Events
          </h1>
          <p className="text-gray-400 mb-6">
            You haven't saved any events yet.
          </p>
          <img
            src="https://www.pngkey.com/png/full/30-301664_calendar-emblem-events-icon-white-png.png" // Consider hosting this locally or using a reliable CDN
            alt="no-events"
            className="h-[30vh] md:h-[40vh] opacity-70 object-contain"
          />
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto animate-fadeIn pb-10">
          <div className="text-center mb-10 pt-2 animate-slideUp">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              <span className="text-indigo-400">Saved</span> Events
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
              Quickly access and manage your bookmarked events.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 cursor-pointer">
            {Data.map((each) => (
              <div
                key={each._id}
                onClick={() => navigate(`/user/allevents/${each._id}`)}
                className="
                  group relative
                  w-full
                  bg-white/5 border border-white/10
                  backdrop-blur-md
                  rounded-2xl p-6
                  flex flex-col
                  shadow-xl shadow-black/30
                  hover:shadow-indigo-900/20
                  transition-all duration-300
                  hover:-translate-y-1
                "
              >
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(each._id);
                    }}
                    className="
                      p-2 rounded-full
                      bg-red-500/10 text-red-400
                      hover:bg-red-500 hover:text-white
                      transition-colors duration-200
                    "
                    title="Remove Event"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>

                <div className="mb-4 text-center">
                  <h1
                    className="
                        text-xl font-bold mb-3
                        bg-gradient-to-r from-indigo-400 to-violet-500
                        bg-clip-text text-transparent
                        line-clamp-1
                    "
                  >
                    {each.EventTitle}
                  </h1>

                  <span className="inline-block bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                    {each.EventType}
                  </span>
                </div>

                <div className="space-y-2 mb-6 flex-grow ">
                  <p className="text-gray-300 text-sm text-center">
                    <span className="block text-xs text-gray-500 mb-0.5">Organized by</span>
                    <span className="font-semibold text-white">
                      {each.OrganisationName}
                    </span>
                  </p>
                  <p className="text-gray-300 text-sm text-center">
                    <span className="block text-xs text-gray-500 mb-0.5">Location</span>
                    {each.City}, {each.State}
                  </p>
                  <p className="text-gray-300 text-sm text-center">
                    <span className="block text-xs text-gray-500 mb-0.5">Venue</span>
                    <span className="text-gray-200 font-medium">
                      {each.Venue}
                    </span>
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/user/allevents/${each._id}`);
                  }}
                  className="
                    w-full
                    flex items-center justify-center gap-2
                    py-2.5 rounded-xl
                    bg-indigo-600/80 hover:bg-indigo-600
                    text-white font-medium
                    transition-all duration-200
                    cursor-pointer
                  "
                >
                  View Details
                  <FaExternalLinkAlt size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SavedEvents;
