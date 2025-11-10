import React, { useState } from 'react';
import { type User } from '../types';

interface LoginPageProps {
  onLogin: (credentials: { email: string; password: string; name?: string }) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    
    if (isLoginView) {
        onLogin({ email, password });
    } else {
        if (!name || password.length < 8) {
            setError('Please fill all fields. Password must be at least 8 characters.');
            return;
        }
        onLogin({ email, password, name });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-freshpodd-blue py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-freshpodd-gray/20 p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            {isLoginView ? 'Sign in to your account' : 'Create a new account'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {!isLoginView && (
              <div>
                <label htmlFor="name" className="sr-only">Name</label>
                <input id="name" name="name" type="text" value={name} onChange={e => setName(e.target.value)} required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-600 bg-freshpodd-gray placeholder-gray-400 text-white rounded-t-md focus:outline-none focus:ring-freshpodd-teal focus:border-freshpodd-teal focus:z-10 sm:text-sm" placeholder="Full Name" />
              </div>
            )}
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input id="email-address" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required className={`appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-600 bg-freshpodd-gray placeholder-gray-400 text-white ${isLoginView ? 'rounded-t-md' : ''} focus:outline-none focus:ring-freshpodd-teal focus:border-freshpodd-teal focus:z-10 sm:text-sm`} placeholder="Email address" />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-600 bg-freshpodd-gray placeholder-gray-400 text-white rounded-b-md focus:outline-none focus:ring-freshpodd-teal focus:border-freshpodd-teal focus:z-10 sm:text-sm" placeholder="Password" />
            </div>
          </div>
          
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-freshpodd-teal hover:text-teal-400">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-freshpodd-teal hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-freshpodd-teal transition-colors">
              {isLoginView ? 'Sign in' : 'Sign up'}
            </button>
          </div>
        </form>
        <div className="text-center">
            <p className="text-sm text-gray-300">
                {isLoginView ? "Don't have an account?" : "Already have an account?"}
                <button onClick={() => {setIsLoginView(!isLoginView); setError('')}} className="font-medium text-freshpodd-teal hover:text-teal-400 ml-2">
                    {isLoginView ? "Sign up" : "Sign in"}
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;