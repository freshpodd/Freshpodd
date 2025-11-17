import React, { useState, useEffect } from 'react';
import { type User } from '../types';
import { XMarkIcon } from './icons';

interface StockNotificationModalProps {
  productName: string;
  currentUser: User | null;
  onClose: () => void;
  onSignup: (email: string) => void;
}

const StockNotificationModal: React.FC<StockNotificationModalProps> = ({ productName, currentUser, onClose, onSignup }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser?.email) {
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    onSignup(email);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4" onClick={onClose} aria-modal="true" role="dialog">
      <div className="bg-freshpodd-blue border border-freshpodd-teal/50 rounded-lg shadow-xl p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white text-left">Get Notified</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><XMarkIcon /></button>
        </div>
        <p className="text-gray-300 mb-6 text-left">
          Enter your email to be notified when <strong>{productName}</strong> is back in stock.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email-notify" className="sr-only">Email address</label>
            <input
              id="email-notify"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-freshpodd-gray text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-freshpodd-teal"
              placeholder="your.email@example.com"
            />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full bg-freshpodd-teal hover:bg-teal-500 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">
            Notify Me
          </button>
        </form>
      </div>
    </div>
  );
};

export default StockNotificationModal;
