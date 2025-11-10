import React from 'react';

const ReturnPolicyPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-freshpodd-blue text-freshpodd-light py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-freshpodd-gray/20 p-8 md:p-12 rounded-lg shadow-lg">
                    <h1 className="text-4xl font-extrabold text-white mb-6 text-center">Return Policy</h1>
                    <div className="space-y-4 text-gray-300 leading-relaxed prose prose-invert prose-lg max-w-none">
                        <p>
                            At FreshPodd, we stand behind the quality of our products. We are confident that you'll love your new solar cooler.
                        </p>
                        <h2 className="text-2xl font-bold text-white pt-4">30-Day Money-Back Guarantee</h2>
                        <p>
                            If you are not completely satisfied with your purchase for any reason, you may return it to us for a full refund or an exchange. Please see below for more information on our return policy.
                        </p>
                        <h3 className="text-xl font-semibold text-white pt-2">Return Process</h3>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>All returns must be postmarked within thirty (30) days of the purchase date.</li>
                            <li>All returned items must be in new and unused condition, with all original tags and labels attached.</li>
                            <li>To return an item, please email customer service at support@freshpodd.com to obtain a Return Merchandise Authorization (RMA) number.</li>
                        </ul>
                         <h3 className="text-xl font-semibold text-white pt-2">Refunds</h3>
                        <p>
                           After receiving your return and inspecting the condition of your item, we will process your return or exchange. Please allow at least seven (7) days from the receipt of your item to process your return or exchange. We will notify you by email when your return has been processed.
                        </p>
                        <p className="pt-4 text-sm text-gray-400">
                            <em>Please Note: This is a placeholder policy. For specific details, please contact our support team.</em>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReturnPolicyPage;
