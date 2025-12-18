import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { ThreeDot } from "react-loading-indicators";
import { FaUserGraduate, FaCalendarAlt, FaTrophy, FaUsers } from "react-icons/fa";
import Footer from "../../components/Footer";

const Home = () => {
  const navigate = useNavigate();

  const [allEvents, setAllEvents] = useState([]);
  const [registeredData, setRegisteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleUserEvents = () => navigate("/signin");
  const handleUserEvent = () => navigate("/signup");

  const handleAdminEvents = () => {
    const adminToken = Cookies.get("admin_token");
    adminToken ? navigate("/admin/dashboard") : navigate("/admin/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      const url = "https://project-hackathon-7utw.onrender.com/publicdata";
      const response = await fetch(url);
      const data = await response.json();
      setAllEvents(data.event);
      setRegisteredData(data.register);
      setLoading(false);
    };
    fetchData();
  }, []);

  const ActiveEvents = allEvents.length;
  let prizePool = 0;
  let registered = 0;

  allEvents.forEach((item) => (prizePool += parseInt(item.PricePool || 0)));
  registeredData.forEach(
    (item) => (registered += parseInt(item.membersCount || 0))
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#070b1e]">
        <ThreeDot color="#ffffff" size="medium" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#070b1e] text-white overflow-hidden">
      {/* HERO SECTION */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 relative">
        <h1 className="absolute top-6 left-10 text-3xl font-bold">&lt;/&gt;</h1>


        <button
          onClick={handleUserEvents}
          className="
            absolute top-7 right-40
            cursor-pointer font-bold text-sm text-gray-300
            transition-all duration-200 ease-out
            hover:scale-115 hover:text-white
            hover:drop-shadow-[0_6px_15px_rgba(255,255,255,0.25)]
            active:scale-95
          "
        >
          Sign in
        </button>

        <button
          onClick={handleUserEvent}
          className="
            absolute top-6 right-10
            cursor-pointer font-bold text-sm
            border-2 border-white rounded-xl px-3 py-1
            transition-all duration-200 ease-out
            hover:scale-115 hover:shadow-[0_8px_25px_rgba(99,102,241,0.45)]
            hover:bg-white hover:text-black
            active:scale-95
          "
        >
          Sign up →
        </button>



        <button className="px-4 py-2 text-sm rounded-full bg-gradient-to-r from-purple-600 to-blue-600 mt-4">
          🚀 Discover Your Next Tech Adventure
        </button>

        <h1
          className="
            text-6xl font-bold mt-10
            transition-all duration-300 ease-out

            text-white
            hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600
            hover:bg-clip-text hover:text-transparent

            hover:scale-105
            hover:drop-shadow-[0_6px_15px_rgba(0,0,0,0.35)]
            active:scale-100
          "
        >
          HackNext
        </h1>


        <p className="text-gray-300 text-lg max-w-2xl text-center mt-6">
          Your gateway to hackathons, workshops, and tech competitions. Discover
          opportunities, collaborate, and grow your career.
        </p>

        <div className="mt-10 flex gap-4">
          <button
            onClick={handleUserEvents}
            className="px-7 py-3 transition-all duration-200 ease-out
            hover:scale-115 cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold"
          >
            Explore Events →
          </button>

          <button
            onClick={handleAdminEvents}
            className="px-7 py-3 cursor-pointer bg-black/40 border border-white/10 rounded-lg"
          >
            Admin Community
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 bg-violet-950 px-8 py-10 rounded-2xl">
          <Stat title="Active Events" value={`${ActiveEvents}+`} />
          <Stat title="Registered Students" value={`${registered}+`} />
          <Stat title="Total Prize Pool" value={`₹ ${prizePool}+`} />
          <Stat title="Success Rate" value="94%" />
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-14">
          What You Can Do on HackNext
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          <Feature
            icon={<FaCalendarAlt />}
            title="Find Events"
            desc="Discover hackathons, workshops, and competitions in one place."
          />
          <Feature
            icon={<FaUserGraduate />}
            title="Participate & Learn"
            desc="Gain real-world experience, certificates, and exposure."
          />
          <Feature
            icon={<FaUsers />}
            title="Build Teams"
            desc="Collaborate with students and developers across colleges."
          />
          <Feature
            icon={<FaTrophy />}
            title="Win & Grow"
            desc="Compete for prizes, recognition, and career opportunities."
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-[#0b102a] px-6">
        <h2 className="text-4xl font-bold text-center mb-14">
          How HackNext Works
        </h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <Step number="01" title="Create Account" />
          <Step number="02" title="Explore Events" />
          <Step number="03" title="Participate & Win" />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center px-6">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Start Your Tech Journey?
        </h2>
        <p className="text-gray-300 mb-10">
          Join thousands of students already building their future with HackNext.
        </p>

        <button
          onClick={handleUserEvent}
          className="px-10 py-4 cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-lg font-semibold"
        >
          Get Started for Free →
        </button>
      </section>
      <Footer />
    </div>
  );
};

const Stat = ({ title, value }) => (
  <div className="text-center">
    <div className="text-3xl font-bold">{value}</div>
    <p className="text-gray-400 mt-2">{title}</p>
  </div>
);

const Feature = ({ icon, title, desc }) => (
  <div className="bg-[#0f1538] p-6 rounded-xl border border-white/10 hover:scale-105 transition">
    <div className="text-3xl mb-4 text-purple-400">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400 text-sm">{desc}</p>
  </div>
);

const Step = ({ number, title }) => (
  <div className="bg-[#0f1538] p-8 rounded-xl border border-white/10">
    <div className="text-purple-500 text-2xl font-bold mb-4">{number}</div>
    <h3 className="text-xl font-semibold">{title}</h3>
  </div>
);

export default Home;
