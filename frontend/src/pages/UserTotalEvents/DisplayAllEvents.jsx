import React from "react";
import InputElement from "../../components/InputElement";
import UserNavbar from "../../components/UserNavbar";
import Footer from "../../components/Footer";

function DisplayAllEvents() {

 
  return (
    <div className="bg-white min-h-screen">
      <UserNavbar />
      <InputElement />
      <Footer />
    </div>
  );
}

export default DisplayAllEvents;
