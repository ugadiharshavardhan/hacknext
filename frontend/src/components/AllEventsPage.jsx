import React, { useEffect, useState } from "react";
import { ThreeDot } from "react-loading-indicators";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserAlt,
  FaTrophy,
  FaExternalLinkAlt,
  FaGraduationCap,
  FaBuilding,
  FaLandmark,
} from "react-icons/fa";
import { LuClock3 } from "react-icons/lu";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { BACKEND_URL } from "../config";

function AllEventsPage({ searchQuery, eventType, organizer }) {
  const [TotalEvents, setTotalEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeSection, setActiveSection] = useState("upcoming");

  const token = Cookies.get("jwt_token");
  const navigate = useNavigate();

  /* ---------------- FETCH ALL EVENTS ---------------- */
  useEffect(() => {
    const allEventsData = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/events/all`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setTotalEvents(data.allevents || []);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    allEventsData();
  }, []);

  /* ---------------- DATE HELPERS ---------------- */
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getEventCategory = (startDate) => {
    const eventDate = new Date(startDate);
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate < today) return "completed";
    if (eventDate.getTime() === today.getTime()) return "live";
    return "upcoming";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const remainingDays = (dateString) => {
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);

    const diff = Math.floor((date - today) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff < 0) return "Expired";
    return `${diff} Days Left`;
  };

  /* ---------------- FILTER LOGIC ---------------- */
  let filteredEvents = TotalEvents.filter(
    (event) => getEventCategory(event.StartDate) === activeSection
  );

  if (searchQuery.trim() !== "") {
    filteredEvents = filteredEvents.filter((each) =>
      each.EventTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (eventType !== "All Types" && eventType !== "") {
    filteredEvents = filteredEvents.filter((each) =>
      each.EventType.toLowerCase().includes(eventType.toLowerCase())
    );
  }

  if (organizer !== "All Organizers" && organizer !== "") {
    filteredEvents = filteredEvents.filter((each) =>
      each.Organizer.toLowerCase().includes(organizer.toLowerCase())
    );
  }

  const handleViewDetails = (eventid) => {
    navigate(`/user/allevents/${eventid}`);
  };

  return (
    <div className="min-h-screen w-full">
      <div className="flex justify-center gap-6 pt-10">
        {[
          { key: "upcoming", label: "Upcoming Events" },
          { key: "live", label: "Live Events" },
          { key: "completed", label: "Completed Events" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveSection(tab.key)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition
              ${activeSection === tab.key
                ? "bg-gradient-to-r from-blue-500 to-violet-600 text-white"
                : "border border-white/10 text-gray-400 hover:text-white cursor-pointer"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <ThreeDot color="#6366f1" size="medium" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 py-16">
          {filteredEvents.length === 0 ? (
            <p className="text-center text-gray-400 col-span-full">
              No events found for this section.
            </p>
          ) : (
            filteredEvents.map((each, _id) => (
              <div
                key={_id}
                className="rounded-2xl bg-white/5 border border-white/10 p-6 text-white
                           shadow-xl hover:shadow-indigo-900/30
                           transition-transform duration-300 hover:-translate-y-3"
              >
                <div className="flex items-center gap-2 mb-4">
                  {each.Organizer === "College" ? (
                    <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                      <FaGraduationCap /> College
                    </span>
                  ) : each.Organizer === "Government" ? (
                    <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                      <FaLandmark /> Government
                    </span>
                  ) : (
                    <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                      <FaBuilding /> {each.Organizer}
                    </span>
                  )}

                  <span className="bg-indigo-500/20 text-indigo-400 text-xs px-3 py-1 rounded-full">
                    {each.EventType}
                  </span>
                  <span className="px-2 text-xs rounded-full bg-green-500/50 text-white border border-purple-500/30">verified</span>
                </div>

                <h2 className="text-lg font-bold mb-2 bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
                  {each.EventTitle.toUpperCase()}
                </h2>

                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {each.EventDescription}
                </p>

                <div className="space-y-2 text-gray-300 text-sm">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt />
                    {formatDate(each.StartDate)} - {formatDate(each.EndDate)}
                  </div>

                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt /> {each.City}, {each.State}
                  </div>

                  <div className="flex items-center gap-2">
                    <FaUserAlt /> {each.Venue}
                  </div>

                  <div className="flex items-center gap-2 text-amber-400">
                    <FaTrophy /> ₹ {each.PricePool} in prizes
                  </div>

                  <div className="flex items-center gap-2">
                    <FaUserAlt /> Slots: {each.Slots}
                  </div>
                </div>

                <ul className="flex flex-wrap gap-2 mt-4">
                  {each.SpecifiedStacks?.split(",").map((stack, index) => (
                    <li
                      key={index}
                      className="bg-white/5 border border-white/10 text-xs px-3 py-1 rounded-full text-gray-200"
                    >
                      {stack.trim()}
                    </li>
                  ))}
                </ul>

                <div className="flex justify-between items-center mt-6">
                  <div className="flex items-center text-gray-400 text-sm">
                    <LuClock3 className="mr-1" />
                    {remainingDays(each.StartDate)}
                  </div>

                  <button
                    onClick={() => handleViewDetails(each._id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl
                               border border-white/10
                               hover:bg-gradient-to-r hover:from-blue-500 hover:to-violet-600
                               text-white text-sm transition cursor-pointer"
                  >
                    View Details <FaExternalLinkAlt size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default AllEventsPage;
