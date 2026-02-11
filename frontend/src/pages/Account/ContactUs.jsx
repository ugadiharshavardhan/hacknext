import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { FaPaperPlane, FaUser, FaEnvelope, FaCommentAlt } from 'react-icons/fa';

function ContactUs({ userData }) {
    const [state, handleSubmit] = useForm("mgoloerr");

    if (state.succeeded) {
        return (
            <div className="animate-slideUp flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
                <div className="bg-emerald-500/10 p-6 rounded-full border border-emerald-500/20 mb-6">
                    <FaPaperPlane className="text-4xl text-emerald-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Message Sent!</h2>
                <p className="text-gray-400 max-w-md text-lg">
                    Thanks for reaching out {userData?.username}. We've received your message and will get back to you shortly at <span className="text-indigo-400">{userData?.email}</span>.
                </p>
            </div>
        );
    }

    return (
        <div className="animate-slideUp max-w-2xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Contact Us</h2>
                    <p className="text-gray-400">Have questions or feedback? We'd love to hear from you.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Hidden Fields for User Context */}
                    <input type="hidden" name="_subject" value={`New message from ${userData?.username || 'User'}`} />
                    <input type="hidden" name="username" value={userData?.username || ''} />
                    <input type="hidden" name="user_id" value={userData?._id || ''} />

                    <div className="space-y-1">
                        <label htmlFor="email" className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaEnvelope className="text-gray-500" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                defaultValue={userData?.email || ''}
                                readOnly={!!userData?.email}
                                className={`w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors ${userData?.email ? 'opacity-70 cursor-not-allowed' : ''}`}
                                placeholder="your@email.com"
                            />
                        </div>
                        <ValidationError
                            prefix="Email"
                            field="email"
                            errors={state.errors}
                            className="text-red-400 text-xs mt-1 ml-1 block"
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="message" className="text-sm font-medium text-gray-300 ml-1">Message</label>
                        <div className="relative">
                            <div className="absolute top-3 left-3 pointer-events-none">
                                <FaCommentAlt className="text-gray-500 mt-0.5" />
                            </div>
                            <textarea
                                id="message"
                                name="message"
                                rows="5"
                                className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none mb-1"
                                placeholder="How can we help you today?"
                            />
                        </div>
                        <ValidationError
                            prefix="Message"
                            field="message"
                            errors={state.errors}
                            className="text-red-400 text-xs mt-1 ml-1 block"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={state.submitting}
                        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                    >
                        {state.submitting ? (
                            <>Sending...</>
                        ) : (
                            <>
                                <FaPaperPlane /> Send Message
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ContactUs;
