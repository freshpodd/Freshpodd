import React, { useState, useEffect } from 'react';
import { type User, type QuoteRequest } from '../types';
import { ArrowLeftIcon } from './icons';

interface QuotePageProps {
    currentUser: User | null;
    onSubmit: (requestData: Omit<QuoteRequest, 'id' | 'status' | 'date'>) => void;
    onGenerateQuote: (requestData: Omit<QuoteRequest, 'id' | 'status' | 'date' | 'estimatedQuote'>) => Promise<string | null>;
    onGoBack: () => void;
    canGoBack: boolean;
}

const specialFeaturesOptions = [
    'Dual-zone temperature control',
    'Custom branding/logo',
    'Integrated GPS tracking',
    'Heavy-duty battery upgrade',
    'Stainless steel interior',
];

const QuotePage: React.FC<QuotePageProps> = ({ currentUser, onSubmit, onGenerateQuote, onGoBack, canGoBack }) => {
    const [submitted, setSubmitted] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedQuote, setGeneratedQuote] = useState<string | null>(null);
    
    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [company, setCompany] = useState('');
    const [capacity, setCapacity] = useState(150);
    const [dimensions, setDimensions] = useState('');
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [otherFeatures, setOtherFeatures] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [details, setDetails] = useState('');

    useEffect(() => {
        if (currentUser) {
            setName(currentUser.name);
            setEmail(currentUser.email);
            setPhone(currentUser.phone || '');
        }
    }, [currentUser]);

    const handleFeatureChange = (feature: string) => {
        setSelectedFeatures(prev =>
            prev.includes(feature)
            ? prev.filter(f => f !== feature)
            : [...prev, feature]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setIsGenerating(true);

        const finalFeatures = [...selectedFeatures];
        if (otherFeatures.trim()) {
            finalFeatures.push('Other'); // To signify the 'other' field was used
        }

        const requestData: Omit<QuoteRequest, 'id' | 'status' | 'date' | 'estimatedQuote'> = {
            name, email, phone, company, capacity, dimensions,
            features: finalFeatures,
            otherFeatures: otherFeatures.trim(),
            quantity, details
        };

        const quote = await onGenerateQuote(requestData);
        
        if (quote) {
            setGeneratedQuote(quote);
            onSubmit({ ...requestData, estimatedQuote: quote });
        } else {
            setGeneratedQuote("N/A"); // Indicate that quote generation failed
            onSubmit(requestData); // Submit without a quote
        }
        setIsGenerating(false);
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
                <div className="max-w-4xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-white mb-4">Request a Custom Quote</h1>
                        <p className="text-lg text-gray-300 mb-12">Tell us your requirements, and our team will build a personalized quote for your custom FreshPodd solution.</p>
                    </div>

                    <div className="bg-freshpodd-gray/20 p-8 md:p-12 rounded-lg shadow-lg">
                        {submitted ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                {isGenerating ? (
                                    <>
                                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
                                        <style>{`.loader{border-top-color:#14b8a6;animation:spin 1s linear infinite}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`}</style>
                                        <h3 className="text-3xl font-bold text-white mb-4">Generating Your Instant Quote...</h3>
                                        <p className="text-gray-300 text-lg">Please wait a moment while our AI calculates your estimate.</p>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-3xl font-bold text-white mb-4">Thank You!</h3>
                                        <p className="text-gray-300 text-lg mb-8">Your quote request has been received. Our team will review the details and get back to you within 2-3 business days.</p>
                                        {generatedQuote && generatedQuote !== "N/A" && (
                                            <div className="bg-freshpodd-blue p-6 rounded-lg border-2 border-freshpodd-teal w-full max-w-md">
                                                <p className="text-lg text-freshpodd-teal font-semibold">Instant Estimated Quote:</p>
                                                <p className="text-4xl font-extrabold text-white mt-2">{generatedQuote}</p>
                                                <p className="text-xs text-gray-400 mt-2">(This is an estimate. Final price may vary.)</p>
                                            </div>
                                        )}
                                        {generatedQuote === "N/A" && (
                                            <div className="bg-yellow-900/50 border border-yellow-500 text-yellow-300 p-4 rounded-lg">
                                                <p>We couldn't generate an instant quote at this time, but your request has been submitted.</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Section 1: Contact Info */}
                                <fieldset>
                                    <legend className="text-2xl font-bold text-white border-b border-freshpodd-gray pb-2 mb-6">1. Contact Information</legend>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-freshpodd-gray text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-freshpodd-teal" />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-freshpodd-gray text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-freshpodd-teal" />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                                            <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full bg-freshpodd-gray text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-freshpodd-teal" />
                                        </div>
                                        <div>
                                            <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">Company Name (Optional)</label>
                                            <input type="text" id="company" value={company} onChange={e => setCompany(e.target.value)} className="w-full bg-freshpodd-gray text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-freshpodd-teal" />
                                        </div>
                                    </div>
                                </fieldset>

                                {/* Section 2: Unit Specs */}
                                <fieldset>
                                    <legend className="text-2xl font-bold text-white border-b border-freshpodd-gray pb-2 mb-6">2. Unit Specifications</legend>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="capacity" className="block text-sm font-medium text-gray-300 mb-2">Required Capacity (Liters)</label>
                                            <input type="range" id="capacity" min="50" max="1000" step="10" value={capacity} onChange={e => setCapacity(Number(e.target.value))} className="w-full h-2 bg-freshpodd-gray rounded-lg appearance-none cursor-pointer" />
                                            <div className="text-center text-white mt-2 font-bold">{capacity} L</div>
                                        </div>
                                        <div>
                                            <label htmlFor="dimensions" className="block text-sm font-medium text-gray-300 mb-2">Custom Dimensions (L x W x H)</label>
                                            <input type="text" id="dimensions" value={dimensions} onChange={e => setDimensions(e.target.value)} placeholder="e.g., 80cm x 50cm x 55cm" className="w-full bg-freshpodd-gray text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-freshpodd-teal" />
                                        </div>
                                    </div>
                                </fieldset>

                                {/* Section 3: Features */}
                                <fieldset>
                                    <legend className="text-2xl font-bold text-white border-b border-freshpodd-gray pb-2 mb-6">3. Special Features</legend>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {specialFeaturesOptions.map(feature => (
                                            <label key={feature} className="flex items-center text-gray-300 cursor-pointer p-3 bg-freshpodd-gray/40 rounded-md hover:bg-freshpodd-gray/80">
                                                <input type="checkbox" checked={selectedFeatures.includes(feature)} onChange={() => handleFeatureChange(feature)} className="h-4 w-4 rounded bg-freshpodd-gray border-gray-600 text-freshpodd-teal focus:ring-freshpodd-teal" />
                                                <span className="ml-3">{feature}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="otherFeatures" className="block text-sm font-medium text-gray-300 mb-2">Other Features or Requirements</label>
                                        <input type="text" id="otherFeatures" value={otherFeatures} onChange={e => setOtherFeatures(e.target.value)} placeholder="Specify other features..." className="w-full bg-freshpodd-gray text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-freshpodd-teal" />
                                    </div>
                                </fieldset>

                                {/* Section 4: Quantity & Details */}
                                <fieldset>
                                    <legend className="text-2xl font-bold text-white border-b border-freshpodd-gray pb-2 mb-6">4. Quantity & Details</legend>
                                     <div>
                                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-2">Number of Units *</label>
                                        <input type="number" id="quantity" min="1" value={quantity} onChange={e => setQuantity(Math.max(1, Number(e.target.value)))} required className="w-full max-w-xs bg-freshpodd-gray text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-freshpodd-teal" />
                                    </div>
                                    <div className="mt-6">
                                        <label htmlFor="details" className="block text-sm font-medium text-gray-300 mb-2">Additional Details *</label>
                                        <textarea id="details" rows={5} value={details} onChange={e => setDetails(e.target.value)} required placeholder="Please describe your use case, specific requirements, or any other important information." className="w-full bg-freshpodd-gray text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-freshpodd-teal"></textarea>
                                    </div>
                                </fieldset>

                                <div className="text-center pt-6">
                                    <button type="submit" className="bg-freshpodd-teal hover:bg-teal-500 text-white font-bold py-4 px-12 rounded-lg text-xl transition-transform transform hover:scale-105 duration-300">Submit Request</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuotePage;