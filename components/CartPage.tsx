import React from 'react';
import { type CartItem, type View } from '../types';
import { ArrowLeftIcon } from './icons';

interface CartPageProps {
  cartItems: CartItem[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onCheckout: () => void;
  onNavigate: (view: View) => void;
  onGoBack: () => void;
  canGoBack: boolean;
}

const CartPage: React.FC<CartPageProps> = ({ cartItems, onRemoveItem, onUpdateQuantity, onCheckout, onNavigate, onGoBack, canGoBack }) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-freshpodd-blue text-freshpodd-light py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {canGoBack && (
            <button onClick={onGoBack} className="flex items-center space-x-2 text-freshpodd-teal hover:text-teal-400 mb-8 font-semibold">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Back</span>
            </button>
        )}
        <h1 className="text-4xl font-extrabold text-white mb-8">Your Cart</h1>
        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-freshpodd-gray/20 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Your Shopping Cart is Empty</h2>
            <p className="text-lg text-gray-300 mb-8">Looks like you haven't added anything yet. Let's find the perfect FreshPodd for you!</p>
            <button
                onClick={() => onNavigate('product')}
                className="bg-freshpodd-teal hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 duration-300"
            >
                Start Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3">
              <div className="space-y-6">
                {cartItems.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center bg-freshpodd-gray/20 p-4 rounded-lg shadow-md">
                    <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover rounded-md mr-6" />
                    <div className="flex-grow">
                      <h2 className="text-lg font-bold text-white">{product.name}</h2>
                      <p className="text-gray-400 text-sm">Unit Price: ${product.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <input 
                        type="number" 
                        value={quantity}
                        onChange={(e) => onUpdateQuantity(product.id, Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 bg-freshpodd-gray text-white text-center p-2 rounded-md border border-gray-600"
                        min="1"
                      />
                      <p className="text-lg font-semibold w-24 text-right">${(product.price * quantity).toFixed(2)}</p>
                      <button onClick={() => onRemoveItem(product.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/3">
              <div className="bg-freshpodd-gray/20 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-white border-b border-freshpodd-gray pb-4 mb-4">Order Summary</h2>
                <div className="space-y-4 text-gray-300">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-xl border-t border-freshpodd-gray pt-4 mt-4">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <button onClick={onCheckout} className="w-full mt-8 bg-freshpodd-teal hover:bg-teal-500 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 duration-300">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;