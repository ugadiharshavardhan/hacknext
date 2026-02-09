import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaUsers,
  FaUniversity,
  FaEnvelope,
  FaPhoneAlt
} from "react-icons/fa";
import { FcAbout } from "react-icons/fc";
import { useNavigate } from "react-router";
import { ThreeDot } from "react-loading-indicators";
import { BACKEND_URL } from "../../config";

function Eventsbyuser() {
  const [appliedData, setAppliedData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const url =
          `${BACKEND_URL}/user/appliedevents`;
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("jwt_token")}`,
          },
        };

        const response = await fetch(url, options);
        const data = await response.json();
        setAppliedData(data.events || []);
      } catch (error) {
        console.error("Error fetching applied events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <ThreeDot color="#6366f1" size="medium" />
      </div>
    );
  }

  if (!loading && appliedData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-gray-300">
        <img
          src="https://www.iimnagpur.ac.in/CoE/CLEAD/wp-content/themes/iimnagpur_clead/images/no-event.jpg"
          alt="No Applied Events"
          className="w-64 opacity-70"
        />
        <h2 className="mt-6 text-xl font-semibold">
          No Applied Events Found
        </h2>
      </div>
    );
  }

  const handleViewDetails = (eventid) => {
    navigate(`/user/allevents/${eventid}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-20">
      <h1 className="text-4xl font-bold text-center text-white mb-12">
        <span className="text-indigo-400">Applied</span> Events
      </h1>

      <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {appliedData.map((each, id) => (
          <li
            key={id}
            className="rounded-2xl bg-gradient-to-br from-[#0f1225] to-[#14172e] p-6 text-white shadow-xl hover:shadow-2xl transition-all hover:shadow-blue-900/40 transform hover:scale-[1.02] animate-slideUp"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                ✓ Applied
              </span>
            </div>

            <h3 className="text-indigo-400 font-semibold mb-3">
              Event Details
            </h3>

            <h2 className="text-xl font-bold mb-3">
              {each.eventTitle}
            </h2>

            <div className="flex gap-2 text-gray-400 text-sm mb-5">
              <FcAbout className="mt-1" />
              <p className="line-clamp-3">{each.ideaDescription}</p>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
              <FaCalendarAlt />
              <span>
                {each.StartDate?.split("T")[0]} —{" "}
                {each.EndDate?.split("T")[0]}
              </span>
            </div>

            {/* Divider */}
            <hr className="border-white/10 my-4" />

            {/* Applicant Details */}
            <h3 className="text-indigo-400 font-semibold mb-3">
              Application Details
            </h3>

            <div className="space-y-2 text-sm text-gray-300">
              <p className="flex items-center gap-2">
                <FaUsers /> {each.fullName}
              </p>
              <p className="flex items-center gap-2">
                <FaEnvelope /> {each.email}
              </p>
              <p className="flex items-center gap-2">
                <FaUniversity /> {each.institution}
              </p>
              <p className="flex items-center gap-2">
                <FaPhoneAlt /> {each.phoneNumber}
              </p>
              <p>
                <span className="text-gray-400">Team:</span>{" "}
                {each.teamName} ({each.membersCount} members)
              </p>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-400 text-sm mt-4">
              <FaMapMarkerAlt />
              <span>
                {each.Venue || "Unknown Venue"},{" "}
                {each.EventCity || "Unknown City"}
              </span>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {each.skills?.split(",").map((skill, index) => (
                <span
                  key={index}
                  className="bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full text-xs"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>

            {/* Action */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => handleViewDetails(each.event)}
                className="flex items-center gap-2 border cursor-pointer border-white/10 hover:border-white/30 hover:bg-gradient-to-r hover:from-blue-500 hover:to-violet-600 px-5 py-2 rounded-xl text-sm transition"
              >
                View Event <FaExternalLinkAlt size={12} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Eventsbyuser;
