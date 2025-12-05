import React, { useState } from 'react';
import { type CartItem, type View, type Order } from '../types';
import { ArrowLeftIcon, UpiIcon, BankIcon, CashIcon } from './icons';

type CheckoutStep = 'cart' | 'confirm' | 'payment';
type PaymentMethod = Order['paymentMethod'];

interface CartPageProps {
  cartItems: CartItem[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onCheckout: (paymentMethod: PaymentMethod) => void;
  onNavigate: (view: View) => void;
  onGoBack: () => void;
  canGoBack: boolean;
  formatPrice: (price: number) => string;
}

const CartPage: React.FC<CartPageProps> = ({ cartItems, onRemoveItem, onUpdateQuantity, onCheckout, onNavigate, onGoBack, canGoBack, formatPrice }) => {
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('cart');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const isAnyItemOutOfStock = cartItems.some(item => item.product.stock < item.quantity);

  const handleCompletePurchase = () => {
    if (selectedPaymentMethod) {
      onCheckout(selectedPaymentMethod);
    }
  };

  const renderCartView = () => (
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="lg:w-2/3">
        <div className="space-y-6">
          {cartItems.map(({ product, quantity }) => (
            <div key={product.id} className="flex items-center bg-freshpodd-gray/20 p-4 rounded-lg shadow-md">
              <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover rounded-md mr-6" />
              <div className="flex-grow">
                <h2 className="text-lg font-bold text-white">{product.name}</h2>
                <p className="text-gray-400 text-sm">Unit Price: {formatPrice(product.price)}</p>
                 {product.stock < quantity && (
                    <p className="text-red-400 text-xs mt-1 font-bold">Not enough stock! Only {product.stock} available.</p>
                 )}
              </div>
              <div className="flex items-center space-x-4">
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => onUpdateQuantity(product.id, Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 bg-freshpodd-gray text-white text-center p-2 rounded-md border border-gray-600"
                  min="1"
                />
                <p className="text-lg font-semibold w-24 text-right">{formatPrice(product.price * quantity)}</p>
                <button onClick={() => onRemoveItem(product.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="lg:w-1/3">
        <div className="bg-freshpodd-gray/20 p-8 rounded-lg shadow-lg sticky top-24">
          <h2 className="text-2xl font-bold text-white border-b border-freshpodd-gray pb-4 mb-4">Order Summary</h2>
          <div className="space-y-4 text-gray-300">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span>Estimated Tax (8%)</span><span>{formatPrice(tax)}</span></div>
            <div className="flex justify-between text-white font-bold text-xl border-t border-freshpodd-gray pt-4 mt-4"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>
          <button 
            onClick={() => setCheckoutStep('confirm')}
            disabled={isAnyItemOutOfStock}
            className="w-full mt-8 bg-freshpodd-teal hover:bg-teal-500 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
          >
            Proceed to Checkout
          </button>
          {isAnyItemOutOfStock && <p className="text-red-400 text-sm mt-4 text-center">Please adjust quantities for out-of-stock items to proceed.</p>}
        </div>
      </div>
    </div>
  );

  const renderConfirmationView = () => (
     <div className="max-w-4xl mx-auto">
        <div className="bg-freshpodd-gray/20 p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-freshpodd-gray pb-4">Confirm Your Order</h2>
            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-semibold text-freshpodd-teal mb-3">Shipping To:</h3>
                    <div className="bg-freshpodd-blue/50 p-4 rounded-md text-gray-300">
                        <p className="font-bold">Test User</p>
                        <p>789 User Street</p>
                        <p>Anytown, 12345, USA</p>
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-freshpodd-teal mb-3">Items:</h3>
                    <div className="space-y-4">
                        {cartItems.map(({ product, quantity }) => (
                            <div key={product.id} className="flex justify-between items-center bg-freshpodd-blue/50 p-3 rounded-md">
                                <p className="text-white">{product.name} <span className="text-gray-400">x {quantity}</span></p>
                                <p className="font-semibold text-white">{formatPrice(product.price * quantity)}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="border-t border-freshpodd-gray pt-6 mt-6">
                    <div className="flex justify-between text-white font-bold text-2xl">
                        <span>Order Total</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-8">
                    <button onClick={() => setCheckoutStep('cart')} className="text-freshpodd-teal hover:text-teal-400 font-semibold">
                        &larr; Back to Cart
                    </button>
                    <button onClick={() => setCheckoutStep('payment')} className="bg-freshpodd-teal hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105">
                        Confirm & Proceed to Payment
                    </button>
                </div>
            </div>
        </div>
     </div>
  );

  const renderPaymentView = () => {
      const paymentOptions = [
          { name: 'UPI', icon: <UpiIcon className="w-8 h-8"/> },
          { name: 'Online Banking', icon: <BankIcon className="w-8 h-8"/> },
          { name: 'Cash on Delivery', icon: <CashIcon className="w-8 h-8"/> }
      ];

      return (
         <div className="max-w-2xl mx-auto">
            <div className="bg-freshpodd-gray/20 p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-white mb-6 border-b border-freshpodd-gray pb-4">Choose Payment Method</h2>
                <div className="space-y-4 mb-8">
                    {paymentOptions.map(opt => (
                        <button 
                            key={opt.name}
                            onClick={() => setSelectedPaymentMethod(opt.name as PaymentMethod)}
                            className={`w-full flex items-center p-4 rounded-lg text-left transition-all duration-200 border-2 ${selectedPaymentMethod === opt.name ? 'bg-freshpodd-teal/20 border-freshpodd-teal' : 'bg-freshpodd-blue/50 border-transparent hover:border-freshpodd-gray'}`}
                        >
                            <div className="text-freshpodd-teal mr-4">{opt.icon}</div>
                            <span className="text-lg font-semibold text-white">{opt.name}</span>
                        </button>
                    ))}
                </div>
                <div className="flex justify-between items-center mt-8">
                    <button onClick={() => setCheckoutStep('confirm')} className="text-freshpodd-teal hover:text-teal-400 font-semibold">
                        &larr; Back to Confirmation
                    </button>
                    <button 
                        onClick={handleCompletePurchase}
                        disabled={!selectedPaymentMethod}
                        className="bg-freshpodd-teal hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        Complete Purchase ({formatPrice(total)})
                    </button>
                </div>
            </div>
        </div>
      );
  }

  const renderContent = () => {
    switch (checkoutStep) {
        case 'cart': return renderCartView();
        case 'confirm': return renderConfirmationView();
        case 'payment': return renderPaymentView();
        default: return renderCartView();
    }
  }

  return (
    <div className="min-h-screen bg-freshpodd-blue text-freshpodd-light py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {canGoBack && (
            <button onClick={onGoBack} className="flex items-center space-x-2 text-freshpodd-teal hover:text-teal-400 mb-8 font-semibold">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Back</span>
            </button>
        )}
        <h1 className="text-4xl font-extrabold text-white mb-8">
            {checkoutStep === 'cart' && 'Your Cart'}
            {checkoutStep === 'confirm' && 'Checkout'}
            {checkoutStep === 'payment' && 'Checkout'}
        </h1>
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
          renderContent()
        )}
      </div>
    </div>
  );
};

export default CartPage;