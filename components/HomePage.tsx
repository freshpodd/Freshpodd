import React from 'react';
import { type View } from '../types';
import { StarIcon, ArrowLeftIcon } from './icons';

interface HomePageProps {
  onNavigate: (view: View) => void;
  onGoBack: () => void;
  canGoBack: boolean;
}

const testimonials = [
  { name: 'Sarah L.', quote: "The FreshPodd has been a game-changer for our camping trips. No more melting ice! Everything stays perfectly chilled for days.", rating: 5 },
  { name: 'Tom B.', quote: "As a small-scale farmer, this is exactly what I needed to transport produce to the market. The solar charging is brilliant.", rating: 5 },
  { name: 'Eco Adventures Co.', quote: "We equip all our off-road tour vehicles with FreshPodds. They're rugged, reliable, and our clients love them.", rating: 4 },
];

const FeatureCard: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-freshpodd-blue p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
    <div className="text-5xl text-freshpodd-teal mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

const HomePage: React.FC<HomePageProps> = ({ onNavigate, onGoBack, canGoBack }) => {
  return (
    <div className="text-white">
      {canGoBack && (
          <div className="bg-freshpodd-blue">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                  <button onClick={onGoBack} className="flex items-center space-x-2 text-freshpodd-teal hover:text-teal-400 font-semibold z-20 relative">
                      <ArrowLeftIcon className="w-5 h-5" />
                      <span>Back</span>
                  </button>
              </div>
          </div>
      )}
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        <img src="https://i.imgur.com/8L26nKT.jpeg" alt="FreshPodd in an outdoor setting" className="absolute inset-0 w-full h-full object-cover z-[-1]" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.7)'}}>Cooling, Reimagined.</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-200" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.7)'}}>Experience true off-grid freedom with FreshPodd, the world's leading solar-powered portable cold storage solution.</p>
          <button onClick={() => onNavigate('product')} className="bg-freshpodd-teal hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 duration-300">
            Discover FreshPodd
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-freshpodd-blue py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose FreshPodd?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard icon="☀️" title="Solar Powered" description="Harness the power of the sun. Our integrated solar panel keeps your FreshPodd charged and running, anywhere." />
            <FeatureCard icon="❄️" title="Extended Cooling" description="Advanced insulation and an ultra-efficient compressor provide up to 72 hours of cooling on a single charge." />
            <FeatureCard icon="💪" title="Built Tough" description="Designed for adventure, the FreshPodd features a rugged, weatherproof shell and all-terrain wheels." />
          </div>
        </div>
      </section>

      {/* Product Highlight Section */}
      <section className="py-20 bg-freshpodd-gray/20">
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2">
                    <img src="https://i.imgur.com/uF7hIe3.jpeg" alt="FreshPodd with lid open" className="rounded-lg shadow-2xl w-full" />
                </div>
                <div className="md:w-1/2 text-center md:text-left">
                    <h2 className="text-3xl font-bold mb-4">The Only Cooler You'll Ever Need</h2>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                        From the back of your truck to the middle of nowhere, FreshPodd delivers reliable, ice-free cooling. With a spacious interior and smart, user-friendly controls, it's the ultimate companion for your off-grid lifestyle.
                    </p>
                    <button onClick={() => onNavigate('product')} className="bg-transparent border-2 border-freshpodd-teal text-freshpodd-teal font-bold py-3 px-8 rounded-full hover:bg-freshpodd-teal hover:text-white transition-all duration-300">
                        View Specs & Features
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* Custom Quote Section */}
      <section className="py-20 bg-freshpodd-blue px-4">
          <div className="container mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Need Something Special?</h2>
              <p className="text-gray-300 max-w-3xl mx-auto mb-8">
                  We offer fully customizable cold storage solutions for commercial and specialized needs. From custom sizes and branding to advanced features like GPS tracking or dual-zone cooling, our engineering team can build the perfect FreshPodd for you.
              </p>
              <button onClick={() => onNavigate('quote')} className="bg-freshpodd-teal hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 duration-300">
                  Get a Custom Quote
              </button>
          </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-freshpodd-gray/20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-freshpodd-gray/30 p-8 rounded-lg shadow-lg flex flex-col">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} solid={i < testimonial.rating} className="text-yellow-400 h-5 w-5"/>
                  ))}
                </div>
                <p className="text-gray-300 italic mb-6 flex-grow">"{testimonial.quote}"</p>
                <p className="font-bold text-white text-right">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;