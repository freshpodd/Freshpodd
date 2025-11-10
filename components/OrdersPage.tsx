import React, { useState } from 'react';
import { type Order, type CartItem, type View } from '../types';

interface OrdersPageProps {
  orders: Order[];
  onBuyAgain: (item: CartItem) => void;
  onNavigate: (view: View) => void;
}

const OrdersPage: React.FC<OrdersPageProps> = ({ orders, onBuyAgain, onNavigate }) => {
  const [trackingId, setTrackingId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [trackingError, setTrackingError] = useState('');

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const foundOrder = orders.find(order => order.id === trackingId);
    if (foundOrder) {
      setTrackedOrder(foundOrder);
      setTrackingError('');
    } else {
      setTrackedOrder(null);
      setTrackingError('Order not found. Please check the ID and try again.');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Delivered': return 'text-green-400';
      case 'Shipped': return 'text-blue-400';
      case 'Processing': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-freshpodd-blue text-freshpodd-light py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-white mb-8">Your Orders</h1>

        {/* Order Tracking */}
        <div className="bg-freshpodd-gray/20 p-8 rounded-lg shadow-lg mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Track Your Order</h2>
          <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              value={trackingId}
              onChange={e => setTrackingId(e.target.value)}
              placeholder="Enter your Order ID" 
              className="flex-grow bg-freshpodd-gray text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-freshpodd-teal"
            />
            <button type="submit" className="bg-freshpodd-teal hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-md transition-colors">Track</button>
          </form>
          {trackingError && <p className="text-red-400 mt-4">{trackingError}</p>}
          {trackedOrder && (
            <div className="mt-6 border-t border-freshpodd-gray pt-6">
              <h3 className="text-xl font-semibold">Tracking result for Order #{trackedOrder.id}</h3>
              <p className="mt-2">Date: {trackedOrder.date}</p>
              <p className="mt-2">Status: <span className={`font-bold ${getStatusColor(trackedOrder.status)}`}>{trackedOrder.status}</span></p>
              <p className="mt-2">Total: ${trackedOrder.total.toFixed(2)}</p>
            </div>
          )}
        </div>
        
        {/* Past Orders */}
        <h2 className="text-3xl font-bold text-white mb-6">Order History</h2>
        <div className="space-y-8">
          {orders.length > 0 ? orders.map(order => (
            <div key={order.id} className="bg-freshpodd-gray/20 p-6 rounded-lg shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-freshpodd-gray pb-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Order #{order.id}</h3>
                  <p className="text-sm text-gray-400">Placed on {order.date}</p>
                </div>
                <div className="text-left sm:text-right mt-2 sm:mt-0">
                  <p className="text-gray-300">Total: <span className="font-bold text-white">${order.total.toFixed(2)}</span></p>
                  <p>Status: <span className={`font-bold ${getStatusColor(order.status)}`}>{order.status}</span></p>
                </div>
              </div>
              <div className="space-y-4">
                {order.items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="flex items-center">
                      <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                      <div>
                        <p className="font-semibold text-white">{product.name}</p>
                        <p className="text-sm text-gray-400">Qty: {quantity}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onBuyAgain({ product, quantity: 1 })}
                      className="mt-2 sm:mt-0 bg-freshpodd-teal/20 text-freshpodd-teal hover:bg-freshpodd-teal hover:text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors"
                    >
                      Buy Again
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )) : (
            <div className="text-center py-20 bg-freshpodd-gray/20 rounded-lg">
                <p className="text-xl text-gray-300 mb-6">You have no past orders yet. Start shopping!</p>
                <button 
                    onClick={() => onNavigate('product')}
                    className="bg-freshpodd-teal hover:bg-teal-500 text-white font-bold py-3 px-6 rounded-md transition-transform transform hover:scale-105"
                >
                    Browse Products
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;