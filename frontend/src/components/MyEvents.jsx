import React, { useEffect, useState, useContext } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTrophy,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { FcAbout } from "react-icons/fc";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import CounterContext from "../contextApi/TotalCountsContext";
import Cookies from "js-cookie";
import { ThreeDot } from "react-loading-indicators";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../config";

function MyEvents({ setForm, dropValue }) {
  const [MyEventsdata, setMyEventsdata] = useState([]);
  const [Projectdata, setProjectData] = useState([]);
  const { setCount } = useContext(CounterContext);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH EVENTS ---------------- */
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/events/my`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("admin_token")}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setMyEventsdata([]);
          return;
        }

        setMyEventsdata(data.events || []);
      } catch (error) {
        console.log(error)
        setMyEventsdata([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  /* ---------------- FETCH PROJECTS ---------------- */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/projects`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("admin_token")}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setProjectData([]);
          return;
        }

        setProjectData(data.events || []);
      } catch (error) {
        console.log(error)
        setProjectData([]);
      }
    };

    fetchProjects();
  }, []);

  /* ---------------- UPDATE COUNT ---------------- */
  useEffect(() => {
    setCount(MyEventsdata.length);
  }, [MyEventsdata, setCount]);

  /* ---------------- DELETE EVENT ---------------- */
  const handleDeleteEachItem = async (id) => {
    const res = await fetch(
      `${BACKEND_URL}/events/${id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("admin_token")}`,
        },
      }
    );

    if (res.ok) {
      toast.success("Event deleted successfully");
      setMyEventsdata((prev) => prev.filter((item) => item._id !== id));
    } else {
      toast.error("Delete failed");
    }
  };

  /* ---------------- DELETE PROJECT ---------------- */
  const handleDeleteProject = async (id) => {
    const res = await fetch(
      `${BACKEND_URL}/projects/${id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("admin_token")}`,
        },
      }
    );

    if (res.ok) {
      toast.success("Project deleted successfully");
      setProjectData((prev) => prev.filter((item) => item._id !== id));
    } else {
      toast.error("Delete failed");
    }
  };

  /* ---------------- FORMAT DATE ---------------- */
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  /* ---------------- EVENT CARD ---------------- */
  const EventCard = ({ each }) => (
    <li className="w-full max-w-3xl mx-auto mb-6">
      <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">

        {/* HEADER */}
        <div className="flex justify-between items-start gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {each.EventTitle} <span className="px-2 text-xs rounded-full bg-green-500/50 text-white border border-purple-500/30">verified</span>
            </h2>

            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="px-3 py-1 text-xs rounded-full bg-green-600/20 text-green-400 border border-green-500/30">
                {each.Organizer}
              </span>
              <span className="px-3 py-1 text-xs rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/30">
                {each.EventType}
              </span>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 text-gray-400">
            <button
              onClick={() =>
                setForm({ open: true, event: each, id: each._id })
              }
              className="hover:text-blue-400 transition"
            >
              <FiEdit size={18} />
            </button>

            <button
              onClick={() => handleDeleteEachItem(each._id)}
              className="hover:text-red-400 transition"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="mt-4 flex gap-2 text-gray-400">
          <FcAbout className="mt-1" />
          <p className="text-sm leading-relaxed">
            {each.EventDescription}
          </p>
        </div>

        {/* META */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-blue-400" />
            {formatDate(each.StartDate)} – {formatDate(each.EndDate)}
          </div>

          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-red-400" />
            {each.Venue}, {each.City}
          </div>

          <div className="flex items-center gap-2">
            <FaTrophy className="text-yellow-400" />
            {each.PricePool}
          </div>
        </div>

        {/* STACK */}
        {each.SpecifiedStacks && (
          <div className="mt-5 flex flex-wrap gap-2">
            {each.SpecifiedStacks.split(",").map((stack, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30"
              >
                {stack.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </li>
  );

  /* ---------------- PROJECT CARD ---------------- */
  const ProjectCard = ({ each }) => (
    <li className="w-full max-w-3xl mx-auto mb-6">
      <div className="bg-[#020617] border border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold text-white">
            {each.title}
          </h2>

          <button
            onClick={() => handleDeleteProject(each._id)}
            className="text-gray-400 hover:text-red-400 transition"
          >
            <FiTrash2 size={18} />
          </button>
        </div>

        <p className="mt-3 text-sm text-gray-400">
          {each.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {each.stack.map((s, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </li>
  );

  /* ---------------- LOADER ---------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <ThreeDot color="#ffffff" />
      </div>
    );
  }

  /* ---------------- EMPTY STATE ---------------- */
  if (MyEventsdata.length === 0 && dropValue !== "Projects") {
    return (
      <div className="flex flex-col items-center mt-20 text-gray-400">
        <FaRegCalendarAlt size={80} />
        <h1 className="text-xl font-bold mt-3">No Events Created</h1>
      </div>
    );
  }

  /* ---------------- RENDER ---------------- */
  return (
    <div>
      {dropValue === "Projects" ? (
        <ul>
          {Projectdata.map((each) => (
            <ProjectCard key={each._id} each={each} />
          ))}
        </ul>
      ) : dropValue === "All Events" ? (
        <>
          <ul>
            {MyEventsdata.map((each) => (
              <EventCard key={each._id} each={each} />
            ))}
          </ul>
          <ul>
            {Projectdata.map((each) => (
              <ProjectCard key={each._id} each={each} />
            ))}
          </ul>
        </>
      ) : (
        <ul>
          {MyEventsdata
            .filter((e) => e.EventType === dropValue)
            .map((each) => (
              <EventCard key={each._id} each={each} />
            ))}
        </ul>
      )}
    </div>
  );
}

export default MyEvents;
