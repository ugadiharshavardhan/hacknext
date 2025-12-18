import React, { useContext, useState } from "react";
import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router";
import Form from "../../components/Form";
import MyEvents from "../../components/MyEvents";
import AdminOverView from "../../components/AdminOverView";
import { FormContext } from "../../contextApi/FormContext";
import { FaSignInAlt } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { form, setForm } = useContext(FormContext);
  const [drodownValue,setDropDownValue] = useState('All Events')

  const adminToken = Cookies.get("admin_token");
  if (!adminToken) {
    return <Navigate to="/admin/login" />;
  }

  const handleLogout = () => {
    Cookies.remove("admin_token");
    navigate("/admin/login", { replace: true });
  };

  const handleDropValue = (e) => {
    setDropDownValue(e.target.value)
  }

  const handleHome = () => {
    navigate("/",{replace:true})
  }

  const handleCreateProject = () => {
    navigate("/createproject",{replace:true})
  }


  const handleuserappliedevents = () => {
    navigate("/userappliedevents",{replace:true})
  }

  // const handleAdminAccount = () => {
  //   navigate("/adminaccount",{replace:true})
  // }

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 onClick={handleHome} className="text-2xl cursor-pointer font-bold">
          Admin <span className="text-blue-500">Dashboard</span>
        </h1>
        <div className="flex">
          <h1 onClick={handleuserappliedevents} className="text-lg pt-5 pr-5 cursor-pointer font-bold">
            User Applied Events
          </h1>
          <button
            onClick={handleLogout}
            className="m-4 flex items-center justify-center gap-2 p-2 rounded-xl
                        bg-rose-500/60 text-white cursor-pointer
                        hover:bg-rose-500 transition"
          >
            <FaSignInAlt />
            Logout
          </button>
        </div>  
      </div>

      {!form.open && <AdminOverView />}

      <div className="flex gap-4 mb-4">
        <div>
          <button
            onClick={() => setForm({ open: false, event: null })}
            className="px-6 py-2 bg-purple-600 rounded-lg shadow hover:bg-purple-700 transition m-1"
          >
            My Events
          </button>
          <button
            onClick={() => setForm({ open: true, event: null })}
            className="px-6 py-2 bg-gray-800 rounded-lg shadow hover:bg-gray-700 transition m-1"
          >
            + Create Event
          </button>
          <button
            onClick={handleCreateProject}
            className="px-6 py-2 bg-gray-800 rounded-lg shadow hover:bg-gray-700 transition m-1"
          >
            + Create Project
          </button>
        </div>
        <div className="m-1">
          <select className="bg-gray-700 p-2 rounded-xl" value={drodownValue} onChange={(e)=>handleDropValue(e)} >
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
  );
};

export default AdminDashboard;
