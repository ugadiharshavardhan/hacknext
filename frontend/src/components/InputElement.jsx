import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import AllEventsPage from "./AllEventsPage";
import { useNavigate } from "react-router";
import { FaLaptopCode, FaLightbulb, FaProjectDiagram } from "react-icons/fa";

function InputElement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [eventType, setEventType] = useState("All Types");
  const [organizer, setOrganizer] = useState("All Organizers");

  const eventTypes = ["All Types", "Hackathon", "Workshop", "Tech Event", "Competition"];
  const organizers = ["All Organizers", "College", "Government", "TechCompany"];

  const scrollToEvents = () => {
    const section = document.getElementById("events-section");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const handleClearfilters = () => {
    setEventType("All Types")
    setOrganizer("All Organizers")
    setSearchQuery("")
  }

  const handleProjects = () => {
    navigate("/projects", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">

      {/* HERO */}
      <section className="min-h-[90vh] flex items-center justify-center px-6 pt-24">
        <div className="max-w-5xl text-center space-y-7">

          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-sm rounded-full
                           bg-violet-500/10 text-violet-300 border border-violet-500/30">
            <FaLaptopCode />
            Discover Your Next Tech Adventure
          </span>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            Discover & Build with{" "}
            <span className="bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
              HackNext
            </span>
          </h1>

          <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
            A unified platform to explore{" "}
            <span className="text-blue-400 font-semibold">Hackathons</span>,{" "}
            <span className="text-emerald-400 font-semibold">Workshops</span> and{" "}
            <span className="text-yellow-400 font-semibold">Tech Events</span>{" "}
            hosted by colleges, universities, government bodies and tech companies.
          </p>

          <p className="text-slate-400 max-w-3xl mx-auto">
            Learn new skills, collaborate with peers, compete, win prizes and gain
            real-world exposure — all from one trusted platform.
          </p>

          <div className="flex justify-center gap-4 pt-6">
            <button
              onClick={scrollToEvents}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold
                         bg-gradient-to-r from-violet-500 to-blue-500
                         hover:opacity-90 transition shadow-lg shadow-violet-500/30 cursor-pointer"
            >
              <FaLightbulb />
              Explore Events
            </button>

            <button
              onClick={handleProjects}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold
                         bg-[#0F172A] hover:bg-[#111827] transition
                         border border-slate-700 text-slate-200 cursor-pointer"
            >
              <FaProjectDiagram />
              Browse Projects
            </button>
          </div>
        </div>
      </section>

      {/* FILTER SECTION */}
      <section
        id="events-section"
        className="px-8 pt-24 max-w-7xl mx-auto"
      >
        <h2 className="text-4xl font-bold mb-2">
          Explore{" "}
          <span className="bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
            Events
          </span>
        </h2>

        <p className="text-slate-400">
          Filter and discover upcoming tech opportunities across India
        </p>

        <div className="mt-8 flex flex-wrap gap-4 items-center
                        bg-[#030A1A] border border-slate-700/40
                        rounded-2xl p-4 shadow-lg">

          {/* SEARCH */}
          <div className="flex items-center flex-1 min-w-[250px]
                          bg-[#020617] px-4 py-3 rounded-xl
                          border border-slate-700/50 focus-within:border-violet-500">
            <FiSearch className="text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search events, titles or keywords"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none w-full text-sm
                         placeholder-slate-500 text-slate-200"
            />
          </div>

          {/* EVENT TYPE */}
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="bg-[#020617] border cursor-pointer border-slate-700/50
                       rounded-xl px-4 py-3 text-sm text-slate-300
                       hover:border-violet-500 transition"
          >
            {eventTypes.map((type, idx) => (
              <option key={idx} className="bg-[#020617]">
                {type}
              </option>
            ))}
          </select>

          {/* ORGANIZER */}
          <select
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
            className="bg-[#020617] border cursor-pointer border-slate-700/50
                       rounded-xl px-4 py-3 text-sm text-slate-300
                       hover:border-blue-500 transition"
          >
            {organizers.map((org, idx) => (
              <option key={idx} className="bg-[#020617]">
                {org}
              </option>
            ))}
          </select>
          <h1 onClick={handleClearfilters} className="text-white bg-[#020617] border p-2 rounded-xl border-slate-700/50 cursor-pointer">clear filters</h1>
        </div>
      </section>

      {/* EVENTS LIST */}
      <section className=" pt-12 max-w-7xl mx-auto">
        <AllEventsPage
          searchQuery={searchQuery}
          eventType={eventType}
          organizer={organizer}
        />
      </section>
    </div>
  );
}

export default InputElement;
