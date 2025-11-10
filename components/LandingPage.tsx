import React from 'react';
import { type View } from '../types';

interface LandingPageProps {
  onNavigate: (view: View) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center text-white p-4">
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
      <img src="https://i.imgur.com/8L26nKT.jpeg" alt="FreshPodd in an outdoor setting" className="absolute inset-0 w-full h-full object-cover z-[-1]" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center space-x-4 mb-4">
            <svg className="w-16 h-16 text-freshpodd-teal" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="48" fill="#f0f9ff" stroke="#14b8a6" strokeWidth="4"/>
                <path d="M50 10 L50 10 L58.66 25 L75 25 L64.64 35.36 L69.14 51.5 L50 42.5 L30.86 51.5 L35.36 35.36 L25 25 L41.34 25 Z" fill="#14b8a6" transform="translate(0, 5) scale(0.9)"/>
                <path d="M50,20 a30,30 0 1,0 0,60 a30,30 0 1,0 0,-60" stroke="#0c4a6e" strokeWidth="5" fill="none" />
            </svg>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-wider" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.8)'}}>FRESHPODD</h1>
        </div>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 text-gray-200" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.7)'}}>
            Welcome to the future of portable solar cold storage.
        </p>
        
        <div className="w-full max-w-md space-y-6">
            <button 
                onClick={() => onNavigate('home')} 
                className="w-full bg-freshpodd-teal hover:bg-teal-500 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all transform hover:scale-105 duration-300 shadow-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-freshpodd-blue focus:ring-white"
            >
                Customer Portal
            </button>
            <button 
                onClick={() => onNavigate('login')} 
                className="w-full bg-transparent hover:bg-white/10 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all transform hover:scale-105 duration-300 shadow-lg border-2 border-white"
            >
                Admin Login
            </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
