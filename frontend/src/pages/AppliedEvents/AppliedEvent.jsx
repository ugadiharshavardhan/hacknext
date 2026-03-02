import React, { useEffect } from 'react'
import { useState } from 'react';
import Cookies from "js-cookie"
import { useParams, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { FaCalendarPlus, FaCheckCircle, FaArrowRight, FaHome, FaTimes } from "react-icons/fa";
import { BACKEND_URL } from "../../config";

function AppliedEvent() {
    const { eventid } = useParams();
    const navigate = useNavigate();
    const [EventDetails, setEventDetails] = useState([])
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [ApplyFormData, setApplyFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        institution: "",
        role: "",
        skills: "",
        // Hackathon fields
        teamName: "",
        teamLeadName: "",
        membersCount: "",
        experienceLevel: "",
        ideaDescription: "",
        // Workshop fields
        reasonForAttending: "",
        proficiency: "",
        expectedOutcomes: "",
        // Tech Event fields
        professionalStatus: "",
        areasOfInterest: "",
        previousEventExperience: ""
    });



    const validateForm = () => {
        const newErrors = {};

        if (!ApplyFormData.fullName.trim()) newErrors.fullName = 'Full name is required';

        if (!ApplyFormData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(ApplyFormData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!ApplyFormData.phoneNumber) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\d{10}$/.test(ApplyFormData.phoneNumber)) {
            newErrors.phoneNumber = 'Phone number must be 10 digits';
        }

        if (!ApplyFormData.institution) newErrors.institution = 'Institution is required';
        if (!ApplyFormData.role) newErrors.role = 'Role is required';

        if (!ApplyFormData.skills) newErrors.skills = 'Skills are required';

        const eventType = EventDetails.EventType;

        if (eventType === "Hackathon") {
            if (!ApplyFormData.teamName) newErrors.teamName = 'Team name is required';
            if (!ApplyFormData.membersCount) newErrors.membersCount = 'Members count is required';
            if (!ApplyFormData.ideaDescription) newErrors.ideaDescription = 'Idea description is required';
        } else if (eventType === "Workshop") {
            if (!ApplyFormData.reasonForAttending) newErrors.reasonForAttending = 'Reason for attending is required';
            if (!ApplyFormData.proficiency) newErrors.proficiency = 'Proficiency level is required';
        } else if (eventType === "Tech Event") {
            if (!ApplyFormData.professionalStatus) newErrors.professionalStatus = 'Professional status is required';
            if (!ApplyFormData.areasOfInterest) newErrors.areasOfInterest = 'Areas of interest is required';
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmitApply = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const url = `${BACKEND_URL}/event/apply/${eventid}`;
            const options = {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("jwt_token")}`
                },
                body: JSON.stringify({
                    ...ApplyFormData,
                    // eventId : EventDetails,
                    eventTitle: EventDetails.EventTitle,
                    eventType: EventDetails.EventType,
                    StartDate: EventDetails.StartDate,
                    EndDate: EventDetails.EndDate,
                    Venue: EventDetails.Venue,
                    EventCity: EventDetails.City,
                    eventId: eventid,
                    appliedAt: new Date().toISOString(),
                })
            };

            const response = await fetch(url, options);
            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || 'Failed to submit application');
                return;
            }
            toast.success(`Applied successfully for ${EventDetails.EventTitle}!`);
            setIsSuccess(true);
            // navigate('/user/allevents');
        } catch (error) {
            console.error('Error submitting application:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDataapply = (e) => {
        const { name, value } = e.target
        if (name === "membersCount") {
            // Prevent NaN by defaulting to empty string if conversion fails
            const numValue = parseInt(value, 10);
            setApplyFormData(prev => ({ ...prev, [name]: isNaN(numValue) ? "" : numValue }));
        } else {
            setApplyFormData(prev => ({ ...prev, [name]: value }));
        }
    }

    useEffect(() => {
        const fetchEvent = async () => {
            const url = `${BACKEND_URL}/user/allevents/${eventid}`
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("jwt_token")}`
                }
            }
            const response = await fetch(url, options)
            const data = await response.json()
            console.log(data)
            setEventDetails(data)

        }
        fetchEvent()
    }, [eventid])

    const handleBackBtn = () => {
        navigate("/user/allevents", { replace: true })
    }

    const generateGoogleCalendarUrl = () => {
        if (!EventDetails || !EventDetails.StartDate) return "";

        const formatDate = (date) => {
            return new Date(date).toISOString().replace(/-|:|\.\d\d\d/g, "");
        };

        const startDate = formatDate(EventDetails.StartDate);
        const endDate = formatDate(EventDetails.EndDate);

        const details = `Event: ${EventDetails.EventTitle}\nVenue: ${EventDetails.Venue}, ${EventDetails.City}\nThinking of you!`;

        return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(EventDetails.EventTitle)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(EventDetails.EventDescription)}&location=${encodeURIComponent(EventDetails.Venue + ", " + EventDetails.City)}`;
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-black text-gray-900 dark:text-white flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-800/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-8 text-center shadow-2xl">
                    <div className="flex justify-center mb-6">
                        <div className="bg-green-100 dark:bg-green-500/20 p-4 rounded-full">
                            <FaCheckCircle className="text-5xl text-green-600 dark:text-green-500" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-400 dark:to-emerald-600 bg-clip-text text-transparent mb-2">
                        Application Sent!
                    </h2>

                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        You have successfully applied for <br />
                        <span className="text-gray-900 dark:text-white font-semibold">{EventDetails.EventTitle}</span>
                    </p>

                    <div className="space-y-4">
                        <a
                            href={generateGoogleCalendarUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl font-semibold transition-all transform hover:scale-[1.02]"
                        >
                            <FaCalendarPlus className="text-xl" />
                            Add to Google Calendar
                        </a>

                        <button
                            onClick={() => navigate('/user/allevents')}
                            className="flex items-center justify-center gap-2 w-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 py-3 px-6 rounded-xl font-semibold transition-all cursor-pointer"
                        >
                            <FaHome />
                            Back to Dashboard
                        </button>

                        <p className="text-xs text-gray-500 mt-4">
                            A confirmation email has been sent to {ApplyFormData.email}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-black/90 flex items-center justify-center pt-25 py-12'>
            <form onSubmit={handleSubmitApply} className="w-full max-w-3xl">
                <div className="bg-white dark:bg-gray-900/50 backdrop-blur-md border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white p-8 rounded-2xl shadow-2xl space-y-8 relative">

                    {/* Header with Close Button */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">
                            Application Form
                        </h2>
                        <button
                            type="button"
                            onClick={handleBackBtn}
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer"
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Full Name (First & Last)*</label>
                        <input
                            type="text"
                            name="fullName"
                            value={ApplyFormData.fullName}
                            onChange={handleDataapply}
                            placeholder="John Doe"
                            className={`w-full p-2 rounded bg-gray-50 dark:bg-gray-800 border ${errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-medium">Email Address*</label>
                            <input
                                type="email"
                                name="email"
                                value={ApplyFormData.email}
                                onChange={handleDataapply}
                                placeholder="john.doe@university.edu"
                                className={`w-full p-2 rounded bg-gray-50 dark:bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Phone Number*</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={ApplyFormData.phoneNumber}
                                onChange={handleDataapply}
                                placeholder="1234567890"
                                className={`w-full p-2 rounded bg-gray-50 dark:bg-gray-800 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                        </div>
                    </div>

                    {/* (REMOVED: Address section was here) */}


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-medium">Institution / Company*</label>
                            <input
                                type="text"
                                name="institution"
                                value={ApplyFormData.institution}
                                onChange={handleDataapply}
                                placeholder="Harvard University"
                                className={`w-full p-2 rounded bg-gray-50 dark:bg-gray-800 border ${errors.institution ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                            {errors.institution && <p className="text-red-500 text-sm mt-1">{errors.institution}</p>}
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Role / Position*</label>
                            <input
                                type="text"
                                name="role"
                                value={ApplyFormData.role}
                                onChange={handleDataapply}
                                placeholder="Computer Science Student"
                                className={`w-full p-2 rounded bg-gray-50 dark:bg-gray-800 border ${errors.role ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Skills / Expertise*</label>
                        <input
                            type="text"
                            name="skills"
                            value={ApplyFormData.skills}
                            onChange={handleDataapply}
                            placeholder="Web Dev, AI, Blockchain, Design, etc."
                            className={`w-full p-2 rounded bg-gray-50 dark:bg-gray-800 border ${errors.skills ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
                    </div>

                    {/* Hackathon Specific Fields */}
                    {EventDetails.EventType === "Hackathon" && (
                        <>
                            <div className="space-y-4 border border-indigo-200 dark:border-indigo-500/30 p-5 rounded-xl bg-indigo-50 dark:bg-indigo-500/5">
                                <p className="font-semibold text-indigo-600 dark:text-indigo-400 text-lg">Hackathon Details</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-1 font-medium text-sm">Team Name*</label>
                                        <input
                                            type="text"
                                            name="teamName"
                                            value={ApplyFormData.teamName}
                                            onChange={handleDataapply}
                                            placeholder="e.g., Code Warriors"
                                            className={`w-full p-2.5 rounded bg-white dark:bg-gray-800 border ${errors.teamName ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} focus:border-indigo-500 outline-none`}
                                        />
                                        {errors.teamName && <p className="text-red-500 text-xs mt-1">{errors.teamName}</p>}
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-medium text-sm">Members Count*</label>
                                        <select
                                            name="membersCount"
                                            value={ApplyFormData.membersCount}
                                            onChange={handleDataapply}
                                            className={`w-full p-2.5 rounded bg-white dark:bg-gray-800 border ${errors.membersCount ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} focus:border-indigo-500 outline-none`}
                                        >
                                            <option value="">Select Count</option>
                                            <option value="1">1 (Solo)</option>
                                            <option value="2">2 Members</option>
                                            <option value="3">3 Members</option>
                                            <option value="4">4 Members</option>
                                        </select>
                                        {errors.membersCount && <p className="text-red-500 text-xs mt-1">{errors.membersCount}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium text-sm">Team Lead Name</label>
                                    <input
                                        type="text"
                                        name="teamLeadName"
                                        value={ApplyFormData.teamLeadName}
                                        onChange={handleDataapply}
                                        placeholder="Name of the team representative"
                                        className="w-full p-2.5 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-indigo-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium text-sm">Experience Level (Hackathons)</label>
                                    <select
                                        name="experienceLevel"
                                        value={ApplyFormData.experienceLevel}
                                        onChange={handleDataapply}
                                        className="w-full p-2.5 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-indigo-500 outline-none"
                                    >
                                        <option value="">Select Experience</option>
                                        <option value="First Timer">First Timer</option>
                                        <option value="Intermediate (1-3 Hackathons)">Intermediate (1-3 Hackathons)</option>
                                        <option value="Pro (4+ Hackathons)">Pro (4+ Hackathons)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium text-sm">Describe your project idea*</label>
                                    <textarea
                                        name="ideaDescription"
                                        value={ApplyFormData.ideaDescription}
                                        onChange={handleDataapply}
                                        rows="3"
                                        placeholder="What problem are you solving and what's your proposed tech stack?"
                                        className={`w-full p-2.5 rounded bg-white dark:bg-gray-800 border ${errors.ideaDescription ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} focus:border-indigo-500 outline-none`}
                                    />
                                    {errors.ideaDescription && <p className="text-red-500 text-xs mt-1">{errors.ideaDescription}</p>}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Workshop Specific Fields */}
                    {EventDetails.EventType === "Workshop" && (
                        <>
                            <div className="space-y-4 border border-emerald-200 dark:border-emerald-500/30 p-5 rounded-xl bg-emerald-50 dark:bg-emerald-500/5">
                                <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-lg">Workshop Details</p>
                                <div>
                                    <label className="block mb-1 font-medium text-sm">Reason for Attending*</label>
                                    <textarea
                                        name="reasonForAttending"
                                        value={ApplyFormData.reasonForAttending}
                                        onChange={handleDataapply}
                                        rows="2"
                                        placeholder="Explain your interest in this specific workshop"
                                        className={`w-full p-2.5 rounded bg-white dark:bg-gray-800 border ${errors.reasonForAttending ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} focus:border-emerald-500 outline-none`}
                                    />
                                    {errors.reasonForAttending && <p className="text-red-500 text-xs mt-1">{errors.reasonForAttending}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-1 font-medium text-sm">Your Proficiency*</label>
                                        <select
                                            name="proficiency"
                                            value={ApplyFormData.proficiency}
                                            onChange={handleDataapply}
                                            className={`w-full p-2.5 rounded bg-white dark:bg-gray-800 border ${errors.proficiency ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} focus:border-emerald-500 outline-none`}
                                        >
                                            <option value="">Select Level</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                        {errors.proficiency && <p className="text-red-500 text-xs mt-1">{errors.proficiency}</p>}
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-medium text-sm">Expected Outcomes</label>
                                        <input
                                            type="text"
                                            name="expectedOutcomes"
                                            value={ApplyFormData.expectedOutcomes}
                                            onChange={handleDataapply}
                                            placeholder="What do you hope to learn?"
                                            className="w-full p-2.5 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-emerald-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Tech Event Specific Fields */}
                    {EventDetails.EventType === "Tech Event" && (
                        <>
                            <div className="space-y-4 border border-cyan-200 dark:border-cyan-500/30 p-5 rounded-xl bg-cyan-50 dark:bg-cyan-500/5">
                                <p className="font-semibold text-cyan-600 dark:text-cyan-400 text-lg">Tech Event Details</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-1 font-medium text-sm">Professional Status*</label>
                                        <select
                                            name="professionalStatus"
                                            value={ApplyFormData.professionalStatus}
                                            onChange={handleDataapply}
                                            className={`w-full p-2.5 rounded bg-white dark:bg-gray-800 border ${errors.professionalStatus ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} focus:border-cyan-500 outline-none`}
                                        >
                                            <option value="">Select Status</option>
                                            <option value="Student">Student</option>
                                            <option value="Working Professional">Working Professional</option>
                                            <option value="Freelancer">Freelancer</option>
                                            <option value="Founder/CEO">Founder/CEO</option>
                                        </select>
                                        {errors.professionalStatus && <p className="text-red-500 text-xs mt-1">{errors.professionalStatus}</p>}
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-medium text-sm">Areas of Interest*</label>
                                        <input
                                            type="text"
                                            name="areasOfInterest"
                                            value={ApplyFormData.areasOfInterest}
                                            onChange={handleDataapply}
                                            placeholder="AI, Web3, Cloud, etc."
                                            className={`w-full p-2.5 rounded bg-white dark:bg-gray-800 border ${errors.areasOfInterest ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} focus:border-cyan-500 outline-none`}
                                        />
                                        {errors.areasOfInterest && <p className="text-red-500 text-xs mt-1">{errors.areasOfInterest}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium text-sm">Previous Event Experience</label>
                                    <textarea
                                        name="previousEventExperience"
                                        value={ApplyFormData.previousEventExperience}
                                        onChange={handleDataapply}
                                        rows="2"
                                        placeholder="List any similar events you've attended previously"
                                        className="w-full p-2.5 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-cyan-500 outline-none"
                                    />
                                </div>
                            </div>
                        </>
                    )}



                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full ${isSubmitting ? 'bg-blue-400 dark:bg-indigo-400' : 'bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700'} text-white font-semibold py-3 px-4 rounded-lg flex justify-center items-center cursor-pointer transition-colors`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AppliedEvent
