import React, { useState, useMemo, useEffect } from 'react';
import { type Product, type CartItem, type User } from '../types';
import { StarIcon, XMarkIcon, PlusIcon, MinusIcon, ArrowLeftIcon, HeartIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';

interface ProductPageProps {
  products: Product[];
  onAddToCart: (item: CartItem) => void;
  onBuyNow: (item: CartItem) => void;
  onGoBack: () => void;
  canGoBack: boolean;
  wishlist: Product[];
  onToggleWishlist: (productId: string) => void;
  currentUser: User | null;
}

const ITEMS_PER_PAGE = 9;

const ProductDetailModal: React.FC<{ 
    product: Product; 
    onAddToCart: (item: CartItem) => void; 
    onClose: () => void; 
    isWishlisted: boolean;
    onToggleWishlist: (productId: string) => void;
    currentUser: User | null;
}> = ({ product, onAddToCart, onClose, isWishlisted, onToggleWishlist, currentUser }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'features' | 'specs'>('description');

  const handleAddToCart = () => {
    onAddToCart({ product, quantity });
    onClose();
  };
  
  // Prevent modal from closing when clicking inside
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
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
              <p className="text-3xl font-bold text-white mb-6">${product.price.toFixed(2)}</p>
              
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
                  {activeTab === 'specs' && <div className="space-y-1">{Object.entries(product.specs).map(([key, value]) => <p key={key}><strong>{key}:</strong> {value}</p>)}</div>}
              </div>

              <div className="mt-auto pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <p className="font-semibold text-white">Quantity:</p>
                  <div className="flex items-center border border-gray-600 rounded-md bg-freshpodd-gray">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 text-gray-300 hover:bg-freshpodd-gray/50 rounded-l-md"><MinusIcon className="w-5 h-5"/></button>
                    <input type="text" value={quantity} readOnly className="w-12 text-center text-white bg-transparent border-x border-gray-600 focus:outline-none"/>
                    <button onClick={() => setQuantity(q => q + 1)} className="p-2 text-gray-300 hover:bg-freshpodd-gray/50 rounded-r-md"><PlusIcon className="w-5 h-5"/></button>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={handleAddToCart} className="w-full bg-freshpodd-teal hover:bg-teal-500 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 duration-300">
                      Add to Cart
                    </button>
                    {currentUser && (
                        <button onClick={() => onToggleWishlist(product.id)} className="p-3 border-2 border-freshpodd-teal rounded-lg hover:bg-freshpodd-teal/20 transition-colors">
                            <HeartIcon solid={isWishlisted} className={`w-6 h-6 ${isWishlisted ? 'text-freshpodd-teal' : 'text-gray-300'}`} />
                        </button>
                    )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};


const ProductCard: React.FC<{ 
    product: Product; 
    onSelect: (product: Product) => void;
    isWishlisted: boolean;
    onToggleWishlist: (productId: string) => void;
    currentUser: User | null;
}> = ({ product, onSelect, isWishlisted, onToggleWishlist, currentUser }) => {
    
    const handleWishlistClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleWishlist(product.id);
    };

    return (
        <div className="bg-freshpodd-gray/20 rounded-lg shadow-lg overflow-hidden flex flex-col group text-left w-full h-full relative">
            <button onClick={() => onSelect(product)} className="w-full h-full flex flex-col focus:outline-none focus:ring-2 focus:ring-freshpodd-teal rounded-lg">
                <div className="relative">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-56 object-cover" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>
                     <div className="absolute top-0 left-0 bg-freshpodd-blue/70 text-white text-xs font-bold px-3 py-1 m-2 rounded-full">View Details</div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                    <div className="flex items-center mb-4">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon key={i} solid={i < Math.round(product.averageRating)} className="text-yellow-400 h-5 w-5"/>
                            ))}
                        </div>
                        <span className="ml-2 text-gray-300 text-sm">{product.averageRating.toFixed(1)} ({product.reviewsCount} reviews)</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4 flex-grow">{product.description.substring(0, 100)}...</p>
                    <div className="flex justify-between items-center mt-auto">
                        <span className="text-2xl font-bold text-white">${product.price.toFixed(2)}</span>
                    </div>
                </div>
            </button>
            {currentUser && (
                <button 
                    onClick={handleWishlistClick} 
                    className="absolute top-2 right-2 p-2 bg-freshpodd-gray/50 rounded-full hover:bg-freshpodd-gray/80 transition-colors z-10"
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <HeartIcon solid={isWishlisted} className={`w-6 h-6 ${isWishlisted ? 'text-freshpodd-teal' : 'text-gray-300'}`}/>
                </button>
            )}
        </div>
    );
};

