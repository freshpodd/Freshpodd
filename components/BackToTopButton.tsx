import React from 'react';
import { ArrowUpIcon } from './icons';

interface BackToTopButtonProps {
  isVisible: boolean;
  onClick: () => void;
}

const BackToTopButton: React.FC<BackToTopButtonProps> = ({ isVisible, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-24 sm:bottom-6 right-6 bg-freshpodd-teal text-white p-3 rounded-full shadow-lg hover:bg-teal-500 transition-all duration-300 transform ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-freshpodd-blue focus:ring-freshpodd-teal z-50`}
      aria-label="Scroll to top"
    >
      <ArrowUpIcon className="w-6 h-6" />
    </button>
  );
};

export default BackToTopButton;
