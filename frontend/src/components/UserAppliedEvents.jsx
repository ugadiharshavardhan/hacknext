import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { ThreeDot } from "react-loading-indicators";
import { FaCalendarAlt, FaMapMarkerAlt, FaUser, FaClock } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";

function UserAppliedEvents() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppliedEvents = async () => {
      try {
        const adminToken = Cookies.get("admin_token");
        if (!adminToken) {
          navigate("https://project-hackathon-7utw.onrender.com/admin/login", { replace: true });
          return;
        }

        const response = await fetch(
          "https://project-hackathon-7utw.onrender.com/admin/applied-events",
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            Cookies.remove("admin_token");
            navigate("/admin/login", { replace: true });
            return;
          }
          throw new Error("Failed to fetch applied events");
        }

        const data = await response.json();
        setApplications(data.applications || []);
      } catch (error) {
        console.error("Error fetching applied events:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedEvents();
  }, [navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#0f1225] to-[#14172e]">
        <ThreeDot color="#6366f1" size="medium" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#0f1225] to-[#14172e]">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Error loading applied events</p>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  const handleBackBtn = () => {
    navigate("/admin/dashboard",{replace:true})
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1225] to-[#14172e] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={handleBackBtn}
            className="p-2 cursor-pointer rounded-full border relative -left-170 top-10 border-white/20 hover:border-white/40 transition"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-indigo-400">User Applied</span> Events
          </h1>
          <p className="text-gray-400 text-lg">
            View all applications for events you created
          </p>
          <p className="text-gray-500 mt-2">
            Total Applications: {applications.length}
          </p>
        </div>

        {applications.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col justify-center items-center text-center min-h-[50vh]">
            <h2 className="text-2xl font-bold mb-4">No Applications Yet</h2>
            <p className="text-gray-400 mb-6">
              No users have applied to your events yet.
            </p>
            <img
              src="https://www.pngkey.com/png/full/30-301664_calendar-emblem-events-icon-white-png.png"
              alt="no-applications"
              className="h-[30vh] opacity-70"
            />
          </div>
        ) : (
          /* Applications Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((application) => (
              <div
                key={application._id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6
                         hover:bg-white/10 transition-all duration-300
                         hover:shadow-lg hover:shadow-indigo-900/20"
              >
                {/* Event Info */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-indigo-400 mb-2">
                    {application.event?.EventTitle || application.eventTitle || "Event Title"}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <FaCalendarAlt />
                    <span>{application.event?.StartDate ? formatDate(application.event.StartDate) : formatDate(application.StartDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <FaMapMarkerAlt />
                    <span>{application.event?.Venue || application.Venue || "Venue"}</span>
                  </div>
                  <span className="inline-block bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-sm font-semibold">
                    {application.event?.EventType || application.eventType || "Event Type"}
                  </span>
                </div>

                {/* User Info */}
                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full flex items-center justify-center">
                      <FaUser className="text-white text-sm" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        {application.user?.username || application.fullName || "User"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {application.user?.email || application.email || "email@example.com"}
                      </p>
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Applied Date:</span>
                      <span className="text-white">{formatDate(application.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Event City:</span>
                      <span className="text-white">{application.EventCity || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Status:</span>
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                      Applied
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserAppliedEvents;