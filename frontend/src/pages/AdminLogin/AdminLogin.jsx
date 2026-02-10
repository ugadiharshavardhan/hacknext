import React from 'react'
import Cookies from "js-cookie"
import { Navigate, useNavigate } from 'react-router'
import { useState } from 'react'
import { FaCode, FaAngleLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import toast from 'react-hot-toast';
import { BACKEND_URL } from "../../config";

function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isErr, setIsErr] = useState(false)
  const [showErrorMsg, setShowErrMsg] = useState("")

  const onSuccessData = (adminToken) => {
    Cookies.set("admin_token", adminToken, { expires: 7 })
    setIsErr(false)
    navigate("/admin/dashboard", { replace: true })
    toast.success("Login Successfully", { duration: 2000 })
  }

  const AdminToken = Cookies.get("admin_token")
  if (AdminToken !== undefined) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const onFailueData = () => {
    setIsErr(true)
    setShowErrMsg("Invalid Email and Code")
    toast.error("Invalid Credentials", { duration: 2000 })
  }

  const handleSubmitForm = async (event) => {
    event.preventDefault()

    const url = `${BACKEND_URL}/admin/login`
    const AdminDetails = { email, code }

    const options = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(AdminDetails)
    }

    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      onSuccessData(data.adminToken)
    } else {
      onFailueData()
    }
  }

  const handleHome = () => navigate("/", { replace: true })

  return (
    <div className="min-h-screen  w-full bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a] flex items-center justify-center px-4">

      <header onClick={handleHome} className="absolute top-6 left-6 flex items-center gap-2">
        <FaCode size={34} className="text-blue-500" />
        <h1 className="text-3xl font-bold text-white tracking-wide">HackNext</h1>
      </header>

      <div className="flex shadow-2xl rounded-2xl overflow-hidden border-1 border-white">

        <div className="hidden md:block">
          <img
            src="https://res.cloudinary.com/dcttatiuj/image/upload/v1766123227/ChatGPT_Image_Dec_19_2025_11_16_31_AM_krsl6b.png"
            alt="admin"
            className="h-[500px] w-[360px] object-cover brightness-90"
          />
        </div>

        <div className="bg-[#020617] border border-white/10 p-8 w-[360px]">
          <h1 className="text-3xl font-bold text-white text-center">Admin Login</h1>
          <p className="text-xs text-gray-400 text-center mt-2 mb-6">
            Manage Hackathons, Workshops & Tech Events
          </p>

          <form className="flex flex-col space-y-4" onSubmit={handleSubmitForm}>

            <div>
              <label className="text-xs text-gray-300 font-semibold">EMAIL</label>
              <input
                type="text"
                placeholder="Enter email"
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-2 rounded bg-[#0f172a] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 font-semibold">Password</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full p-2 pr-10 rounded bg-[#0f172a] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {isErr ? (
              <p className="text-red-500 text-sm">{showErrorMsg}</p>
            ) : (
              <span className="text-transparent">.</span>
            )}

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition"
            >
              Login
            </button>

            <div
              className="flex items-center gap-1 text-gray-400 hover:text-white cursor-pointer text-sm"
              onClick={handleHome}
            >
              <FaAngleLeft />
              <span>Back to Home</span>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
