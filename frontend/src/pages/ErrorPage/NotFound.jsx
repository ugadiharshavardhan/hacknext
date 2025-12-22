import React from "react";
import { useNavigate } from "react-router";
import FuzzyText from "../../components/errorPage";

function NotFound() {
  const navigate = useNavigate();

  const handleNavigateToHome = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white">
      
      {/* Fuzzy 404 Text */}
      <FuzzyText
        fontSize="clamp(3rem, 12vw, 10rem)"
        fontWeight={900}
        color="#ffffff"
        baseIntensity={0.15}
        hoverIntensity={0.5}
      >
        404
      </FuzzyText>

      <FuzzyText
        fontSize="clamp(1rem, 3vw, 10rem)"
        fontWeight={600}
        color="#ffffff"
        baseIntensity={0.15}
        hoverIntensity={0.5}
      >
        Page Not Found
      </FuzzyText>
      {/* Subtitle */}
      <p className="mt-4 text-xl text-gray-300">
        
      </p>

      {/* Button */}
      <button
        onClick={handleNavigateToHome}
        className="mt-8 cursor-pointer px-6 py-2 rounded-xl bg-white text-black font-semibold hover:scale-105 transition"
      >
        Return to Home
      </button>
    </div>
  );
}

export default NotFound;
