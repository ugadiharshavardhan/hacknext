import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { useNavigate } from "react-router";

function Footer() {
    const navigate = useNavigate()


    const handleGit = () => {
        window.open("https://github.com/ugadiharshavardhan", "_blank")
    }

    const handleLinkedin = () => {
        window.open("https://www.linkedin.com/in/ugadiharshavardhan/", "_blank")

    }

    const handleTwitter = () => {

    }

    const handleAllEvents = () => {
        navigate("/user/allevents")
    }

    const handleSavedEvents = () => {
        navigate("/user/account")
        
    }

    const handleAppliedEvents = () => {
        navigate("/user/account")
    }

  return (
    <footer className=" bg-gray-950 border-t border-indigo-500/10">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* TOP SECTION */}
        <div className="flex flex-col lg:flex-row justify-between gap-12">

          {/* BRAND */}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
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
              <h3 className="text-white font-semibold mb-4 tracking-wide">
                Platform
              </h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li onClick={handleAllEvents} className="hover:text-indigo-400 transition cursor-pointer">
                  All Events
                </li>
                <li onClick={handleSavedEvents} className="hover:text-indigo-400 transition cursor-pointer">
                  Saved Events
                </li>
                <li onClick={handleAppliedEvents} className="hover:text-indigo-400 transition cursor-pointer">
                  Applied Events
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 tracking-wide">
                Company
              </h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="hover:text-indigo-400 transition cursor-pointer">
                  About HackNext
                </li>
                <li className="hover:text-indigo-400 transition cursor-pointer">
                  Contact
                </li>
                <li className="hover:text-indigo-400 transition cursor-pointer">
                  Privacy Policy
                </li>
              </ul>
            </div>
          </div>

          {/* SOCIAL */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide">
              Connect with us
            </h3>

            <div className="flex gap-4">
              <div onClick={handleGit} className="p-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 transition cursor-pointer">
                <FaGithub className="text-indigo-400" size={18} />
              </div>

              <div onClick={handleLinkedin} className="p-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 transition cursor-pointer">
                <FaLinkedin className="text-indigo-400" size={18} />
              </div>

              <div onClick={handleTwitter} className="p-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 transition cursor-pointer">
                <FaTwitter className="text-indigo-400" size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-12 pt-6 border-t border-indigo-500/10 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} HackNext · Built for innovation & growth
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
