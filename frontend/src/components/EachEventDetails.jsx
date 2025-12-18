import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTrophy,
  FaClock,
  FaArrowLeft,
  FaRegBookmark,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router";
import Cookies from "js-cookie";
import { ThreeDot } from "react-loading-indicators";
import toast from "react-hot-toast";

const EachEventDetails = () => {
  const navigate = useNavigate();
  const { eventid } = useParams();
  const jwtToken = Cookies.get("jwt_token");

  const [isSaved, setIsSaved] = useState(false);
  const [eachData, setEachData] = useState({});
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  /* ---------------- FETCH EVENT DETAILS ---------------- */
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(
          `https://project-hackathon-7utw.onrender.com/user/allevents/${eventid}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setEachData(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchEventDetails();
  }, [eventid, jwtToken]);

  /* ---------------- FETCH SAVED STATUS ---------------- */
  useEffect(() => {
    if (!eventid || !jwtToken) return;

    let isMounted = true;

    const fetchSavedStatus = async () => {
      try {
        const response = await fetch(
          `https://project-hackathon-7utw.onrender.com/user/saved/${eventid}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        if (response.ok && isMounted) {
          const data = await response.json();
          setIsSaved(!!data.isSaved);
        }
      } catch {
        if (isMounted) setIsSaved(false);
      }
    };

    fetchSavedStatus();
    return () => (isMounted = false);
  }, [eventid, jwtToken]);

  /* ---------------- FETCH APPLICATION STATUS ---------------- */
  useEffect(() => {
    if (!eventid || !jwtToken) return;

    let isMounted = true;

    const fetchApplicationStatus = async () => {
      try {
        const response = await fetch(
          `https://project-hackathon-7utw.onrender.com/user/applications/check/${eventid}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        if (response.ok && isMounted) {
          const data = await response.json();
          setIsApplied(!!data.hasApplied);
        }
      } catch {
        if (isMounted) setIsApplied(false);
      }
    };

    fetchApplicationStatus();
    return () => (isMounted = false);
  }, [eventid, jwtToken]);

  /* ---------------- REGISTRATION DEADLINE ---------------- */
  useEffect(() => {
    if (!eachData.StartDate) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(eachData.StartDate);
    deadline.setDate(deadline.getDate() - 1);
    deadline.setHours(0, 0, 0, 0);

    setIsRegistrationOpen(today < deadline);
  }, [eachData]);

  /* ---------------- APPLY HANDLER ---------------- */
  const handleApplyNow = () => {
    if (!eachData.FormLink) {
      navigate(`/events/apply/${eventid}`, { replace: true });
      return;
    }

    if (eachData.FormLink.startsWith("http")) {
      window.open(eachData.FormLink, "_blank", "noopener,noreferrer");
    } else {
      navigate(`/events/apply/${eventid}`, { replace: true });
    }
  };

  /* ---------------- BACK BUTTON ---------------- */
  const handleBackBtn = () => {
    navigate("/user/allevents", { replace: true });
  };

  /* ---------------- SAVE EVENT ---------------- */
  const handleSaveBtn = async () => {
    if (!eventid || !jwtToken) return;

    const prev = isSaved;
    const newState = !isSaved;
    setIsSaved(newState);

    try {
      const response = await fetch(
        "https://project-hackathon-7utw.onrender.com/user/saved",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ eventid, save: newState }),
        }
      );

      if (!response.ok) throw new Error();

      toast.success(newState ? "Event Saved" : "Event Unsaved");
    } catch {
      setIsSaved(prev);
      toast.error("Something went wrong");
    }
  };

  /* ---------------- DATE HELPERS ---------------- */
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "2-digit",
    });

  const deadlineDate = (date) => {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    return formatDate(d);
  };

  /* ---------------- UI ---------------- */
  return (
    <div>
      {eachData.EventTitle ? (
        <div className="min-h-screen bg-gradient-to-br from-[#0f1225] to-[#14172e] text-white px-6 py-24 flex justify-center">
          <div className="w-full max-w-6xl">

            {/* HEADER */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <button
                    onClick={handleBackBtn}
                    className="p-2 cursor-pointer rounded-full border border-white/20 hover:border-white/40 transition"
                  >
                    <FaArrowLeft />
                  </button>

                  <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm">
                    {eachData.Organizer} Event
                  </span>

                  <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-sm">
                    {eachData.EventType}
                  </span>
                </div>

                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">
                  {eachData.EventTitle}
                </h1>

                <p className="text-gray-400 mt-1">
                  Organized by {eachData.OrganisationName}
                </p>
              </div>

              <button
                onClick={handleSaveBtn}
                className={`p-3 rounded-full border cursor-pointer transition ${
                  isSaved
                    ? "bg-white text-black"
                    : "border-white/20 hover:border-white/40"
                }`}
              >
                <FaRegBookmark />
              </button>
            </div>

            {/* CONTENT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <h2 className="text-xl font-semibold mb-4">Event Details</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <Info icon={<FaCalendarAlt />} label="Start Date">
                      {formatDate(eachData.StartDate)}
                    </Info>
                    <Info icon={<FaCalendarAlt />} label="End Date">
                      {formatDate(eachData.EndDate)}
                    </Info>
                    <Info icon={<FaMapMarkerAlt />} label="Location">
                      {eachData.Venue}, {eachData.City}
                    </Info>
                    <Info icon={<FaTrophy />} label="Prize Pool">
                      <span className="text-amber-400">₹ {eachData.PricePool}</span>
                    </Info>
                  </div>
                </Card>

                <Card>
                  <h2 className="text-xl font-semibold mb-3">About This Event</h2>
                  <p className="text-gray-300">{eachData.EventDescription}</p>
                </Card>

                <Card>
                  <h2 className="text-xl font-semibold mb-3">Technologies</h2>
                  <div className="flex flex-wrap gap-2">
                    {eachData.SpecifiedStacks?.split(",").map((s, i) => (
                      <span
                        key={i}
                        className="bg-blue-600 px-4 py-1 rounded-full text-sm font-bold"
                      >
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <h2 className="text-xl font-semibold mb-2">Registration</h2>
                  <p className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                    <FaClock />
                    {isRegistrationOpen
                      ? `Deadline: ${deadlineDate(eachData.StartDate)}`
                      : "Apply Denied"}
                  </p>

                  {isRegistrationOpen ? (
                    <button
                      onClick={handleApplyNow}
                      disabled={isApplied}
                      className={`w-full py-2.5 rounded-xl cursor-pointer transition ${
                        isApplied
                          ? "bg-green-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90"
                      }`}
                    >
                      {isApplied ? "Applied ✓" : "Apply Now"}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl bg-gray-700 cursor-not-allowed"
                    >
                      Expired
                    </button>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
          <ThreeDot color="#6366f1" size="medium" />
        </div>
      )}
    </div>
  );
};

/* UI HELPERS */
const Card = ({ children }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl">
    {children}
  </div>
);

const Info = ({ icon, label, children }) => (
  <div>
    <p className="flex items-center gap-2 text-gray-400">
      {icon} {label}
    </p>
    <p>{children}</p>
  </div>
);

export default EachEventDetails;
