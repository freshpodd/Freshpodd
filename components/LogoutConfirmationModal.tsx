import React from 'react';

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-freshpodd-blue border border-freshpodd-teal/50 rounded-lg shadow-xl p-8 w-full max-w-md text-center transform transition-all animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-4">Confirm Logout</h2>
        <p className="text-gray-300 mb-8">Are you sure you want to log out of your account?</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="bg-freshpodd-gray/50 text-white font-bold py-2 px-6 rounded-md hover:bg-freshpodd-gray/80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
            animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LogoutConfirmationModal;
