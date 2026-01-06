import React, { useState } from "react";
import Cookies from "js-cookie";
import { Navigate, useNavigate, Link } from "react-router";
import { FaCode } from "react-icons/fa";
import toast from "react-hot-toast";
import { FaAngleLeft } from "react-icons/fa";
import { ThreeDot } from "react-loading-indicators";

const SignIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showErrorMsg, setShowErrMsg] = useState("");
  const [isErr, setIsErr] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const onSubmitSuccess = (jwtToken) => {
  Cookies.remove("jwt_token"); 
  Cookies.set("jwt_token", jwtToken, { expires: 7 });

  navigate("/user/allevents", { replace: true });
  toast.success("Student Login Successfully", { duration: 2000 });
};


  const onSubmitFailure = (errorMsg) => {
    setIsErr(true);
    setShowErrMsg(errorMsg);
    toast.error("Invalid Credentials", { duration: 2000 });
  };

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    const userDetails = { email, password };

    const response = await fetch(
      "https://project-hackathon-7utw.onrender.com/signin",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userDetails),
      }
    );

    const data = await response.json();
    response.ok
      ? onSubmitSuccess(data.jwt_token)
      : onSubmitFailure(data.message);
  };

  const handleHome = () => navigate("/", { replace: true });

  const jwtToken = Cookies.get("jwt_token");
  if (jwtToken !== undefined) return <Navigate to="/user/allevents" />;

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center px-4 bg-gradient-to-br from-[#0f1225] to-[#14172e] overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-[-30%] left-1/2 -translate-x-1/2
          w-[900px] h-[900px] rounded-full
          bg-[radial-gradient(circle,_rgba(99,102,241,0.35)_0%,_rgba(99,102,241,0.15)_35%,_rgba(15,23,42,0)_65%)]
          blur-[120px]"
        />
        <div
          className="absolute bottom-[-40%] left-[60%]
          w-[700px] h-[700px] rounded-full
          bg-[radial-gradient(circle,_rgba(139,92,246,0.25)_0%,_rgba(15,23,42,0)_60%)]
          blur-[140px]"
        />
      </div>


      <header onClick={handleHome} className="absolute  cursor-pointer top-6 left-10 z-20 flex items-center gap-2">
        <FaCode size={34} className="text-indigo-400" />
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
          HackNext
        </h1>
      </header>


      <div className="relative z-10 flex h-auto md:h-[470px] w-full max-w-[760px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-md">


        <div className="relative w-1/2 hidden md:block">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <ThreeDot color="#ffffff" />
            </div>
          )}

          <img
            src="https://res.cloudinary.com/dcttatiuj/image/upload/v1767674999/hackathon-profiles/mrq7flwvk2od083wla4b.png"
            alt="Login Visual"
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
            className={`h-full w-full object-cover transition-opacity duration-700
              ${imageLoading ? "opacity-0" : "opacity-100"}`}
          />
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center text-white">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
            Student Login
          </h1>

          <p className="text-xs text-center mb-6 text-gray-400">
            Enter your credentials to access your account
          </p>

          <form className="flex flex-col space-y-5" onSubmit={handleSubmitForm}>
            <div>
              <label className="text-xs font-semibold text-gray-300">
                EMAIL
              </label>
              <div className="mt-1 p-[1.5px] rounded-lg bg-white/10 focus-within:bg-gradient-to-r focus-within:from-indigo-500 focus-within:to-violet-600 transition">
                <input
                  type="text"
                  placeholder="Enter Email"
                  value={email}
                  name="email"
                  onChange={handleEmail}
                  className="w-full px-3 py-2 rounded-md bg-[#0f1225] text-gray-200 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300">
                PASSWORD
              </label>
              <div className="mt-1 p-[1.5px] rounded-lg bg-white/10 focus-within:bg-gradient-to-r focus-within:from-indigo-500 focus-within:to-violet-600 transition">
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={handlePassword}
                  className="w-full px-3 py-2 rounded-md bg-[#0f1225] text-gray-200 text-sm outline-none"
                />
              </div>
            </div>


            <div className="min-h-[20px]">
              {isErr && (
                <p className="text-rose-400 text-sm">{showErrorMsg}</p>
              )}
            </div>


            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 text-white font-semibold py-3 rounded-xl transition cursor-pointer"
            >
              Login
            </button>
          </form>

          <p className="text-sm pt-5 text-center text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-400 font-semibold hover:underline"
            >
              Signup now
            </Link>
          </p>

          <div
            className="flex items-center gap-1 cursor-pointer mt-3 justify-center text-gray-400 hover:text-white transition"
            onClick={handleHome}
          >
            <FaAngleLeft />
            <p>Back</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
