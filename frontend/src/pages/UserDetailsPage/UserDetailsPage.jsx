import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ThreeDot } from "react-loading-indicators";
import UserNavbar from "../../components/UserNavbar";
import { BACKEND_URL } from "../../config";

function UserDetailsPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <UserNavbar />
      <div className="min-h-screen bg-gray-950 overflow-hidden pt-20">
        <div className="px-6 py-24 flex justify-center">
          <div className="w-full max-w-5xl">
            <div className="animate-slideUp flex flex-col items-center">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl w-full max-w-md text-center">
                <div
                  className="w-20 h-20 mx-auto mb-4 rounded-full
                             bg-gradient-to-r from-indigo-500 to-violet-600
                             flex items-center justify-center text-3xl font-bold text-white"
                >
                  {userData.username[0].toUpperCase()}
                </div>

                <h2 className="text-2xl font-bold text-white">
                  {userData.username}
                </h2>

                <p className="text-gray-400 mt-2">
                  {userData.email}
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                    <span className="text-gray-400">Username</span>
                    <span className="text-white">{userData.username}</span>
                  </div>

                  <div className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                    <span className="text-gray-400">Email</span>
                    <span className="text-white">{userData.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetailsPage;