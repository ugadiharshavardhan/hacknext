// import React from 'react'
// import { useState } from 'react'
// import { Link, Navigate, useNavigate } from "react-router";
// import { FaCode } from "react-icons/fa";
// import Cookies from "js-cookie"

// export default function SignUp() {

//     const navigate = useNavigate()
//     const [username, setUserName] = useState("")
//     const [email, setEmail] = useState("")
//     const [password, setPassword] = useState("")
//     const [showErrorMsg, setShowErrMsg] = useState('')
//     const [isErr, setIsErr] = useState(false)

//     const handleUsername = (e) => setUserName(e.target.value)
//     const handleEmail = (e) => setEmail(e.target.value)
//     const handlePassword = (e) => setPassword(e.target.value)

//     const onSubmitSuccess = () => {
//       navigate("/signin", { replace: true })
//     }

//     const onSubmitFailure = (error) => {
//       setIsErr(true)
//       setShowErrMsg(error)
//     }

//     const handleSubmitForm = async (event) => {
//         event.preventDefault()

//         const userDetails = { username, email, password }

//         const response = await fetch("https://project-hackathon-7utw.onrender.com/signup", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(userDetails)
//         })

//         const data = await response.json()

//         if (response.ok) onSubmitSuccess()
//         else onSubmitFailure(data.message)
//     }

//     const jwtToken = Cookies.get("jwt_token")
//     if (jwtToken !== undefined) {
//       navigate("/",{replace:true})
//     }
//     else {
//       navigate("/signin",{replace:true})
//     }

//     const handleHome = () => navigate("/", { replace: true })

//     return (
//       <div className="min-h-screen w-full bg-[#023e8a] bg-cover bg-center relative flex items-center justify-center px-4 sm:px-6">
        
//         <div className="absolute inset-0 bg-black/20"></div>

//         <header className="absolute top-4 left-4 sm:top-6 sm:left-10 z-20">
//           <div className='flex'>
//             <FaCode size={38} className='text-white mt-1' />
//             <h1 className='text-4xl font-bold text-white'>HackNext</h1>
//           </div>
//           <button onClick={handleHome} className="border-2 bg-white p-2 rounded-lg cursor-pointer">back</button>
//         </header>

//         <div className="flex h-[480px]">

//           <div className="relative z-10 bg-white sm:p-8 md:p-10 rounded-l-xl w-full max-w-[340px] border border-white flex flex-col justify-center">
//             <h1 className="text-3xl font-bold text-center mb-5">Register</h1>

//             <form className="flex flex-col space-y-4" onSubmit={handleSubmitForm}>

//               <div>
//                 <label className="text-black text-xs sm:text-sm font-semibold">USERNAME</label>
//                 <input
//                   type="text"
//                   placeholder="Enter full name"
//                   value={username}
//                   className="w-full p-2 bg-gray-300/80 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   onChange={handleUsername}
//                 />
//               </div>

//               <div>
//                 <label className="text-black text-xs sm:text-sm font-semibold">EMAIL</label>
//                 <input
//                   type="text"
//                   placeholder="Enter email"
//                   value={email}
//                   className="w-full p-2 bg-gray-300/80 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   onChange={handleEmail}
//                 />
//               </div>

//               <div>
//                 <label className="text-black text-xs sm:text-sm font-semibold">PASSWORD</label>
//                 <input
//                   type="password"
//                   placeholder="Enter password"
//                   value={password}
//                   className="w-full p-2 bg-gray-300/80 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   onChange={handlePassword}
//                 />
//               </div>

//               <div className="min-h-[20px]">
//                 {isErr && (
//                   <p className="text-red-500 text-sm">{showErrorMsg}</p>
//                 )}
//               </div>

//               <button
//                 type="submit"
//                 className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition cursor-pointer"
//               >
//                 Create Account
//               </button>

//             </form>

//             <p className="text-black pt-5 text-center">
//               Already have an Account?{" "}
//               <Link to={"/signin"} className="text-blue-600">Login</Link>
//             </p>

