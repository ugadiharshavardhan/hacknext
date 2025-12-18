import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
import Cookies from "js-cookie";
import { ThreeDot } from "react-loading-indicators";
import {
  FaLaptopCode,
  FaCode,
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaServer,
  FaGitAlt,
} from "react-icons/fa";
import {
  SiJavascript,
  SiMongodb,
  SiExpress,
  SiNodedotjs,
  SiFigma,
} from "react-icons/si";

function EachProject() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [eachProject, setEachProject] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const url = `https://project-hackathon-7utw.onrender.com/projects/${id}`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("jwt_token")}`,
        },
      };
      const response = await fetch(url, options);
      const data = await response.json();
      setEachProject(data.events);
      setLoading(false);
    };
    fetchData();
  }, [id]);

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

  const Eachstack = eachProject.stack || [];

  const functionalityList =
    eachProject?.functionality
      ?.split(".")
      .map((item) => item.trim())
      .filter((item) => item !== "") || [];

  const handleBackBtn = () => {
    navigate("/projects",{replace:true})
  }


  return (
    <div>
      {loading ? (
        <div className="min-h-screen w-full bg-gradient-to-br from-[#0f1225] to-[#14172e] flex justify-center items-center">
          <ThreeDot color="#6366f1" size="medium" />
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-[#0f1225] to-[#14172e] text-white px-6 py-24 flex justify-center items-start">
          <button
            onClick={handleBackBtn}
            className="p-2 cursor-pointer rounded-full border relative right-70 top-5 border-white/20 hover:border-white/40 transition"
          >
            <FaArrowLeft />
          </button>
          <div
            className="w-full max-w-4xl rounded-2xl bg-white/5 border border-white/10 
                       p-8 shadow-xl hover:shadow-indigo-900/30 transition-all"
          >
            {/* TITLE + LEVEL */}
            <div className="flex justify-between items-center mb-4">
              <h2
                className="
                  text-2xl font-bold
                  bg-gradient-to-r from-indigo-400 to-violet-500
                  bg-clip-text text-transparent
                "
              >
                {eachProject.title}
              </h2>

              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold ${
                  eachProject.level === "Beginner"
                    ? "bg-green-500 text-white"
                        : eachProject.level === "Intermediate"
                        ? "bg-orange-500 text-white"
                        : eachProject.level === "easy" 
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                }`}
              >
                {eachProject.level}
              </span>
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              {eachProject.description}
            </p>

            {/* FUNCTIONALITY */}
            <h1 className="mb-3 text-lg font-semibold text-indigo-400">
              Functionality of Project
            </h1>

            <div className="flex flex-col gap-2 mb-6">
              {functionalityList.map((line, index) => (
                <p key={index} className="text-gray-300 text-sm">
                  • {line}.
                </p>
              ))}
            </div>

            {/* STACK */}
            <ul className="flex gap-3 flex-wrap mb-6">
              {Eachstack.map((item, index) => (
                <li
                  key={index}
                  className="
                    flex items-center gap-2
                    bg-white/5 border border-white/10
                    px-3 py-1 rounded-full text-sm
                    hover:border-white/30 transition
                  "
                >
                  <span className="text-lg">
                    {stackIcons[item] || <FaCode />}
                  </span>
                  <span className="text-gray-200">{item}</span>
                </li>
              ))}
            </ul>

            {/* REFERENCES */}
            {(eachProject.gitLink || eachProject.figmaLink) && (
              <h1 className="text-lg font-semibold text-indigo-400 mb-3">
                Reference Links
              </h1>
            )}

            <div className="flex flex-col gap-3">
              {eachProject.figmaLink && (
                <a
                  href={eachProject.figmaLink}
                  target="__blank"
                  className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 transition"
                >
                  <SiFigma className="text-[#F24E1E] text-xl" />
                  <span className="underline">Figma Design</span>
                </a>
              )}

              {eachProject.gitLink && (
                <a
                  href={eachProject.gitLink}
                  target="__blank"
                  className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 transition"
                >
                  <FaGitAlt className="text-[#F05033] text-xl" />
                  <span className="underline">Git Repository</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EachProject;
