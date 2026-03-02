import React, { useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router";
import Form from "../../components/Form";
import MyEvents from "../../components/MyEvents";
import AdminOverView from "../../components/AdminOverView";
import { FormContext } from "../../contextApi/FormContext";
import { FaSignInAlt, FaBars, FaTimes, FaUser, FaClipboardList } from "react-icons/fa";
import { ThreeDot } from "react-loading-indicators";
import AdminNavbar from "../../components/AdminNavbar";
import { BACKEND_URL } from "../../config";

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/admin/profile`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("admin_token")}`,
            },
          }
        );
        const data = await response.json();
        setAdminData(data.admin);
      } catch (error) {
        console.error("Error fetching admin profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <ThreeDot color="#ffffff" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-6 rounded-xl shadow-md">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white">Admin Profile</h2>
      {adminData ? (
        <div className="space-y-4">
          <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
            <span className="text-gray-600 dark:text-gray-400">Email:</span>
            <span className="text-gray-900 dark:text-white font-medium">{adminData.email}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
            <span className="text-gray-600 dark:text-gray-400">Name:</span>
            <span className="text-gray-900 dark:text-white font-medium">{adminData.name || 'N/A'}</span>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">Unable to load profile data.</p>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { form, setForm } = useContext(FormContext);
  const [drodownValue, setDropDownValue] = useState('All Events')
  const [activeSection, setActiveSection] = useState('overview');

  const adminToken = Cookies.get("admin_token");
  if (!adminToken) {
    return <Navigate to="/admin/login" />;
  }

  const handleDropValue = (e) => {
    setDropDownValue(e.target.value)
  }


  const handleCreateProject = () => {
    navigate("/createproject", { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white px-4 md:px-10 py-8">
      <AdminNavbar />
      <div className="pt-20">

        {!form.open && activeSection === 'overview' && <AdminOverView />}

        {!form.open && activeSection === 'profile' && (
          <div>
            <button
              onClick={() => setActiveSection('overview')}
              className="mb-4 px-4 py-2 bg-indigo-600 dark:bg-blue-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-blue-700 cursor-pointer transition"
            >
              Back to Overview
            </button>
            <AdminProfile />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setForm({ open: false, event: null })}
              className="px-4 py-2 md:px-6 md:py-2 cursor-pointer bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white rounded-lg shadow-sm dark:shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              My Events
            </button>
            <button
              onClick={() => setForm({ open: true, event: null })}
              className="px-4 py-2 md:px-6 md:py-2 cursor-pointer bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white rounded-lg shadow-sm dark:shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              + Create Event
            </button>
            <button
              onClick={handleCreateProject}
              className="px-4 py-2 md:px-6 md:py-2 cursor-pointer bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white rounded-lg shadow-sm dark:shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              + Create Project
            </button>
          </div>
          <div>
            <select className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white p-2 rounded-xl cursor-pointer text-sm md:text-base outline-none focus:border-indigo-500" value={drodownValue} onChange={(e) => handleDropValue(e)} >
              <option value={"All Events"} >All Events</option>
              <option value={"Hackathon"}>Hackathon</option>
              <option value={"Workshop"}>Workshop</option>
              <option value={"Tech Event"}>Tech Event</option>
              <option value={"Projects"}>Projects</option>
            </select>
          </div>
        </div>

        {form.open ? (
          <Form event={form.event} isopen={form.open} />
        ) : (
          <MyEvents dropValue={drodownValue} setForm={setForm} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
