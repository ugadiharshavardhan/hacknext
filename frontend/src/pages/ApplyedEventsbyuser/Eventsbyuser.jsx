import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FcAbout } from "react-icons/fc";
import { FaAngleLeft } from "react-icons/fa";
import { useNavigate } from 'react-router';

function Eventsbyuser() {

    const [appliedData, setAppliedData] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate()

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const url = "http://localhost:5678/user/appliedevents";
                const options = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${Cookies.get("jwt_token")}`
                    }
                };

                const response = await fetch(url, options);
                const data = await response.json();

                setAppliedData(data.events || []);
            } catch (error) {
                console.error("Error fetching applied events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, []);

    
    if (loading) {
        return (
            <div className="bg-gray-800 min-h-screen flex justify-center items-center text-white text-xl">
                Loading...
            </div>
        );
    }

    
    if (!loading && appliedData.length === 0) {
        return (
            <div className="bg-gray-800 min-h-screen flex flex-col justify-center items-center text-white">
                <img
                    src="https://www.iimnagpur.ac.in/CoE/CLEAD/wp-content/themes/iimnagpur_clead/images/no-event.jpg"   
                    alt="No Applied Events"
                    className="w-64 opacity-80"
                />
                <h2 className="mt-4 text-xl text-gray-300">No Applied Events Found</h2>
            </div>
        );
    }

    const handleNavigatetoHome = () => {
        navigate("/user/allevents",{replace:true})
    }
    
    return (
        <div className='bg-gray-800 min-h-screen'>
            <ul className='pt-15'>
                <button onClick={handleNavigatetoHome} className='bg-white mt-8 p-2 rounded-xl font-semibold cursor-pointer '>
                    <div className='flex '>
                        <FaAngleLeft className='mt-1' /> 
                        <span >Back</span>
                    </div></button>
                {appliedData.map((each, id) => (
                    <li key={id} className="m-2 w-full">
                        <div className="bg-gray-900 text-white p-6 rounded-xl shadow-md w-full max-w-xl mx-auto">
                            
                            {/* Header Section */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="bg-yellow-600 font-bold text-white text-xs px-2 py-0.5 rounded-full">
                                        {each.eventTitle?.toUpperCase()}
                                    </span>

                                    <span className="bg-purple-600 font-bold text-white text-xs px-2 py-0.5 rounded-full">
                                        {each.eventType?.toUpperCase()}
                                    </span>

                                    <span className="bg-green-600 font-bold text-white text-xs px-2 py-0.5 rounded-full">
                                        Applied
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="flex">
                                <span className="m-1">
                                    <FcAbout />
                                </span>
                                <p className="text-gray-400 text-sm mb-4">
                                    {each.ideaDescription}
                                </p>
                            </div>

                            {/* Member Details */}
                            <div>
                                <h1 className='text-blue-500 font-bold underline p-1'>
                                    Applied Member Details:
                                </h1>

                                <p className="text-gray-400 text-sm mb-2">Email : {each.email}</p>
                                <p className="text-gray-400 text-sm mb-2">Member : {each.fullName}</p>
                                <p className="text-gray-400 text-sm mb-2">Institute : {each.institution}</p>
                                <p className="text-gray-400 text-sm mb-2">Phone Number : {each.phoneNumber}</p>
                                <p className="text-gray-400 text-sm mb-2">Team Name : {each.teamName}</p>
                                <p className="text-gray-400 text-sm mb-4">Team Members : {each.membersCount}</p>
                            </div>

                            {/* Event Details */}
                            <div>
                                <h1 className='text-blue-500 font-bold underline p-1'>Event Details:</h1>

                                <p className="text-gray-400 text-sm mb-2 font-bold">
                                    Event Start Date : {each.StartDate ? each.StartDate.split("T")[0] : "N/A"}
                                </p>

                                <p className="text-gray-400 text-sm mb-4 font-bold">
                                    Event End Date : {each.EndDate ? each.EndDate.split("T")[0] : "N/A"}
                                </p>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-3 text-gray-400 text-sm mb-4">
                                <div className="flex items-center gap-1">
                                    <FaMapMarkerAlt />
                                    <span>
                                        {each.Venue || "Unknown Venue"}, {each.EventCity || "Unknown City"}
                                    </span>
                                </div>
                            </div>

                            {/* Skills */}
                            <ul className="flex gap-2 flex-wrap">
                                {each.skills?.split(",").map((stack, index) => (
                                    <li key={index} className="bg-blue-600 px-3 py-1 rounded-full text-xs">
                                        {stack.trim()}
                                    </li>
                                ))}
                            </ul>

                        </div>
                    </li>
                ))}

            </ul>
        </div>
    );
}

export default Eventsbyuser;
