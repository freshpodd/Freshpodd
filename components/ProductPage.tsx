import React, { useState, useMemo, useEffect } from 'react';
import { type Product, type CartItem, type User, type Currency } from '../types';
import { StarIcon, XMarkIcon, PlusIcon, MinusIcon, ArrowLeftIcon, HeartIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';
import StockNotificationModal from './StockNotificationModal';

interface ProductPageProps {
  products: (Product & { stock: number })[]; // Products now have total stock calculated
  onAddToCart: (item: CartItem) => void;
  onBuyNow: (item: CartItem) => void;
  onGoBack: () => void;
  canGoBack: boolean;
  wishlist: Product[];
  onToggleWishlist: (productId: string) => void;
  currentUser: User | null;
  formatPrice: (price: number) => string;
  conversionRate: number;
  onStockNotificationSignup: (productId: string, email: string) => void;
}

const ITEMS_PER_PAGE = 9;

const ProductDetailModal: React.FC<{ 
    product: (Product & { stock: number });
    onAddToCart: (item: CartItem) => void; 
    onBuyNow: (item: CartItem) => void;
    onClose: () => void; 
    isWishlisted: boolean;
    onToggleWishlist: (productId: string) => void;
    currentUser: User | null;
    formatPrice: (price: number) => string;
    onStockNotificationSignup: (productId: string, email: string) => void;
}> = ({ product, onAddToCart, onBuyNow, onClose, isWishlisted, onToggleWishlist, currentUser, formatPrice, onStockNotificationSignup }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'features' | 'specs'>('description');
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);

  const handleAddToCart = () => {
    onAddToCart({ product, quantity });
    onClose();
  };
  
  const handleBuyNow = () => {
    onBuyNow({ product, quantity });
    onClose();
  };
  
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose} aria-modal="true" role="dialog">
      <div className="bg-freshpodd-gray/50 backdrop-blur-sm border border-freshpodd-teal/30 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={handleModalContentClick}>
        <header className="flex justify-between items-center p-4 border-b border-freshpodd-gray">
          <h2 className="text-xl font-bold text-white">{product.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><XMarkIcon /></button>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-lg" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} solid={i < Math.round(product.averageRating)} className="text-yellow-400 h-5 w-5"/>
                  ))}
                </div>
                <span className="ml-2 text-gray-300 text-sm">{product.averageRating.toFixed(1)} ({product.reviewsCount} reviews)</span>
              </div>
              <p className="text-3xl font-bold text-white mb-6">{formatPrice(product.price)}</p>
              
              <div className="border-b border-freshpodd-gray mb-4">
                  <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                      <button onClick={() => setActiveTab('description')} className={`${activeTab === 'description' ? 'border-freshpodd-teal text-freshpodd-teal' : 'border-transparent text-gray-400 hover:text-white'} whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm`}>Description</button>
                      <button onClick={() => setActiveTab('features')} className={`${activeTab === 'features' ? 'border-freshpodd-teal text-freshpodd-teal' : 'border-transparent text-gray-400 hover:text-white'} whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm`}>Features</button>
                      <button onClick={() => setActiveTab('specs')} className={`${activeTab === 'specs' ? 'border-freshpodd-teal text-freshpodd-teal' : 'border-transparent text-gray-400 hover:text-white'} whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm`}>Specs</button>
                  </nav>
              </div>
              <div className="text-gray-300 text-sm min-h-[100px] flex-grow">
                  {activeTab === 'description' && <p>{product.description}</p>}
                  {activeTab === 'features' && <ul className="list-disc list-inside space-y-1">{product.features.map(f => <li key={f}>{f}</li>)}</ul>}
                  {activeTab === 'specs' && <div className="space-y-1">{Object.entries(product.specs).map(([key, value]) => (<p key={key}><strong>{key}:</strong> {value}</p>))}</div>}
              </div>

               {product.stock > 0 && (
                <div className="flex items-center space-x-4 my-6">
                    <label htmlFor="quantity" className="font-semibold text-white">Quantity:</label>
                    <div className="flex items-center border border-gray-600 rounded-md">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 text-gray-300 hover:bg-freshpodd-gray"><MinusIcon className="w-4 h-4" /></button>
                        <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-12 bg-transparent text-center text-white focus:outline-none" />
                        <button onClick={() => setQuantity(q => q + 1)} className="p-2 text-gray-300 hover:bg-freshpodd-gray"><PlusIcon className="w-4 h-4"/></button>
                    </div>
                </div>
               )}
            </div>
          </div>
        </main>
        <footer className="flex justify-between items-center p-4 border-t border-freshpodd-gray bg-freshpodd-gray/30">
          <button
              onClick={() => onToggleWishlist(product.id)}
              className="flex items-center space-x-2 text-gray-300 hover:text-freshpodd-teal"
          >
              <HeartIcon solid={isWishlisted} className={`w-6 h-6 ${isWishlisted ? 'text-freshpodd-teal' : ''}`} />
              <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
          </button>
           <div className="flex space-x-4">
              {product.stock > 0 ? (
                <>
                  <button onClick={handleAddToCart} className="bg-freshpodd-teal/20 text-freshpodd-teal font-bold py-3 px-6 rounded-md hover:bg-freshpodd-teal hover:text-white transition-colors">
                      Add to Cart
                  </button>
                  <button onClick={handleBuyNow} className="bg-freshpodd-teal text-white font-bold py-3 px-6 rounded-md hover:bg-teal-500 transition-colors">
                      Buy Now
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsNotifyModalOpen(true)}
                  className="bg-yellow-500 text-white font-bold py-3 px-6 rounded-md hover:bg-yellow-600 transition-colors"
                >
                  Notify Me When Available
                </button>
              )}
          </div>
        </footer>
      </div>
    </div>
    {isNotifyModalOpen && (
        <StockNotificationModal
            productName={product.name}
            currentUser={currentUser}
            onClose={() => setIsNotifyModalOpen(false)}
            onSignup={(email) => {
                onStockNotificationSignup(product.id, email);
                setIsNotifyModalOpen(false);
            }}
        />
    )}
    </>
  );
};

