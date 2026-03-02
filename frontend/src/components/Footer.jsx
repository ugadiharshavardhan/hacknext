import { useState } from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaTimes, FaEnvelope, FaMapMarkerAlt, FaGlobe } from "react-icons/fa";
import { useNavigate } from "react-router";

const Popup = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#0f1538] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar text-gray-700 dark:text-gray-300 leading-relaxed">
          {children}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

function Footer() {
  const navigate = useNavigate();
  const [activePopup, setActivePopup] = useState(null);

  const handleGit = () => window.open("https://github.com/ugadiharshavardhan", "_blank");
  const handleLinkedin = () => window.open("https://www.linkedin.com/in/ugadiharshavardhan/", "_blank");
  const handleTwitter = () => window.open("https://twitter.com/", "_blank");

  const handleAllEvents = () => navigate("/user/allevents");
  const handleSavedEvents = () => navigate("/user/account");
  const handleAppliedEvents = () => navigate("/user/account");

  const closePopup = () => setActivePopup(null);

  const popups = {
    about: {
      title: "About HackNext",
      content: (
        <div className="space-y-4">
          <p className="text-lg font-medium text-gray-900 dark:text-white italic">"Empowering the next generation of innovators through tech synergy."</p>
          <p>
            HackNext is a premier platform dedicated to bridging the gap between talent and opportunity. We believe that every student and developer deserves a stage to showcase their skills, learn from peers, and grow their professional network.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
              <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-1">Our Mission</h4>
              <p className="text-sm">To democratize access to high-quality hackathons and technical workshops across India.</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
              <h4 className="font-bold text-violet-600 dark:text-violet-400 mb-1">Our Vision</h4>
              <p className="text-sm">Becoming the go-to ecosystem for technical growth and collaborative innovation.</p>
            </div>
          </div>
        </div>
      )
    },
    contact: {
      title: "Get in Touch",
      content: (
        <div className="space-y-6">
          <p>Have questions or want to partner with us? Our team is always ready to help you navigate your journey on HackNext.</p>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-gray-300">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <FaEnvelope size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Email Us</p>
                <p className="text-gray-900 dark:text-white hover:text-indigo-500 dark:hover:text-indigo-400 transition cursor-pointer">support@hacknext.io</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-300">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                <FaMapMarkerAlt size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Location</p>
                <p className="text-gray-900 dark:text-white">Bangalore, Tech Hub · India</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-300">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                <FaGlobe size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Follow Us</p>
                <div className="flex gap-3 mt-1">
                  <FaGithub className="hover:text-gray-900 dark:hover:text-white cursor-pointer" />
                  <FaLinkedin className="hover:text-gray-900 dark:hover:text-white cursor-pointer" />
                  <FaTwitter className="hover:text-gray-900 dark:hover:text-white cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    privacy: {
      title: "Privacy Policy",
      content: (
        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <p className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-tighter mb-2">Effective Date: March 2026</p>
          <h4 className="text-gray-900 dark:text-white font-bold">1. Data Collection</h4>
          <p>We collect minimal data necessary for event registration, including name, email, and college details. We never sell your personal information.</p>
          <h4 className="text-gray-900 dark:text-white font-bold">2. How We Use Data</h4>
          <p>Your information is used solely to manage your event participations, provide updates, and improve the user experience on HackNext.</p>
          <h4 className="text-gray-900 dark:text-white font-bold">3. Security</h4>
          <p>We implement industry-standard encryption to protect your records. Your trust is our highest priority.</p>
          <h4 className="text-gray-900 dark:text-white font-bold">4. Cookies</h4>
          <p>We use essential cookies to maintain your session and preferences. By using HackNext, you agree to our use of these technical cookies.</p>
        </div>
      )
    }
  };

  return (
    <>
      <footer className="bg-gray-100 dark:bg-gray-950 border-t border-gray-300 dark:border-indigo-500/10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* TOP SECTION */}
          <div className="flex flex-col lg:flex-row justify-between gap-12">
            {/* BRAND */}
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white transition-transform hover:scale-105 inline-block">
                Hack
                <span className="bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">
                  Next
                </span>
              </h1>
              <p className="text-gray-400 mt-3 max-w-sm text-sm leading-relaxed">
                HackNext helps students and developers discover, save, and
                participate in hackathons, workshops, and tech events with ease.
              </p>
            </div>

            {/* LINKS */}
            <div className="flex gap-16 flex-wrap">
              <div>
                <h3 className="text-gray-900 dark:text-white font-semibold mb-4 tracking-wide">
                  Platform
                </h3>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <li onClick={handleAllEvents} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer hover:translate-x-1 duration-200">
                    All Events
                  </li>
                  <li onClick={handleSavedEvents} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer hover:translate-x-1 duration-200">
                    Saved Events
                  </li>
                  <li onClick={handleAppliedEvents} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer hover:translate-x-1 duration-200">
                    Applied Events
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-gray-900 dark:text-white font-semibold mb-4 tracking-wide">
                  Company
                </h3>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <li onClick={() => setActivePopup('about')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer hover:translate-x-1 duration-200">
                    About HackNext
                  </li>
                  <li onClick={() => setActivePopup('contact')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer hover:translate-x-1 duration-200">
                    Contact
                  </li>
                  <li onClick={() => setActivePopup('privacy')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer hover:translate-x-1 duration-200">
                    Privacy Policy
                  </li>
                </ul>
              </div>
            </div>

            {/* SOCIAL */}
            <div>
              <h3 className="text-gray-900 dark:text-white font-semibold mb-4 tracking-wide">
                Connect with us
              </h3>
              <div className="flex gap-4">
                <div onClick={handleGit} className="p-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 transition cursor-pointer hover:scale-110 active:scale-90 shadow-lg shadow-indigo-500/5 group">
                  <FaGithub className="text-indigo-400 group-hover:text-indigo-300" size={18} />
                </div>
                <div onClick={handleLinkedin} className="p-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 transition cursor-pointer hover:scale-110 active:scale-90 shadow-lg shadow-indigo-500/5 group">
                  <FaLinkedin className="text-indigo-400 group-hover:text-indigo-300" size={18} />
                </div>
                <div onClick={handleTwitter} className="p-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 transition cursor-pointer hover:scale-110 active:scale-90 shadow-lg shadow-indigo-500/5 group">
                  <FaTwitter className="text-indigo-400 group-hover:text-indigo-300" size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM BAR */}
          <div className="mt-12 pt-6 border-t border-gray-300 dark:border-indigo-500/10 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} HackNext · Built for innovation & growth
            </p>
          </div>
        </div>
      </footer>

      {/* Popups */}
      {activePopup && (
        <Popup
          isOpen={!!activePopup}
          onClose={closePopup}
          title={popups[activePopup].title}
        >
          {popups[activePopup].content}
        </Popup>
      )}
    </>
  );
}

export default Footer;
