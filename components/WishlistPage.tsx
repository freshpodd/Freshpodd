import React from 'react';
import { type Product, type CartItem, type View } from '../types';
import { ArrowLeftIcon, HeartIcon, ShoppingCartIcon } from './icons';

interface WishlistPageProps {
  wishlistItems: (Product & { stock: number })[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (item: CartItem) => void;
  onNavigate: (view: View) => void;
  onGoBack: () => void;
  canGoBack: boolean;
  formatPrice: (price: number) => string;
}

const WishlistPage: React.FC<WishlistPageProps> = ({ wishlistItems, onToggleWishlist, onAddToCart, onNavigate, onGoBack, canGoBack, formatPrice }) => {

  const handleAddToCart = (product: Product & { stock: number }) => {
    onAddToCart({ product, quantity: 1 });
    onToggleWishlist(product.id); // Also remove from wishlist
  };

  return (
    <div className="min-h-screen bg-freshpodd-blue text-freshpodd-light py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {canGoBack && (
            <button onClick={onGoBack} className="flex items-center space-x-2 text-freshpodd-teal hover:text-teal-400 mb-8 font-semibold">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Back</span>
            </button>
        )}
        <h1 className="text-4xl font-extrabold text-white mb-8">Your Wishlist</h1>
        {wishlistItems.length === 0 ? (
          <div className="text-center py-20 bg-freshpodd-gray/20 rounded-lg">
            <HeartIcon className="w-16 h-16 text-freshpodd-teal mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Your Wishlist is Empty</h2>
            <p className="text-lg text-gray-300 mb-8">Add your favorite items here to save them for later.</p>
            <button
                onClick={() => onNavigate('product')}
                className="bg-freshpodd-teal hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 duration-300"
            >
                Discover Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistItems.map((product) => (
              <div key={product.id} className="bg-freshpodd-gray/20 rounded-lg shadow-lg overflow-hidden flex flex-col group">
                <div className="relative">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-56 object-cover" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 flex-grow">{product.description.substring(0, 100)}...</p>
                    <div className="flex justify-between items-center mt-auto">
                        <span className="text-2xl font-bold text-white">{formatPrice(product.price)}</span>
                    </div>
                </div>
                <div className="p-4 bg-freshpodd-gray/30 border-t border-freshpodd-gray/50 grid grid-cols-2 gap-2">
                    <button 
                        onClick={() => onToggleWishlist(product.id)}
                        className="flex items-center justify-center space-x-2 bg-red-600/20 text-red-400 hover:bg-red-600/40 hover:text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors"
                    >
                        <HeartIcon solid className="w-5 h-5" />
                        <span>Remove</span>
                    </button>
                    {product.stock > 0 ? (
                        <button 
                            onClick={() => handleAddToCart(product)}
                            className="flex items-center justify-center space-x-2 bg-freshpodd-teal/20 text-freshpodd-teal hover:bg-freshpodd-teal hover:text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors"
                        >
                             <ShoppingCartIcon className="w-5 h-5" />
                            <span>Add to Cart</span>
                        </button>
                    ) : (
                        <div className="flex items-center justify-center bg-freshpodd-gray text-red-400 font-semibold py-2 px-4 rounded-md text-sm cursor-not-allowed">
                            Out of Stock
                        </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
