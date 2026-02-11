import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import {
  FaSignInAlt,
  FaUser,
  FaBookmark,
  FaClipboardList,
  FaEye,
  FaUpload,
  FaTrash,
  FaTimes,
  FaEnvelope
} from "react-icons/fa";
import { ThreeDot } from "react-loading-indicators";
import SavedEvents from "../../components/SavedEvents";
import Eventsbyuser from "../ApplyedEventsbyuser/Eventsbyuser";
import ContactUs from "./ContactUs";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../config";

function UserAccount() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [userData, setUserData] = useState(null);
  const [activeSection, setActiveSection] = useState("user");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [showOptions, setShowOptions] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [tempImage, setTempImage] = useState(null);


  // Cookies.remove("jwt_token")

  useEffect(() => {
    const fetchAccount = async () => {
      const response = await fetch(
        `${BACKEND_URL}/user/account`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt_token")}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      setUserData(data.userDetails);
      setLoading(false);
    };
    fetchAccount();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#0f1225] to-[#14172e]">
        <ThreeDot color="#6366f1" size="medium" />
      </div>
    );
  }

  const handleLogout = () => {
    Cookies.remove("jwt_token");
    navigate("/signin", { replace: true });
  };

  const handleImageClick = () => {
    if (!uploading) setShowOptions(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Select a valid image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setTempImage(localPreview);
    setShowOptions(false);

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      setUploading(true);

      const response = await fetch(
        `${BACKEND_URL}/user/upload-profile`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt_token")}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      toast.success("Image updated");

      setUserData((prev) => ({
        ...prev,
        profileImage: data.profileImage,
      }));
      // toast.success("Image Updated")

      setTempImage(null);
    } catch (err) {
      toast.error("Upload failed", err);
      setTempImage(null);
    } finally {
      setUploading(false);
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async () => {
    try {
      setUploading(true);

      const response = await fetch(
        `${BACKEND_URL}/user/remove-profile`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt_token")}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // Update UI after DB update
      setTempImage(null);
      setUserData((prev) => ({
        ...prev,
        profileImage: "",
      }));

      setShowOptions(false);
      toast.success("Profile picture removed");
    } catch (error) {
      toast.error("Failed to remove image");
    } finally {
      setUploading(false);
    }
  };



  return (
    <div className="flex min-h-screen bg-gray-950 overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-[280px] fixed left-0 top-0 h-screen bg-white/5 border-r border-white/10 backdrop-blur-md flex flex-col justify-between">
        <div className="pt-24 px-4 space-y-2">
          <SidebarItem
            icon={<FaUser />}
            label="User Profile"
            active={activeSection === "user"}
            onClick={() => setActiveSection("user")}
          />
          <SidebarItem
            icon={<FaBookmark />}
            label="Saved Events"
            active={activeSection === "saved"}
            onClick={() => setActiveSection("saved")}
          />
          <SidebarItem
            icon={<FaClipboardList />}
            label="Applied Events"
            active={activeSection === "appliedevents"}
            onClick={() => setActiveSection("appliedevents")}
          />
          <SidebarItem
            icon={<FaEnvelope />}
            label="Contact Us"
            active={activeSection === "contact"}
            onClick={() => setActiveSection("contact")}
          />
        </div>

        <div
          onClick={handleLogout}
          className="m-4 flex items-center justify-center gap-2 py-3 rounded-xl
          bg-rose-500/20 text-white cursor-pointer hover:bg-rose-500/30 transition"
        >
          <FaSignInAlt /> Logout
        </div>
      </aside>

      {/* MAIN */}
      <main className="ml-[280px] w-full overflow-y-auto">
        <div className="min-h-screen px-6 py-24 flex justify-center">
          <div className="w-full max-w-5xl">

            {activeSection === "user" && (
              <div className="animate-slideUp flex flex-col items-center">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl w-full max-w-md text-center">

                  <div
                    className="relative group w-24 h-24 mx-auto mb-4 cursor-pointer"
                    onClick={handleImageClick}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden">
                      {uploading ? (
                        <div className="w-full h-full flex items-center justify-center bg-black/30">
                          <ThreeDot color="#ffffff" size="small" />
                        </div>
                      ) : (tempImage || userData?.profileImage) ? (
                        <img
                          src={tempImage || userData.profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-violet-600 flex items-center justify-center text-3xl font-bold text-white">
                          {userData?.username?.[0]?.toUpperCase()}
                        </div>
                      )}

                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-white">
                    {userData.username}
                  </h2>
                  <p className="text-gray-400">{userData.email}</p>

                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-gray-400">Role</p>
                      <p className="font-semibold text-white">Student</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-gray-400">Status</p>
                      <p className="font-semibold text-emerald-400">Active</p>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {activeSection === "saved" && <SavedEvents />}
            {activeSection === "appliedevents" && <Eventsbyuser />}
            {activeSection === "contact" && <ContactUs userData={userData} />}
          </div>
        </div>
      </main>

      {/* OPTIONS OVERLAY */}
      {showOptions && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          onClick={() => setShowOptions(false)}
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/95 backdrop-blur-sm rounded-xl p-3 space-y-2 min-w-[220px] shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >

            {userData.profileImage && (
              <button
                className="flex w-full items-center gap-3 text-white py-3 px-4 hover:bg-white/10 active:bg-white/20 rounded-lg transition-all touch-manipulation"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPreview(true);
                  setShowOptions(false);
                }}
              >
                <FaEye className="text-lg" /> <span className="font-medium text-base">View Image</span>
              </button>
            )}

            <button
              className="flex w-full items-center gap-3 text-white py-3 px-4 hover:bg-white/10 active:bg-white/20 rounded-lg transition-all touch-manipulation"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current.click();
                setShowOptions(false);
              }}
            >
              <FaUpload className="text-lg" /> <span className="font-medium text-base">Change Image</span>
            </button>

            {userData.profileImage && (
              <button
                className="flex w-full items-center gap-3 text-red-400 py-3 px-4 hover:bg-white/10 active:bg-white/20 rounded-lg transition-all touch-manipulation"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
              >
                <FaTrash className="text-lg" /> <span className="font-medium text-base">Remove Image</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW */}
      {showPreview && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setShowPreview(false)}
        >
          <img
            src={userData.profileImage}
            alt="Preview"
            className="max-w-[90%] max-h-[90%] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setShowPreview(false)}
            className="absolute top-6 right-6 text-white text-2xl p-2 hover:bg-white/10 rounded-full transition"
          >
            <FaTimes />
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${active
        ? "bg-gradient-to-r from-indigo-600/30 to-violet-600/30 text-white"
        : "text-gray-400 hover:bg-white/5 hover:text-white"
        }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

export default UserAccount;
