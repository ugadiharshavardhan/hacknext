import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { ThreeDot } from "react-loading-indicators";
import { FaExternalLinkAlt } from "react-icons/fa";

function SavedEvents() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        setLoading(true);

        const url =
          "https://project-hackathon-7utw.onrender.com/user/savedevents";
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("jwt_token")}`,
          },
        };
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data)

        setEvents(data.events || []);
      } catch (error) {
        console.error("Error fetching saved events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, []);

  const Data = events.map((each) => each.eventid).filter((event) => event !== null);
  console.log(Data)
  return (
    <div className="pt-10 w-full">
      {loading ? (
        /* LOADER */
        <div className="flex min-h-screen justify-center items-center">
          <ThreeDot color="#6366f1" size="medium" />
        </div>
      ) : Data.length === 0 ? (
        /* EMPTY STATE */
        <div className="flex min-h-screen flex-col justify-center items-center text-center">
          <h1 className="text-white font-bold text-4xl mb-4">
            No Saved Events
          </h1>
          <p className="text-gray-400 mb-6">
            You haven&apos;t saved any events yet.
          </p>
          <img
            src="https://www.pngkey.com/png/full/30-301664_calendar-emblem-events-icon-white-png.png"
            alt="no-events"
            className="h-[40vh] opacity-70"
          />
        </div>
      ) : (
        /* EVENTS LIST */
        <div className="min-h-screen text-white px-6 animate-fadeIn">
          {/* HEADER */}
          <div className="text-center mb-12 pt-6 animate-slideUp">
            <h1 className="text-4xl font-bold">
              <span className="text-indigo-400">Saved</span> Events
            </h1>
            <p className="text-gray-400 mt-2">
              Quickly access events you bookmarked for later.
            </p>
          </div>

          {/* CARDS */}
          <div className="flex flex-wrap justify-center gap-8">
            {Data.map((each) => (
              <div
                key={each._id}
                className="
                  w-full max-w-[380px]
                  bg-white/5 border border-white/10
                  rounded-2xl p-6
                  flex flex-col items-center text-center
                  shadow-xl hover:shadow-indigo-900/30
                  transition-transform hover:-translate-y-1
                "
              >
                <h1
                  className="
                    text-xl font-bold mb-3
                    bg-gradient-to-r from-indigo-400 to-violet-500
                    bg-clip-text text-transparent
                  "
                >
                  {each.EventTitle}
                </h1>

                <span className="mb-3 bg-indigo-500/20 text-indigo-400 px-4 py-1 rounded-full text-sm font-semibold">
                  {each.EventType}
                </span>

                <p className="text-gray-300 text-sm mb-2">
                  Organised by{" "}
                  <span className="font-semibold text-white">
                    {each.OrganisationName}
                  </span>{" "}
                  in {each.City}
                </p>

                <p className="text-gray-400 text-sm mb-5">
                  Venue:{" "}
                  <span className="text-gray-200 font-medium">
                    {each.Venue}
                  </span>
                </p>

                <button
                  onClick={() =>
                    navigate(`/user/allevents/${each._id}`)
                  }
                  className="
                    w-full mt-auto
                    flex justify-center
                    py-2.5 rounded-xl
                    bg-indigo-600/80 hover:bg-indigo-600
                    text-white font-medium
                    transition cursor-pointer
                  "
                >
                  View Event <FaExternalLinkAlt className="m-1.5" size={12} />
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
