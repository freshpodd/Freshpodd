import React, { useState } from 'react';
import { ArrowLeftIcon } from './icons';

interface ContactPageProps {
    onGoBack: () => void;
    canGoBack: boolean;
}

const ContactPage: React.FC<ContactPageProps> = ({ onGoBack, canGoBack }) => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-freshpodd-blue text-freshpodd-light py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 {canGoBack && (
                    <button onClick={onGoBack} className="flex items-center space-x-2 text-freshpodd-teal hover:text-teal-400 mb-8 font-semibold">
                        <ArrowLeftIcon className="w-5 h-5" />
                        <span>Back</span>
                    </button>
                )}
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl font-extrabold text-white mb-4">Get In Touch</h1>
                    <p className="text-lg text-gray-300 mb-12">Have questions? We'd love to hear from you. Fill out the form below or reach out to us via our support channels.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="bg-freshpodd-gray/20 p-8 rounded-lg shadow-lg">
                        {submitted ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <h3 className="text-2xl font-bold text-white mb-4">Thank You!</h3>
                                <p className="text-gray-300">Your message has been sent. Our team will get back to you shortly.</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                        <input type="text" id="name" required className="w-full bg-freshpodd-gray text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-freshpodd-teal" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                        <input type="email" id="email" required className="w-full bg-freshpodd-gray text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-freshpodd-teal" />
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                                        <textarea id="message" rows={5} required className="w-full bg-freshpodd-gray text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-freshpodd-teal"></textarea>
                                    </div>
                                    <div>
                                        <button type="submit" className="w-full bg-freshpodd-teal hover:bg-teal-500 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">Send Message</button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                    <div className="space-y-8 text-gray-300">
                        <div className="bg-freshpodd-gray/20 p-8 rounded-lg">
                            <h3 className="text-xl font-bold text-white mb-3">Contact Information</h3>
                            <p><strong>Email:</strong> support@freshpodd.com</p>
                            <p><strong>Phone:</strong> +1 (800) 555-FPOD</p>
                            <p><strong>Address:</strong> 123 Innovation Drive, Tech Valley, CA 94001</p>
                        </div>
                        <div className="bg-freshpodd-gray/20 p-8 rounded-lg">
                            <h3 className="text-xl font-bold text-white mb-3">Business Hours</h3>
                            <p>Monday - Friday: 9:00 AM - 6:00 PM (PST)</p>
                            <p>Saturday: 10:00 AM - 4:00 PM (PST)</p>
                            <p>Sunday: Closed</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;