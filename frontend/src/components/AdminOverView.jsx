import { useContext, useEffect, useState } from "react";
import CounterContext from "../contextApi/TotalCountsContext";
import Cookies from "js-cookie";
import { Calendar, Trophy, BarChart2 } from "lucide-react";
import { FaUsersCog } from "react-icons/fa";
import { ThreeDot } from "react-loading-indicators";
import { BACKEND_URL } from "../config";

function AdminOverView() {
  const { count } = useContext(CounterContext);

  const [hackathonsCount, setHackathonCount] = useState(0);
  const [WorkShopCount, setWorkShopCount] = useState(0);
  const [TechCount, setTechCount] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const stats = [
    {
      title: "Total Events",
      value: count,
      icon: <Calendar className="text-purple-500 w-6 h-6" />,
    },
    {
      title: "Workshops",
      value: WorkShopCount,
      icon: <FaUsersCog className="text-blue-500 w-6 h-6" />,
    },
    {
      title: "Hackathons",
      value: hackathonsCount,
      icon: <Trophy className="text-green-500 w-6 h-6" />,
    },
    {
      title: "Tech Events",
      value: TechCount,
      icon: <BarChart2 className="text-yellow-500 w-6 h-6" />,
    },
  ];

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/events/my`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("admin_token")}`,
            },
          }
        );
        const data = await response.json();
        setData(data.events);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, []);

  useEffect(() => {
    if (!data || data.length === 0) return;

    let hack = 0;
    let work = 0;
    let tech = 0;

    data.forEach((item) => {
      if (item.EventType === "Hackathon") hack++;
      else if (item.EventType === "Workshop") work++;
      else tech++;
    });

    setHackathonCount(hack);
    setWorkShopCount(work);
    setTechCount(tech);
  }, [data]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <ThreeDot color="#ffffff" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-gray-900 p-6 rounded-xl shadow-md flex flex-col items-center justify-center hover:shadow-lg hover:scale-105 transition-all"
        >
          {item.icon}
          <h2 className="text-2xl font-bold mt-2">{item.value}</h2>
          <p className="text-gray-400 text-sm">{item.title}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminOverView;
