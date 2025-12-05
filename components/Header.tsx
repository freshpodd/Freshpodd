import React from 'react';
import { ShoppingCartIcon, UserCircleIcon, Cog6ToothIcon, HeartIcon } from './icons';
import { type View, type User, type Currency } from '../types';

interface HeaderProps {
  onNavigate: (view: View) => void;
  cartItemCount: number;
  wishlistItemCount: number;
  user: User | null;
  onLogout: () => void;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, cartItemCount, wishlistItemCount, user, onLogout, currency, onCurrencyChange }) => {
  return (
    <header className="bg-freshpodd-blue/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('home')}} className="text-white flex items-center space-x-2">
              <svg className="w-10 h-10 text-freshpodd-teal" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" fill="#f0f9ff"/>
                  <path d="M50 10 L50 10 L58.66 25 L75 25 L64.64 35.36 L69.14 51.5 L50 42.5 L30.86 51.5 L35.36 35.36 L25 25 L41.34 25 Z" fill="#14b8a6" transform="translate(0, 5) scale(0.9)"/>
                  <path d="M50,20 a30,30 0 1,0 0,60 a30,30 0 1,0 0,-60" stroke="#0c4a6e" strokeWidth="5" fill="none" />
              </svg>
              <span className="text-2xl font-bold tracking-wider">FRESHPODD</span>
            </a>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('home')}} className="text-gray-300 hover:bg-freshpodd-gray hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>
                <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('product')}} className="text-gray-300 hover:bg-freshpodd-gray hover:text-white px-3 py-2 rounded-md text-sm font-medium">Product</a>
                <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('quote')}} className="text-gray-300 hover:bg-freshpodd-gray hover:text-white px-3 py-2 rounded-md text-sm font-medium">Custom Quote</a>
                <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('contact')}} className="text-gray-300 hover:bg-freshpodd-gray hover:text-white px-3 py-2 rounded-md text-sm font-medium">Contact</a>
                {user && <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('orders')}} className="text-gray-300 hover:bg-freshpodd-gray hover:text-white px-3 py-2 rounded-md text-sm font-medium">My Orders</a>}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <input type="text" placeholder="Search..." className="bg-freshpodd-gray/50 text-white placeholder-gray-400 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-freshpodd-teal" />
            </div>
             <div className="hidden md:block">
                <select 
                    value={currency} 
                    onChange={(e) => onCurrencyChange(e.target.value as Currency)}
                    className="bg-freshpodd-gray/50 text-white placeholder-gray-400 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-freshpodd-teal appearance-none"
                    aria-label="Select currency"
                >
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                </select>
            </div>
             {user?.isAdmin && (
              <button onClick={() => onNavigate('admin')} className="hidden md:block text-gray-300 hover:text-white" title="Admin Dashboard">
                  <Cog6ToothIcon className="h-7 w-7"/>
              </button>
            )}
            {user && (
                 <button onClick={() => onNavigate('wishlist')} className="relative text-gray-300 hover:text-white">
                    <HeartIcon className="h-7 w-7" />
                    {wishlistItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-freshpodd-teal text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{wishlistItemCount}</span>
                    )}
                 </button>
            )}
            <button onClick={() => onNavigate('cart')} className="relative text-gray-300 hover:text-white">
              <ShoppingCartIcon className="h-7 w-7" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-freshpodd-teal text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItemCount}</span>
              )}
            </button>
            {user ? (
                <div className="relative group">
                    <button className="flex items-center text-gray-300 hover:text-white">
                        <UserCircleIcon className="h-7 w-7"/>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 hidden group-hover:block">
                        <div className="px-4 py-2 text-sm text-freshpodd-gray border-b">{user.name}</div>
                        <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('wishlist')}} className="block px-4 py-2 text-sm text-freshpodd-gray hover:bg-gray-100">Wishlist</a>
                        {user.isAdmin && <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('admin')}} className="block px-4 py-2 text-sm text-freshpodd-gray hover:bg-gray-100 md:hidden">Admin</a>}
                        <a href="#" onClick={(e) => {e.preventDefault(); onLogout()}} className="block px-4 py-2 text-sm text-freshpodd-gray hover:bg-gray-100">Logout</a>
                    </div>
                </div>
            ) : (
              <button onClick={() => onNavigate('login')} className="text-gray-300 hover:bg-freshpodd-gray hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;