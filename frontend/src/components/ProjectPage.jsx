import React, { useEffect, useState } from "react";
import {
  FaLaptopCode,
  FaCode,
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaServer,
} from "react-icons/fa";
import {
  SiJavascript,
  SiMongodb,
  SiExpress,
  SiNodedotjs,
} from "react-icons/si";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { FiSearch } from "react-icons/fi";
import { ThreeDot } from "react-loading-indicators";
import { FaExternalLinkAlt } from "react-icons/fa";
import { BACKEND_URL } from "../config";

function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [mainData, setMainData] = useState(projects);
  const [Value, setValue] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const url = `${BACKEND_URL}/user/projects`;
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("jwt_token")}`,
          },
        };

        const response = await fetch(url, options);
        const data = await response.json();
        setProjects(data.events);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectData();
  }, []);

  useEffect(() => {
    setMainData(projects);
  }, [projects]);

  // Stack icon mapping
  const stackIcons = {
    HTML: <FaHtml5 className="text-orange-400" />,
    CSS: <FaCss3Alt className="text-blue-400" />,
    JavaScript: <SiJavascript className="text-yellow-300" />,
    React: <FaReact className="text-sky-400" />,
    "API Fetch": <FaCode className="text-gray-300" />,
    LocalStorage: <FaServer className="text-emerald-300" />,
    "Node.js": <SiNodedotjs className="text-green-400" />,
    Express: <SiExpress className="text-gray-400" />,
    MongoDB: <SiMongodb className="text-green-500" />,
    Socketio: <FaLaptopCode className="text-violet-400" />,
  };

  const handleInput = (e) => {
    const input = e.target.value;
    setValue(input);
    if (input.trim() === "") {
      setMainData(projects);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const input = Value.trim();

      if (input !== "") {
        const filtered = projects.filter((each) =>
          each.stack.some((tech) =>
            tech.toLowerCase().includes(input.toLowerCase())
          )
        );
        setMainData(filtered);
      } else {
        setMainData(projects);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1225] to-[#14172e] text-white px-8 py-20">
      {loading ? (
        <div className="flex min-h-screen justify-center items-center">
          <ThreeDot color="#6366f1" size="medium" />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="text-center mb-5 mt-5">
            <h1 className="text-4xl font-bold">
              <span className="text-indigo-400">HackNext</span> Projects
            </h1>
            <p className="text-gray-400 mt-2">
              Build real-world projects to boost your development skills.
            </p>
          </div>

          {/* Search */}
          <p className="pb-2 text-gray-300">Search based on stacks</p>
          <div
            className="
              w-full md:w-[520px] mb-8 p-[1.5px] rounded-xl
              bg-white/10
              focus-within:bg-gradient-to-r
              focus-within:from-blue-500
              focus-within:to-violet-600
              transition-all duration-300
            "
          >
            <div className="flex items-center gap-3 bg-[#0f1225] rounded-[10px] px-4 py-3">
              <FiSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search stacks of projects"
                value={Value}
                onKeyDown={handleKeyPress}
                onChange={(e) => handleInput(e)}
                className="
                  bg-transparent outline-none text-sm w-full
                  placeholder-gray-500 text-gray-200
                "
              />
            </div>
          </div>



          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainData.map((project, id) => (
              <div
                key={id}
                className="rounded-2xl bg-white/5 border border-white/10 p-6 shadow-xl hover:shadow-indigo-900/30 transition-transform hover:-translate-y-1"
              >
                {/* Title + Level */}
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold">
                    {project.title}
                  </h2>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${project.level === "Beginner"
                        ? "bg-green-500 text-white"
                        : project.level === "Intermediate"
                          ? "bg-orange-500 text-white"
                          : project.level === "easy"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                      }`}
                  >
                    {project.level}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Stack */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.stack.map((tech, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs text-gray-200"
                    >
                      {stackIcons[tech]}
                      {tech}
                    </div>
                  ))}
                </div>

                {/* Action */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/projects/${project._id}`);
                  }}
                  className="w-full flex justify-center mt-2 border border-white/10 hover:border-black/20 bg-indigo-600/20 hover:bg-gradient-to-r hover:from-blue-500 hover:to-violet-600 text-indigo-300 py-2 rounded-xl font-medium transition hover:text-white cursor-pointer"
                >
                  View Project <FaExternalLinkAlt className="m-1.5" size={12} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProjectsPage;
