import React, { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { ThreeDot } from "react-loading-indicators";
import { FaCalendarAlt, FaMapMarkerAlt, FaUser, FaTimes, FaEnvelope, FaBuilding, FaGraduationCap, FaPhoneAlt, FaFileAlt } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import AdminNavbar from "./AdminNavbar";
import { BACKEND_URL } from "../config";

const UserDetailsModal = ({ isOpen, onClose, application }) => {
  if (!isOpen || !application) return null;

  const { user, event } = application;
  const isTeamEvent = application.isTeamRegistered;
  const teammates = application.teamMembers || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-[#0f1538] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-scaleIn flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#0a0e27]">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-violet-600 dark:from-indigo-400 dark:to-violet-500 bg-clip-text text-transparent">
              Application Details
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Applied on {new Date(application.createdAt).toLocaleDateString()}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content - Scrollable area */}
        <div className="p-8 overflow-y-auto custom-scrollbar bg-gradient-to-br from-indigo-50 to-white dark:from-[#0f1225] dark:to-[#14172e] flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Left Column - User Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-300 dark:border-white/10 pb-2">Applicant Profile</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400 mt-1"><FaUser /></div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-500 uppercase tracking-wider font-semibold">Full Name</p>
                      <p className="text-gray-900 dark:text-white font-medium">{application.fullName || user?.username || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-violet-100 dark:bg-violet-500/10 rounded-lg text-violet-600 dark:text-violet-400 mt-1"><FaEnvelope /></div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-500 uppercase tracking-wider font-semibold">Email Address</p>
                      <p className="text-gray-900 dark:text-white font-medium">{user?.email || 'N/A'}</p>
                    </div>
                  </div>
                  {application.phoneNumber && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400 mt-1"><FaPhoneAlt /></div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-500 uppercase tracking-wider font-semibold">Contact Number</p>
                        <p className="text-gray-900 dark:text-white font-medium">{application.phoneNumber}</p>
                      </div>
                    </div>
                  )}
                  {application.institution && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-pink-100 dark:bg-pink-500/10 rounded-lg text-pink-600 dark:text-pink-400 mt-1"><FaGraduationCap /></div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-500 uppercase tracking-wider font-semibold">Institution</p>
                        <p className="text-gray-900 dark:text-white font-medium">{application.institution}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Event & Team Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-300 dark:border-white/10 pb-2">Event Details</h3>
                <div className="bg-white dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/5 border-l-4 border-l-indigo-500 shadow-sm">
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">{event?.EventTitle}</h4>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs rounded-md border border-indigo-200 dark:border-indigo-500/20">{event?.EventType}</span>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 text-xs rounded-md border border-green-200 dark:border-green-500/20">{event?.Organizer}</span>
                  </div>
                </div>
              </div>

              {/* Registration Type & Team info (if applicable based on the schema) */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-300 dark:border-white/10 pb-2">Registration Status</h3>
                <div className="bg-white dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/5 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Type</span>
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${isTeamEvent ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30' : 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30'}`}>
                      {isTeamEvent ? 'Team Participation' : 'Individual'}
                    </span>
                  </div>
                  {isTeamEvent && (
                    <div className="mt-4 pt-4 border-t border-gray-300 dark:border-white/10">
                      <p className="text-xs text-gray-600 dark:text-gray-500 uppercase tracking-wider font-semibold mb-2">Team Members ({teammates.length})</p>
                      <ul className="space-y-2">
                        {teammates.map((member, idx) => (
                          <li key={idx} className="text-sm text-gray-800 dark:text-gray-300 flex justify-between bg-gray-100 dark:bg-black/20 px-3 py-2 rounded-md">
                            <span>{member.name}</span>
                            <span className="text-gray-500">{member.email}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-300 dark:border-white/5 bg-gray-50 dark:bg-[#0a0e27] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-xl font-medium transition-all cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};


function UserAppliedEvents() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeType, setActiveType] = useState("All");

  // Separation of input state and applied search query
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");

  const [selectedApplication, setSelectedApplication] = useState(null);

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

  const handleSearch = () => {
    setAppliedSearchQuery(searchInput);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesType =
        activeType === "All" ||
        app.event?.EventType === activeType;

      const searchText = appliedSearchQuery.toLowerCase();
      const matchesSearch =
        app.event?.EventTitle?.toLowerCase().includes(searchText) ||
        app.user?.username?.toLowerCase().includes(searchText) ||
        app.user?.email?.toLowerCase().includes(searchText);

      return matchesType && matchesSearch;
    });
  }, [applications, activeType, appliedSearchQuery]);


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
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-[#0f1225] dark:to-[#14172e]">
        <ThreeDot color="#6366f1" size="medium" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-[#0f1225] dark:to-[#14172e]">
        <p className="text-gray-900 dark:text-white">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] pb-12 bg-gray-50 dark:bg-[#070b1e] text-gray-900 dark:text-white pt-10 flex flex-col items-center">
      <AdminNavbar />

      <div className="pt-24 px-6 md:px-10 w-full max-w-7xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-white">
          Manage <span className="bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">Applications</span>
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {["All", "Hackathon", "Tech Event", "Workshop"].map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-5 py-2.5 rounded-xl cursor-pointer font-medium transition-all duration-300 text-sm ${activeType === type
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20 text-white"
                  : "bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search event, user, email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#0f1538] text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors shadow-lg shadow-indigo-500/20 cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>

        {Object.values(groupedApplications).length === 0 && (
          <div className="flex flex-col flex-1 justify-center items-center h-[50vh] border border-gray-200 dark:border-white/5 rounded-2xl bg-white dark:bg-white/5 shadow-sm">
            <FaUser className="text-6xl text-gray-300 dark:text-gray-700 mb-4" />
            <h2 className="text-xl font-medium text-gray-600 dark:text-gray-400">No applications found</h2>
            <p className="text-gray-500 mt-2 text-sm">Try adjusting your search or filters.</p>
          </div>
        )}

        {Object.values(groupedApplications).map(({ event, users }) => (
          <div key={event._id} className="mb-12 bg-white dark:bg-black/20 p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-white/5 shadow-md">
            {event && (
              <div className="mb-8 border-b border-gray-200 dark:border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    {event.EventTitle}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400 text-sm">
                    <span className="flex items-center gap-2 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-transparent px-3 py-1.5 rounded-lg">
                      <FaCalendarAlt /> {formatDate(event.StartDate)}
                    </span>
                    <span className="flex items-center gap-2 bg-pink-100 dark:bg-pink-500/10 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-transparent px-3 py-1.5 rounded-lg">
                      <FaMapMarkerAlt /> {event.Venue}
                    </span>
                  </div>
                </div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider text-center">Total Applicants</p>
                  <p className="text-2xl font-bold text-center text-indigo-500 dark:text-indigo-400">{users.length}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((application) => (
                <div
                  key={application._id}
                  className="bg-gray-50 dark:bg-[#0f1538] border border-gray-200 dark:border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-900/20 hover:border-indigo-500/50 flex flex-col h-full"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                      <span className="text-xl font-bold text-white uppercase">{application.user?.username?.charAt(0) || <FaUser size={18} />}</span>
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate" title={application.user?.username}>
                        {application.user?.username || 'Unknown User'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate" title={application.user?.email}>
                        {application.user?.email || 'No email provided'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto space-y-4">
                    <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-200 dark:border-white/5">
                      <span className="font-medium uppercase tracking-wider">Applied On</span>
                      <span>{formatDate(application.createdAt)}</span>
                    </div>
                    <button
                      onClick={() => setSelectedApplication(application)}
                      className="w-full py-2.5 rounded-xl border border-indigo-500/30 text-indigo-600 dark:text-indigo-300 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors text-sm cursor-pointer"
                    >
                      View Full Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>

      <UserDetailsModal
        isOpen={!!selectedApplication}
        onClose={() => setSelectedApplication(null)}
        application={selectedApplication}
      />
    </div>
  );
}

export default UserAppliedEvents;
