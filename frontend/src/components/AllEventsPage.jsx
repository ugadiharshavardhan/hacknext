import React, { useEffect, useState } from "react";
import { ThreeDot } from "react-loading-indicators";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserAlt,
  FaTrophy,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { FaGraduationCap } from "react-icons/fa";
import { LuClock3 } from "react-icons/lu";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { FaBuilding } from "react-icons/fa";
import { FaLandmark } from "react-icons/fa";

function AllEventsPage({ searchQuery, eventType, organizer }) {
  const [TotalEvents, setTotalEvents] = useState([]);
  const [loading, setLoading] = useState(true); 
  const token = Cookies.get("jwt_token");
  const navigate = useNavigate();

  useEffect(() => {
    const allEventsData = async () => {
      try {
        const response = await fetch("http://localhost:5678/events/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  let filteredEvents = TotalEvents;

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

  const remainingDays = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    date.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const days = Math.floor((date - today) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days < 0) return "Expired";
    return `${days} Days Left`;
  };

  const handleViewDetails = (eventid) => {
    navigate(`/user/allevents/${eventid}`);
  };

  return (
    <div className="bg-[#020617] min-h-screen w-full ">

      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <ThreeDot color="#32cd32" size="medium" text="" textColor="" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-2">
          {filteredEvents.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">
              No events found matching your filters.
            </p>
          ) : (
            filteredEvents.map((each, _id) => (
              <div
                key={_id}
                className="bg-[#111111] text-white rounded-xl p-5 border border-gray-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-white-900"
              >
                <div className="flex items-center gap-2 mb-3">
                  {each.Organizer === "College" ? (
                    <span className="bg-green-600 text-xs px-3 py-1 rounded-full flex">
                      <FaGraduationCap className="mr-1" /> College
                    </span>
                  ) : each.Organizer === "Government" ? (
                    <span className="bg-green-600 text-xs px-3 py-1 rounded-full flex">
                      <FaLandmark className="mr-1" /> Government
                    </span>
                  ) : (
                    <span className="bg-green-600 text-xs px-3 py-1 rounded-full flex">
                      <FaBuilding className="mr-1" /> {each.Organizer}
                    </span>
                  )}

                  <span className="bg-blue-600 text-xs px-3 py-1 rounded-full">
                    {each.EventType}
                  </span>
                </div>

                <h2 className="text-xl font-semibold mb-1">{each.EventTitle}</h2>
                <p className="text-gray-400 text-sm mb-4">
                  {each.EventDescription}
                </p>

                <div className="space-y-2 text-gray-300 text-sm">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt /> {formatDate(each.StartDate)} -{" "}
                    {formatDate(each.EndDate)}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt /> {each.City}, {each.State}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUserAlt /> {each.Venue}
                  </div>
                  <div className="flex items-center gap-2 text-yellow-500">
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
                      className="bg-gray-800 text-xs px-3 py-1 rounded-full"
                    >
                      {stack.trim()}
                    </li>
                  ))}
                </ul>

                <div className="flex justify-between items-center mt-5">
                  <div className="flex items-center text-gray-500 text-sm">
                    <LuClock3 className="mr-1" />{" "}
                    {remainingDays(each.StartDate)}
                  </div>

                  <button
                    onClick={() => handleViewDetails(each._id)}
                    className="flex items-center gap-2 bg-gray-800 hover:bg-gradient-to-r from-violet-500 to-blue-500 text-sm px-4 py-2 rounded-md"
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