const ProductCard: React.FC<{ 
    product: (Product & { stock: number });
    onClick: () => void; 
    isWishlisted: boolean;
    onToggleWishlist: (productId: string) => void;
    formatPrice: (price: number) => string;
}> = ({ product, onClick, isWishlisted, onToggleWishlist, formatPrice }) => {
    const handleWishlistClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleWishlist(product.id);
    };

    return (
    <div onClick={onClick} className="bg-freshpodd-gray/20 rounded-lg shadow-lg overflow-hidden flex flex-col group cursor-pointer transform hover:scale-105 hover:shadow-freshpodd-teal/20 transition-all duration-300">
        <div className="relative">
            <img src={product.imageUrl} alt={product.name} className="w-full h-56 object-cover" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>
            <button onClick={handleWishlistClick} className="absolute top-4 right-4 bg-black/40 p-2 rounded-full text-white hover:text-freshpodd-teal transition-colors">
                <HeartIcon solid={isWishlisted} className={`w-6 h-6 ${isWishlisted ? 'text-freshpodd-teal' : ''}`} />
            </button>
             {product.stock === 0 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                    Out of Stock
                </div>
            )}
        </div>
        <div className="p-6 flex-grow flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
            <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} solid={i < Math.round(product.averageRating)} className="text-yellow-400 h-4 w-4"/>
                ))}
                <span className="ml-2 text-gray-400 text-xs">{product.averageRating.toFixed(1)} ({product.reviewsCount})</span>
            </div>
            <div className="flex justify-between items-center mt-auto">
                <span className="text-2xl font-bold text-white">{formatPrice(product.price)}</span>
            </div>
        </div>
    </div>
  )};

const ProductPage: React.FC<ProductPageProps> = (props) => {
  const { products, onAddToCart, onBuyNow, onGoBack, canGoBack, wishlist, onToggleWishlist, currentUser, formatPrice, conversionRate, onStockNotificationSignup } = props;
  const [selectedProduct, setSelectedProduct] = useState<(Product & { stock: number }) | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState(3000 * conversionRate);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Reset price range when currency changes
    setPriceRange(3000 * conversionRate);
  }, [conversionRate]);
  
  const filteredProducts = useMemo(() => {
    return products
        .filter(p => p.price * conversionRate <= priceRange)
        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [products, priceRange, searchTerm, conversionRate]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-freshpodd-blue text-freshpodd-light py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {canGoBack && (
            <button onClick={onGoBack} className="flex items-center space-x-2 text-freshpodd-teal hover:text-teal-400 mb-8 font-semibold">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Back</span>
            </button>
        )}
        <h1 className="text-4xl font-extrabold text-white mb-8">Our Products</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
            {/* Filters */}
            <aside className="w-full md:w-1/4">
                <div className="bg-freshpodd-gray/20 p-6 rounded-lg sticky top-24">
                    <h3 className="text-xl font-bold text-white mb-4">Filters</h3>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">Search</label>
                            <input type="text" id="search" placeholder="Search by name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-freshpodd-gray text-white p-2 rounded-md border border-gray-600" />
                        </div>
                        <div>
                             <label htmlFor="price-range" className="block text-sm font-medium text-gray-300 mb-2">Price Range</label>
                            <input type="range" id="price-range" min={500 * conversionRate} max={3000 * conversionRate} value={priceRange} onChange={e => setPriceRange(Number(e.target.value))} className="w-full h-2 bg-freshpodd-gray rounded-lg appearance-none cursor-pointer" />
                            <div className="text-center text-white mt-2 font-bold">Up to {formatPrice(priceRange / conversionRate)}</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Product Grid */}
            <main className="w-full md:w-3/4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {paginatedProducts.map(product => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            onClick={() => setSelectedProduct(product)} 
                            isWishlisted={wishlist.some(p => p.id === product.id)}
                            onToggleWishlist={onToggleWishlist}
                            formatPrice={formatPrice}
                        />
                    ))}
                </div>
                 {/* Pagination */}
                 {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-12 space-x-4">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-md bg-freshpodd-gray/50 hover:bg-freshpodd-gray disabled:opacity-50"
                        >
                            <ChevronLeftIcon className="w-6 h-6 text-white"/>
                        </button>
                        <span className="text-white font-semibold">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-md bg-freshpodd-gray/50 hover:bg-freshpodd-gray disabled:opacity-50"
                        >
                            <ChevronRightIcon className="w-6 h-6 text-white"/>
                        </button>
                    </div>
                )}
            </main>
        </div>
      </div>
      {selectedProduct && (
        <ProductDetailModal 
            product={selectedProduct} 
            onAddToCart={onAddToCart} 
            onBuyNow={onBuyNow}
            onClose={() => setSelectedProduct(null)} 
            isWishlisted={wishlist.some(p => p.id === selectedProduct.id)}
            onToggleWishlist={onToggleWishlist}
            currentUser={currentUser}
            formatPrice={formatPrice}
            onStockNotificationSignup={onStockNotificationSignup}
        />
      )}
    </div>
  );
};

export default ProductPage;