const ProductPage: React.FC<ProductPageProps> = ({ products, onAddToCart, onBuyNow, onGoBack, canGoBack, wishlist, onToggleWishlist, currentUser }) => {
    const [sortOrder, setSortOrder] = useState('rating-desc');
    const [priceLimit, setPriceLimit] = useState(2000);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [selectedCapacity, setSelectedCapacity] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [currentPage, setCurrentPage] = useState(1);


    const maxPrice = useMemo(() => Math.ceil(Math.max(...products.map(p => p.price)) / 100) * 100, [products]);
    
    if (priceLimit > maxPrice) {
        setPriceLimit(maxPrice);
    }

    const allFeatures = useMemo(() => {
        const featuresSet = new Set<string>();
        products.forEach(p => p.features.forEach(f => featuresSet.add(f)));
        return Array.from(featuresSet).sort();
    }, [products]);

    const allCapacities = useMemo(() => {
        const capacitySet = new Set<string>();
        products.forEach(p => capacitySet.add(p.specs['Capacity']));
        return Array.from(capacitySet).sort((a,b) => parseInt(a) - parseInt(b));
    }, [products]);

    const handleFeatureChange = (feature: string) => {
        setSelectedFeatures(prev =>
            prev.includes(feature)
            ? prev.filter(f => f !== feature)
            : [...prev, feature]
        );
    };
    
    const resetFilters = () => {
        setPriceLimit(maxPrice);
        setSelectedFeatures([]);
        setSelectedCapacity('all');
    };

    const filteredAndSortedProducts = useMemo(() => {
        let result = [...products];

        result = result.filter(p => p.price <= priceLimit);

        if (selectedCapacity !== 'all') {
            result = result.filter(p => p.specs['Capacity'] === selectedCapacity);
        }

        if (selectedFeatures.length > 0) {
            result = result.filter(p =>
                selectedFeatures.every(feature => p.features.includes(feature))
            );
        }

        result.sort((a, b) => {
            switch (sortOrder) {
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'rating-desc': return b.averageRating - a.averageRating;
                default: return 0;
            }
        });

        return result;
    }, [products, sortOrder, priceLimit, selectedFeatures, selectedCapacity]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filteredAndSortedProducts]);


    const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAndSortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredAndSortedProducts, currentPage]);


    return (
        <div className="bg-freshpodd-blue text-freshpodd-light py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {canGoBack && (
                    <button onClick={onGoBack} className="flex items-center space-x-2 text-freshpodd-teal hover:text-teal-400 mb-8 font-semibold">
                        <ArrowLeftIcon className="w-5 h-5" />
                        <span>Back</span>
                    </button>
                )}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-white">Our Products</h1>
                    <p className="text-lg text-gray-300 mt-2">Find the perfect FreshPodd for your next adventure.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:w-1/4">
                        <div className="bg-freshpodd-gray/20 p-6 rounded-lg sticky top-24">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Filters</h2>
                                <button onClick={resetFilters} className="text-sm text-freshpodd-teal hover:text-teal-400">Reset</button>
                            </div>
                            
                            {/* Price Filter */}
                            <div className="mb-6">
                                <label htmlFor="price" className="block text-lg font-semibold text-white mb-2">Price</label>
                                <input type="range" id="price" min="0" max={maxPrice} value={priceLimit} onChange={e => setPriceLimit(Number(e.target.value))} className="w-full h-2 bg-freshpodd-gray rounded-lg appearance-none cursor-pointer" />
                                <div className="text-center text-gray-300 mt-2">Up to ${priceLimit}</div>
                            </div>
                            
                            {/* Capacity Filter */}
                            <div className="mb-6">
                                <label htmlFor="capacity" className="block text-lg font-semibold text-white mb-2">Capacity</label>
                                <select id="capacity" value={selectedCapacity} onChange={e => setSelectedCapacity(e.target.value)} className="w-full bg-freshpodd-gray text-white p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-freshpodd-teal">
                                    <option value="all">All Capacities</option>
                                    {allCapacities.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            
                            {/* Features Filter */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                    {allFeatures.map(feature => (
                                        <label key={feature} className="flex items-center text-gray-300 cursor-pointer">
                                            <input type="checkbox" checked={selectedFeatures.includes(feature)} onChange={() => handleFeatureChange(feature)} className="h-4 w-4 rounded bg-freshpodd-gray border-gray-600 text-freshpodd-teal focus:ring-freshpodd-teal" />
                                            <span className="ml-3">{feature}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <main className="lg:w-3/4">
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-gray-300">{filteredAndSortedProducts.length} Products</p>
                            <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="bg-freshpodd-gray text-white p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-freshpodd-teal">
                                <option value="rating-desc">Sort by: Rating</option>
                                <option value="price-asc">Sort by: Price (Low to High)</option>
                                <option value="price-desc">Sort by: Price (High to Low)</option>
                            </select>
                        </div>
                        {paginatedProducts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {paginatedProducts.map(product => (
                                        <ProductCard 
                                            key={product.id} 
                                            product={product} 
                                            onSelect={setSelectedProduct} 
                                            isWishlisted={wishlist.some(p => p.id === product.id)}
                                            onToggleWishlist={onToggleWishlist}
                                            currentUser={currentUser}
                                        />
                                    ))}
                                </div>
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center space-x-4 mt-12">
                                        <button
                                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                          disabled={currentPage === 1}
                                          className="flex items-center space-x-2 px-4 py-2 bg-freshpodd-gray/50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-freshpodd-gray transition-colors"
                                        >
                                          <ChevronLeftIcon className="w-5 h-5" />
                                          <span>Previous</span>
                                        </button>
                                        <span className="font-semibold text-white">
                                          Page {currentPage} of {totalPages}
                                        </span>
                                        <button
                                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                          disabled={currentPage === totalPages}
                                          className="flex items-center space-x-2 px-4 py-2 bg-freshpodd-gray/50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-freshpodd-gray transition-colors"
                                        >
                                          <span>Next</span>
                                          <ChevronRightIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20 bg-freshpodd-gray/20 rounded-lg">
                                <p className="text-xl text-gray-300">No products match your criteria.</p>
                                <button onClick={resetFilters} className="mt-4 bg-freshpodd-teal hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-md">Clear Filters</button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
            {selectedProduct && (
                <ProductDetailModal 
                    product={selectedProduct} 
                    onAddToCart={onAddToCart} 
                    onClose={() => setSelectedProduct(null)} 
                    isWishlisted={wishlist.some(p => p.id === selectedProduct.id)}
                    onToggleWishlist={onToggleWishlist}
                    currentUser={currentUser}
                />
            )}
        </div>
    );
};

export default ProductPage;
