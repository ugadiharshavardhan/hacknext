import React, { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { ThreeDot } from "react-loading-indicators";
import { FaCalendarAlt, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import AdminNavbar from "./AdminNavbar";
import { BACKEND_URL } from "../config";

function UserAppliedEvents() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [activeType, setActiveType] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAppliedEvents = async () => {
      try {
        const adminToken = Cookies.get("admin_token");
        if (!adminToken) {
          navigate("/admin/login", { replace: true });
          return;
        }

        const response = await fetch(
          `${BACKEND_URL}/admin/applied-events`,
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
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedEvents();
  }, [navigate]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });


  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesType =
        activeType === "All" ||
        app.event?.EventType === activeType;

      const searchText = search.toLowerCase();
      const matchesSearch =
        app.event?.EventTitle?.toLowerCase().includes(searchText) ||
        app.user?.username?.toLowerCase().includes(searchText) ||
        app.user?.email?.toLowerCase().includes(searchText);

      return matchesType && matchesSearch;
    });
  }, [applications, activeType, search]);


  const groupedApplications = useMemo(() => {
    return filteredApplications.reduce((acc, app) => {
      const eventId = app.event?._id;
      if (!acc[eventId]) {
        acc[eventId] = {
          event: app.event,
          users: [],
        };
      }
      acc[eventId].users.push(app);
      return acc;
    }, {});
  }, [filteredApplications]);

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
        <p className="text-white">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1225] to-[#14172e] text-white pt-10">
      <AdminNavbar />

      <div className="pt-20 p-8 max-w-7xl mx-auto">
        <div className="flex gap-4 mb-6">
          {["All", "Hackathon", "Tech Event", "Workshop"].map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-2 rounded-lg cursor-pointer ${activeType === type
                  ? "bg-indigo-600"
                  : "bg-white/10"
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search by event / user / email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-8 p-3 rounded-lg bg-white/10 outline-none"
        />

        {Object.values(groupedApplications).length === 0 && (
          <div className="flex justify-center items-center h-64">
            <h1 className="text-white text-5xl">No events found</h1>
          </div>
        )}

        {Object.values(groupedApplications).map(({ event, users }) => (
          <div key={event._id} className="mb-10">
            {event && (
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-indigo-400">
                  {event.EventTitle}
                </h2>
                <div className="flex gap-4 text-gray-400 text-sm mt-1">
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt /> {formatDate(event.StartDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaMapMarkerAlt /> {event.Venue}
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 hover:shadow-indigo-900/30">
              {users.map((application) => (
                <div
                  key={application._id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-3"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full flex items-center justify-center">
                      <FaUser className="text-white text-sm" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {application.user?.username}
                      </p>
                      <p className="text-sm text-gray-400">
                        {application.user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm flex justify-between">
                    <span className="text-gray-400">Applied:</span>
                    <span>{formatDate(application.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default UserAppliedEvents;
