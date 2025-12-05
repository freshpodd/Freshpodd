import React, { useState, useMemo, useEffect } from 'react';
import { type User, type Order, type Warehouse } from '../types';
import { ArrowLeftIcon, MapPinIcon } from './icons';

interface LoginPageProps {
  onLogin: (credentials: { email: string; password: string; name?: string }) => void;
  onGoBack: () => void;
  canGoBack: boolean;
  orders: Order[];
  warehouses: Warehouse[];
}

const WORLD_MAP_PATH = "M998.9,291.9l-1.1-1.5l-1.3-1.1l-2.1-1.1l-1.9-0.6l-2.1-0.2l-2.1,0.2l-1.7,0.4l-1.7,0.8l-1.5,0.9l-1.5,1.3l-1.3,1.5l-1.1,1.5l-0.8,1.5l-0.8,1.9l-0.4,1.7l-0.4,2.1l-0.2,2.1l0,2.1l0,1.9l0.2,1.9l0.4,1.9l0.4,1.5l0.8,1.7l0.8,1.3l1.1,1.3l1.3,1.1l1.5,0.9l1.7,0.8l1.7,0.4l1.9,0.2l2.1,0l2.1-0.4l1.9-0.6l1.7-0.9l1.5-1.1l1.3-1.5l1.1-1.5l0.8-1.7l0.6-1.9l0.4-1.9l0.2-2.1l0-2.1l-0.2-2.1l-0.4-1.9l-0.6-1.9l-0.8-1.5l-1.1-1.5l-1.3-1.3l-1.5-1.1l-1.7-0.8l-1.9-0.6l-2.1-0.4l-1.9-0.2l-2.1,0l-1.9,0.2l-1.7,0.4l-1.7,0.8l-1.5,0.9l-1.3,1.3l-1.1,1.5l-1.1,1.7l-0.8,1.7l-0.6,1.9l-0.4,1.9l-0.2,2.1l-0.2,2.1l0,1.9l0.2,1.9l0.2,1.9l0.4,1.9l0.6,1.7l0.8,1.7l1.1,1.5l1.1,1.3l1.3,1.1l1.5,0.9l1.7,0.8l1.7,0.4l1.9,0.2l1.9,0l1.9-0.2l1.9-0.4l1.7-0.8l1.5-0.9l1.3-1.1l1.1-1.3l1.1-1.5l0.8-1.7l0.6-1.7l0.4-1.9l0.2-1.9l0.2-1.9l0-2.1l-0.2-1.9l-0.2-1.9l-0.4-1.9l-0.6-1.7l-0.8-1.7l-1.1-1.5l-1.1-1.3l-1.3-1.1l-1.5-0.9l-1.7-0.8l-1.9-0.4l-1.9-0.2ZM562,335.2l-1.3,1.1l-1.2,1.7l-0.9,1.6l-0.9,2l-0.5,1.8l-0.5,2.4l-0.2,2.2l0,2.5l0.2,2.5l0.2,2.2l0.5,2.2l0.5,1.8l0.9,1.8l0.9,1.6l1.2,1.5l1.3,1.3l1.6,1.1l1.8,0.9l2,0.7l2.2,0.5l2.4,0.4l2.5,0.2l2.5,0l2.5-0.2l2.4-0.4l2.2-0.5l2-0.7l1.8-0.9l1.6-1.1l1.3-1.3l1.2-1.5l0.9-1.6l0.9-1.8l0.5-1.8l0.5-2.2l0.2-2.2l0.2-2.5l0-2.5l-0.2-2.5l-0.2-2.2l-0.5-2.4l-0.5-1.8l-0.9-2l-0.9-1.6l-1.2-1.7l-1.3-1.1l-1.6-1.1l-1.8-0.9l-2-0.7l-2.2-0.5l-2.4-0.4l-2.5-0.2l-2.5,0l-2.5,0.2l-2.4,0.4l-2.2,0.5l-2,0.7l-1.8,0.9l-1.6,1.1l-1.3,1.1h0Zm-5.3-22l-1.6,0.2l-1.4,0.4l-1.3,0.7l-1.1,0.9l-1,1.1l-0.8,1.3l-0.7,1.4l-0.5,1.6l-0.4,1.7l-0.2,1.8l-0.1,1.9l0,1.9l0.1,1.8l0.2,1.8l0.4,1.7l0.5,1.6l0.7,1.4l0.8,1.3l1,1.1l1.1,0.9l1.3,0.7l1.4,0.4l1.6,0.2l1.6,0l1.6-0.2l1.4-0.4l1.3-0.7l1.1-0.9l1-1.1l0.8-1.3l0.7-1.4l0.5-1.6l0.4-1.7l0.2-1.8l0.1-1.8l0-1.9l-0.1-1.9l-0.2-1.8l-0.4-1.7l-0.5-1.6l-0.7-1.4l-0.8-1.3l-1-1.1l-1.1-0.9l-1.3-0.7l-1.4-0.4l-1.6-0.2l-1.6,0h0Zm440.9,291.5l0.2,0.2l0.3,0.5l0.3,0.6l0.3,0.8l0.3,0.9l0.2,1l0.2,1.1l0.1,1.2l0.1,1.3l0,1.4l0,1.5l-0.1,1.4l-0.1,1.3l-0.2,1.2l-0.2,1.1l-0.3,1l-0.3,0.9l-0.3,0.8l-0.3,0.6l-0.3,0.5l-0.2,0.2l-0.2-0.2l-0.3-0.5l-0.3-0.6l-0.3-0.8l-0.3-0.9l-0.2-1l-0.2-1.1l-0.1-1.2l-0.1-1.3l0-1.4l0-1.5l0.1-1.4l0.1-1.3l0.2-1.2l0.2-1.1l0.3-1l0.3-0.9l0.3-0.8l0.3-0.6l0.3-0.5l0.2-0.2h0Zm-87.3-111.8l-1.4,0l-1.3,0.2l-1.2,0.4l-1.1,0.6l-0.9,0.8l-0.8,1l-0.6,1.1l-0.5,1.2l-0.4,1.3l-0.2,1.4l-0.1,1.4l0,1.4l0.1,1.4l0.2,1.4l0.4,1.3l0.5,1.2l0.6,1.1l0.8,1l0.9,0.8l1.1,0.6l1.2,0.4l1.3,0.2l1.4,0l1.4-0.2l1.3-0.4l1.2-0.6l1.1-0.8l0.9-1l0.8-1.1l0.6-1.2l0.5-1.3l0.4-1.4l0.2-1.4l0.1-1.4l0-1.4l-0.1-1.4l-0.2-1.4l-0.4-1.3l-0.5-1.2l-0.6-1.1l-0.8-1l-0.9-0.8l-1.1-0.6l-1.2-0.4l-1.3-0.2l-1.4,0h0Zm-119.2,284.1l0,0l-0.1,0.1l-0.1,0.2l-0.1,0.2l-0.1,0.2l-0.1,0.3l-0.1,0.3l0,0.3l0,0.3l0,0.3l0,0.3l0,0.3l0.1,0.3l0.1,0.3l0.1,0.3l0.1,0.2l0.1,0.2l0.1,0.2l0.1,0.1l0,0l-0.1-0.1l-0.1-0.2l-0.1-0.2l-0.1-0.2l-0.1-0.3l-0.1-0.3l0-0.3l0-0.3l0-0.3l0-0.3l0-0.3l0.1-0.3l0.1-0.3l0.1-0.3l0.1-0.2l0.1-0.2l0.1-0.2l0.1-0.1h0ZM1.1,291.9l1.1,1.5l1.3,1.3l1.5,1.1l1.7,0.8l1.9,0.6l2.1,0.4l2.1,0.2l2.1,0l1.9-0.2l1.7-0.4l1.7-0.8l1.5-0.9l1.3-1.3l1.1-1.5l1.1-1.7l0.8-1.7l0.6-1.9l0.4-1.9l0.2-2.1l0.2-2.1l0-1.9l-0.2-1.9l-0.2-1.9l-0.4-1.9l-0.6-1.7l-0.8-1.7l-1.1-1.5l-1.1-1.3l-1.3-1.1l-1.5-0.9l-1.7-0.8l-1.7-0.4l-1.9-0.2l-2.1,0l-2.1,0.2l-1.9,0.4l-1.7,0.8l-1.5,1.1l-1.3,1.3l-1.1,1.5l-0.8,1.7l-0.8,1.9l-0.4,1.9l-0.4,2.1l-0.2,2.1l0,2.1l0,1.9l0.2,1.9l0.4,1.9l0.4,1.5l0.8,1.7l0.8,1.3l1.1,1.3l1.3,1.1l1.5,0.9l1.7,0.8l1.7,0.4l1.9,0.2l2.1,0l2.1-0.2l1.9-0.4l1.7-0.8l1.5-1.1l1.3-1.3l1.1-1.5l0.8-1.5l0.8-1.9l0.4-1.9l0.4-2.1l0.2-2.1l0-2.1l-0.2-2.1l-0.4-1.9l-0.4-1.5l-0.8-1.7l-0.8-1.3l-1.1-1.3l-1.3-1.1l-1.5-0.9l-1.7-0.8l-1.7-0.4l-1.9-0.2l-2.1,0l-2.1,0.2l-1.9,0.4l-1.7,0.8l-1.5,1.1l-1.3,1.3l-1.1,1.5l-1.1,1.7l-0.8,1.7l-0.6,1.9l-0.4,1.9l-0.2,2.1l-0.2,2.1l0,1.9l0.2,1.9l0.2,1.9l0.4,1.9l0.6,1.7l0.8,1.7l1.1,1.5h0ZM73,222.4l0.4,1.2l0.4,1.1l0.5,1l0.6,0.9l0.7,0.8l0.8,0.7l0.9,0.6l1,0.5l1.1,0.4l1.2,0.3l1.3,0.1l1.3,0l1.3-0.1l1.2-0.3l1.1-0.4l1-0.5l0.9-0.6l0.8-0.7l0.7-0.8l0.6-0.9l0.5-1l0.4-1.1l0.4-1.2l0.3-1.3l0.1-1.3l0-1.3l-0.1-1.3l-0.3-1.3l-0.4-1.2l-0.4-1.1l-0.5-1l-0.6-0.9l-0.7-0.8l-0.8-0.7l-0.9-0.6l-1-0.5l-1.1-0.4l-1.2-0.3l-1.3-0.1l-1.3,0l-1.3,0.1l-1.2,0.3l-1.1,0.4l-1,0.5l-0.9,0.6l-0.8,0.7l-0.7,0.8l-0.6,0.9l-0.5,1l-0.4,1.1l-0.4,1.2l-0.3,1.3l-0.1,1.3l0,1.3l0.1,1.3l0.3,1.3h0Z";

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGoBack, canGoBack, orders, warehouses }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const uniqueDestinations = useMemo(() => {
    const cities = new Set<string>();
    orders.forEach(order => cities.add(order.shippingInfo.city));
    return Array.from(cities);
  }, [orders]);

  const totalRevenue = useMemo(() => {
     const totalInUSD = orders.reduce((sum, order) => sum + order.total, 0);
     const inrRate = 83.50; // INR conversion rate
     const totalInINR = totalInUSD * inrRate;
     return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalInINR);
  }, [orders]);

  const findClosestWarehouse = (orderCoords: { x: number; y: number }) => {
    let closestWarehouse: Warehouse | null = null;
    let minDistance = Infinity;
    for (const warehouse of warehouses) {
        const distance = Math.sqrt(Math.pow(warehouse.coords.x - orderCoords.x, 2) + Math.pow(warehouse.coords.y - orderCoords.y, 2));
        if (distance < minDistance) {
            minDistance = distance;
            closestWarehouse = warehouse;
        }
    }
    return closestWarehouse;
  };
  
  const shipmentRoutes = useMemo(() => {
      return orders
        .filter(order => order.shippingInfo.coords)
        .map(order => {
          const closestWarehouse = findClosestWarehouse(order.shippingInfo.coords!);
          return {
            orderId: order.id,
            from: closestWarehouse?.coords,
            to: order.shippingInfo.coords!,
          };
        })
        .filter(route => route.from);
  }, [orders, warehouses]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ email, password, name: isLogin ? undefined : name });
  };

  return (
    <div className="min-h-screen bg-freshpodd-blue flex flex-col items-center justify-center p-4">
      <div className="container mx-auto max-w-6xl">
        {canGoBack && (
            <button onClick={onGoBack} className="absolute top-6 left-6 flex items-center space-x-2 text-freshpodd-teal hover:text-teal-400 font-semibold z-20">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Back</span>
            </button>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-xl overflow-hidden shadow-2xl bg-freshpodd-gray/20">
          {/* Left Panel: Operations Overview */}
          <div className="p-8 text-white bg-freshpodd-gray/30 backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-6 text-center lg:text-left">Global Operations Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4 mb-6">
                <div className="bg-freshpodd-blue/30 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-400">Active Orders</p>
                    <p className="text-3xl font-bold">{orders.length}</p>
                </div>
                <div className="bg-freshpodd-blue/30 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-400">Revenue (Active)</p>
                    <p className="text-3xl font-bold">{totalRevenue}</p>
                </div>
                <div className="bg-freshpodd-blue/30 p-4 rounded-lg text-center col-span-2 md:col-span-1 lg:col-span-2">
                    <p className="text-sm text-gray-400">Destinations</p>
                    <p className="text-lg font-semibold truncate">{uniqueDestinations.join(', ')}</p>
                </div>
            </div>
            
            <div className="relative w-full aspect-[1000/618] bg-freshpodd-blue/20 rounded-lg overflow-hidden">
                <svg viewBox="0 0 1000 618" className="w-full h-full">
                    <path d={WORLD_MAP_PATH} fill="#374151" />
                    {warehouses.map(w => (
                         <MapPinIcon key={w.id} x={w.coords.x - 8} y={w.coords.y - 16} className="w-4 h-4 text-freshpodd-teal" />
                    ))}
                     {orders.map(order => order.shippingInfo.coords && (
                        <circle key={order.id} cx={order.shippingInfo.coords.x} cy={order.shippingInfo.coords.y} r="3" fill="#f0f9ff" />
                    ))}
                    {shipmentRoutes.map(route => (
                       <path 
                           key={route.orderId}
                           d={`M${route.from!.x},${route.from!.y} L${route.to.x},${route.to.y}`}
                           stroke="#14b8a6"
                           strokeWidth="1.5"
                           fill="none"
                           strokeDasharray="4"
                           className="animate-route"
                        />
                    ))}
                </svg>
            </div>
          </div>

          {/* Right Panel: Login Form */}
          <div className="p-8 sm:p-12 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-white mb-2">{isLogin ? 'Admin Login' : 'Create Admin Account'}</h2>
            <p className="text-gray-400 mb-8">{isLogin ? 'Access your dashboard.' : 'Join the team.'}</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-freshpodd-gray text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-freshpodd-teal" />
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-freshpodd-gray text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-freshpodd-teal" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-freshpodd-gray text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-freshpodd-teal" />
              </div>
              <button type="submit" className="w-full bg-freshpodd-teal hover:bg-teal-500 text-white font-bold py-3 rounded-lg text-lg transition-colors">
                {isLogin ? 'Sign In' : 'Sign Up'}
              </button>
            </form>
            <p className="text-center text-gray-400 mt-6">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button onClick={() => setIsLogin(!isLogin)} className="text-freshpodd-teal hover:text-teal-400 font-semibold ml-2">
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
       <style>{`
        @keyframes draw-route {
            to { stroke-dashoffset: 0; }
        }
        .animate-route {
            stroke-dashoffset: 1000;
            animation: draw-route 5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