//           </div>

//           <div>
//             <img
//               className="h-full rounded-r-2xl brightness-120"
//               src="https://res.cloudinary.com/dcttatiuj/image/upload/v1764924849/Screenshot_2025-12-05_142313_e2uc0p.png"
//               alt="Signup Visual"
//             />
//           </div>

//         </div>
//       </div>
//     );
// }


import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { FaCode } from "react-icons/fa";
import Cookies from "js-cookie";

export default function SignUp() {
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showErrorMsg, setShowErrMsg] = useState("");
  const [isErr, setIsErr] = useState(false);

  const handleUsername = (e) => setUserName(e.target.value);
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const onSubmitSuccess = () => {
    navigate("/signin", { replace: true });
  };

  const onSubmitFailure = (error) => {
    setIsErr(true);
    setShowErrMsg(error);
  };

  const handleSubmitForm = async (event) => {
    event.preventDefault();

    const userDetails = { username, email, password };

    try {
      const response = await fetch(
        "https://project-hackathon-7utw.onrender.com/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userDetails),
        }
      );

      const data = await response.json();

      if (response.ok) {
        onSubmitSuccess();
      } else {
        onSubmitFailure(data.message);
      }
    } catch (error) {
      console.log(error)
      onSubmitFailure("Something went wrong. Try again.");
    }
  };

  /* ✅ AUTH REDIRECT (CORRECT WAY) */
  const jwtToken = Cookies.get("jwt_token");
  if (jwtToken !== undefined) {
    return <Navigate to="/" replace />;
  }

  const handleHome = () => navigate("/", { replace: true });

  return (
    <div className="min-h-screen w-full bg-[#023e8a] bg-cover bg-center relative flex items-center justify-center px-4 sm:px-6">
      <div className="absolute inset-0 bg-black/20"></div>

      <header className="absolute top-4 left-4 sm:top-6 sm:left-10 z-20">
        <div className="flex items-center gap-2">
          <FaCode size={38} className="text-white" />
          <h1 className="text-4xl font-bold text-white">HackNext</h1>
        </div>
        <button
          onClick={handleHome}
          className="mt-2 border-2 bg-white px-3 py-1 rounded-lg cursor-pointer"
        >
          Back
        </button>
      </header>

      <div className="flex h-[480px]">
        <div className="relative z-10 bg-white sm:p-8 md:p-10 rounded-l-xl w-full max-w-[340px] border border-white flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-center mb-5">Register</h1>

          <form className="flex flex-col space-y-4" onSubmit={handleSubmitForm}>
            <div>
              <label className="text-black text-xs sm:text-sm font-semibold">
                USERNAME
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                value={username}
                className="w-full p-2 bg-gray-300/80 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                onChange={handleUsername}
              />
            </div>

            <div>
              <label className="text-black text-xs sm:text-sm font-semibold">
                EMAIL
              </label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                className="w-full p-2 bg-gray-300/80 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                onChange={handleEmail}
              />
            </div>

            <div>
              <label className="text-black text-xs sm:text-sm font-semibold">
                PASSWORD
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                className="w-full p-2 bg-gray-300/80 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                onChange={handlePassword}
              />
            </div>

            <div className="min-h-[20px]">
              {isErr && (
                <p className="text-red-500 text-sm">{showErrorMsg}</p>
              )}
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition cursor-pointer"
            >
              Create Account
            </button>
          </form>

          <p className="text-black pt-5 text-center">
            Already have an Account?{" "}
            <Link to="/signin" className="text-blue-600">
              Login
            </Link>
          </p>
        </div>

        <div>
          <img
            className="h-full rounded-r-2xl brightness-120"
            src="https://res.cloudinary.com/dcttatiuj/image/upload/v1764924849/Screenshot_2025-12-05_142313_e2uc0p.png"
            alt="Signup Visual"
          />
        </div>
      </div>
    </div>
  );
}
