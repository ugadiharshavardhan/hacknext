// import React, { useEffect, useState, useContext } from "react";
// import { FaCalendarAlt, FaMapMarkerAlt, FaTrophy } from "react-icons/fa";
// import { FcAbout } from "react-icons/fc";
// import { FiEdit, FiTrash2 } from "react-icons/fi";
// import CounterContext from "../contextApi/TotalCountsContext";
// import Cookies from "js-cookie";
// import { FaRegCalendarAlt } from "react-icons/fa";
// import { ThreeDot } from "react-loading-indicators";
// import toast from "react-hot-toast";


// function MyEvents({ setForm, dropValue }) {
//   const [MyEventsdata, setMyEventsdata] = useState([]);
//   const [Projectdata, setProjectData] = useState([]);
//   const { setCount } = useContext(CounterContext);
//   const [loading, setLoading] = useState(true);

//   // Fetch Events
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const response = await fetch(
//           "https://project-hackathon-7utw.onrender.com/events/my",
//           {
//             method: "GET",
//             credentials: "include",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${Cookies.get("admin_token")}`,
//             },
//           }
//         );
//         const data = await response.json();

//         if (!response.ok) {
//           console.error("Error fetching events:", data.message);
//           setMyEventsdata([]);
//           return;
//         }

//         setMyEventsdata(data.events || []);
//       } catch (error) {
//         console.error("Fetch error:", error);
//         setMyEventsdata([]);
//       } finally {
//         setLoading(false); 
//       }
//     };
//     fetchEvents();
//   }, []);

//   // Fetch Projects
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const response = await fetch(
//           "https://project-hackathon-7utw.onrender.com/projects",
//           {
//             method: "GET",
//             credentials: "include",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${Cookies.get("admin_token")}`,
//             },
//           }
//         );
//         const data = await response.json();

//         if (!response.ok) {
//           console.error("Error fetching projects:", data.message);
//           setProjectData([]);
//           return;
//         }

//         setProjectData(data.events || []);
//       } catch (error) {
//         console.error("Fetch error:", error);
//         setProjectData([]);
//       }
//     };
//     fetchProjects();
//   }, []);

//   useEffect(() => {
//     setCount(MyEventsdata.length);
//   }, [MyEventsdata]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-[300px]">
//         <div className="absolute flex items-center justify-center bg-black/40">
//               <ThreeDot color="#ffffff" />
//             </div>
//       </div>
//     );
//   }

//   // Delete Event
//   const handleDeleteEachItem = async (id) => {
//     const res = await fetch(
//       `https://project-hackathon-7utw.onrender.com/events/${id}`,
//       {
//         method: "DELETE",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${Cookies.get("admin_token")}`,
//         },
//       }
//     );
//     if (res.ok) {
//       setMyEventsdata((prev) => prev.filter((item) => item._id !== id));
//     } else {
//       alert("Delete Event Failed");
//     }
//   };

//   // Delete Project
//   const handleDeleteProject = async (id) => {
//     const res = await fetch(
//       `https://project-hackathon-7utw.onrender.com/projects/${id}`,
//       {
//         method: "DELETE",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${Cookies.get("admin_token")}`,
//         },
//       }
//     );
//     toast.success("event deleted")
//     if (res.ok) {
//       setProjectData((prev) => prev.filter((item) => item._id !== id));
//     } else {
//       alert("Delete Project Failed");
//     }
//   };

//   // Format Date
//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, "0");
//     const monthNames = [
//       "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//     ];
//     return `${monthNames[date.getMonth()]} ${day}, ${date.getFullYear()}`;
//   };

//   const EventCard = ({ each }) => (
//     <li className="m-2 w-full">
//       <div className="bg-gray-900 text-white p-6 rounded-xl shadow-md w-full max-w-xl mx-auto">
//         <div className="flex items-center justify-between mb-2">
//           <div className="flex items-center gap-2">
//             <h2 className="text-xl font-semibold">
//               {each.EventTitle.toUpperCase()}
//             </h2>
//             <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
//               {each.Organizer}
//             </span>
//             <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
//               {each.EventType}
//             </span>
//           </div>

//           <div className="flex gap-2 text-gray-400">
//             <button
//               className="hover:text-white"
//               onClick={() => setForm({ open: true, event: each, id: each._id })}
//             >
//               <FiEdit size={18} />
//             </button>

//             <button
//               onClick={() => handleDeleteEachItem(each._id)}
//               className="hover:text-white cursor-pointer"
//             >
//               <FiTrash2 size={18} />
//             </button>
//           </div>
//         </div>

//         <div className="flex">
//           <span className="m-1">
//             <FcAbout />
//           </span>
//           <p className="text-gray-400 text-sm mb-4">
//             {each.EventDescription}
//           </p>
//         </div>

//         <div className="flex items-center gap-3 text-gray-400 text-sm mb-4">
//           <FaCalendarAlt />
//           <span>
//             {formatDate(each.StartDate)} - {formatDate(each.EndDate)}
//           </span>

//           <div className="flex items-center gap-1">
//             <FaMapMarkerAlt />
//             <span>
//               {each.Venue}, {each.City}, {each.State}
//             </span>
//           </div>

//           <div className="flex items-center gap-1">
//             <FaTrophy />
//             <span>{each.PricePool}</span>
//           </div>
//         </div>

//         <ul className="flex gap-2 flex-wrap">
//           {each.SpecifiedStacks?.split(",").map((stack, index) => (
//             <li
//               key={index}
//               className="bg-blue-600 px-3 py-1 rounded-full text-xs"
//             >
//               {stack.trim()}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </li>
//   );

//   const ProjectCard = ({ each }) => (
//     <li className="m-2 w-full">
//       <div className="bg-gray-900 text-white p-6 rounded-xl shadow-md w-full max-w-xl mx-auto">
//         <div className="flex items-center justify-between mb-2">
//           <h2 className="text-xl font-semibold">{each.title}</h2>

//           <button
//             onClick={() => handleDeleteProject(each._id)}
//             className="hover:text-white text-gray-400 cursor-pointer"
//           >
//             <FiTrash2 size={18} />
//           </button>
//         </div>

//         <p className="text-gray-400 text-sm mb-4">{each.description}</p>

//         <ul className="flex gap-2 flex-wrap">
//           {each.stack.map((s, index) => (
//             <li key={index} className="bg-blue-600 px-3 py-1 rounded-full text-xs">
//               {s}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </li>
//   );

//   if (MyEventsdata.length === 0 && dropValue !== "Projects") {
//     return (
//       <div className="flex flex-col relative top-20 justify-center items-center">
//         <FaRegCalendarAlt size={100} />
//         <h1 className="text-xl pt-2 font-bold">No Events Created</h1>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {dropValue !== "All Events" ? (
//         <>
//           {dropValue === "Projects" ? (
//             <ul className="flex flex-col items-start">
//               {Projectdata.map((each) => (
//                 <ProjectCard key={each._id} each={each} />
//               ))}
//             </ul>
//           ) : (
//             <ul className="flex flex-col items-start">
//               {MyEventsdata
//                 .filter((e) => e.EventType === dropValue)
//                 .map((each) => (
//                   <EventCard key={each._id} each={each} />
//                 ))}
//             </ul>
//           )}
//         </>
//       ) : (
//         <div>
//           <ul className="flex flex-col items-start">
//             {MyEventsdata.map((each) => (
//               <EventCard key={each._id} each={each} />
//             ))}
//           </ul>

//           <ul className="flex flex-col items-start">
//             {Projectdata.map((each) => (
//               <ProjectCard key={each._id} each={each} />
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

// export default MyEvents;



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
          "https://project-hackathon-7utw.onrender.com/events/my",
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
          "https://project-hackathon-7utw.onrender.com/projects",
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
      `https://project-hackathon-7utw.onrender.com/events/${id}`,
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
      `https://project-hackathon-7utw.onrender.com/projects/${id}`,
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
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
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
              {each.EventTitle}
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
