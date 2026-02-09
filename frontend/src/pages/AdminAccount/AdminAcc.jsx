import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { ThreeDot } from "react-loading-indicators";
import { FaUser, FaEnvelope, FaCalendarAlt, FaShieldAlt } from "react-icons/fa";
import AdminNavbar from "../../components/AdminNavbar";
import { BACKEND_URL } from "../../config";

function AdminAcc() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const adminToken = Cookies.get("admin_token");
        if (!adminToken) {
          navigate("/admin/login", { replace: true });
          return;
        }

        const response = await fetch(
          `${BACKEND_URL}/admin/profile`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            Cookies.remove("admin_token");
            navigate("/admin/login", { replace: true });
            return;
          }
          throw new Error("Failed to fetch admin profile");
        }

        const data = await response.json();
        setAdminData(data.admin);
      } catch (error) {
        console.error("Error fetching admin profile:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1225] to-[#14172e] flex justify-center items-center">
        <ThreeDot color="#6366f1" size="medium" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1225] to-[#14172e] flex justify-center items-center">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Error loading admin profile</p>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1225] to-[#14172e] text-white pt-6 md:pt-10">
      <AdminNavbar />
      <div className="pt-16 md:pt-20 p-4 md:p-8">
        <div className="max-w-4xl mx-4 md:mx-auto">

          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl md:text-4xl font-bold mb-4">
              <span className="text-indigo-400">Admin</span> Profile
            </h1>
            <p className="text-gray-400 text-base md:text-lg">
              Manage your admin account details
            </p>
          </div>


          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-8 hover:bg-white/10 transition-all duration-300">

            <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full flex items-center justify-center">
                <FaShieldAlt className="text-white text-2xl md:text-3xl" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-indigo-400 mb-2">Administrator</h2>
                <p className="text-gray-400">System Administrator Account</p>
              </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="bg-gray-900/50 p-4 md:p-6 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-3 mb-3">
                  <FaEnvelope className="text-indigo-400 text-lg md:text-xl" />
                  <h3 className="text-base md:text-lg font-semibold text-white">Email Address</h3>
                </div>
                <p className="text-gray-300 text-base md:text-lg">{adminData?.email || "N/A"}</p>
              </div>


              <div className="bg-gray-900/50 p-4 md:p-6 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-3 mb-3">
                  <FaUser className="text-indigo-400 text-lg md:text-xl" />
                  <h3 className="text-base md:text-lg font-semibold text-white">Account Type</h3>
                </div>
                <p className="text-gray-300 text-base md:text-lg">Administrator</p>
              </div>


              <div className="bg-gray-900/50 p-4 md:p-6 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-3 mb-3">
                  <FaCalendarAlt className="text-indigo-400 text-lg md:text-xl" />
                  <h3 className="text-base md:text-lg font-semibold text-white">Member Since</h3>
                </div>
                <p className="text-gray-300 text-base md:text-lg">
                  {adminData?.createdAt ? new Date(adminData.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : "N/A"}
                </p>
              </div>


              <div className="bg-gray-900/50 p-4 md:p-6 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-3 mb-3">
                  <FaShieldAlt className="text-indigo-400 text-lg md:text-xl" />
                  <h3 className="text-base md:text-lg font-semibold text-white">Admin ID</h3>
                </div>
                <p className="text-gray-300 text-base md:text-lg font-mono">{adminData?._id || "N/A"}</p>
              </div>
            </div>


            <div className="mt-6 md:mt-8 p-4 md:p-6 bg-indigo-900/20 rounded-xl border border-indigo-500/20">
              <h3 className="text-lg md:text-xl font-bold text-indigo-400 mb-4">Account Information</h3>
              <div className="space-y-2 md:space-y-3 text-gray-300">
                <p>• As an administrator, you have full access to manage events, projects, and user applications.</p>
                <p>• You can create and manage hackathons, workshops, and tech events.</p>
                <p>• Monitor user applications and manage the platform content.</p>
                <p>• Your account is secured with advanced authentication measures.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAcc;
