import React, { useState, useMemo } from 'react';
import { type Product, type CartItem } from '../types';
import { StarIcon } from './icons';

interface ProductPageProps {
  products: Product[];
  onAddToCart: (item: CartItem) => void;
  onBuyNow: (item: CartItem) => void;
}

const ProductCard: React.FC<{ product: Product, onAddToCart: (item: CartItem) => void, onBuyNow: (item: CartItem) => void }> = ({ product, onAddToCart, onBuyNow }) => {
    return (
        <div className="bg-freshpodd-gray/20 rounded-lg shadow-lg overflow-hidden flex flex-col group">
            <div className="relative">
                <img src={product.imageUrl} alt={product.name} className="w-full h-56 object-cover" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>
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
                    <div className="flex items-center gap-2">
                        <button onClick={() => onAddToCart({ product, quantity: 1 })} className="bg-freshpodd-teal/20 border border-freshpodd-teal text-freshpodd-teal font-bold py-2 px-4 rounded-md hover:bg-freshpodd-teal hover:text-white transition-colors duration-300 text-sm">
                            Add to Cart
                        </button>
                        <button onClick={() => onBuyNow({ product, quantity: 1 })} className="bg-freshpodd-teal hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-md transition-transform transform hover:scale-105 duration-300 text-sm">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductPage: React.FC<ProductPageProps> = ({ products, onAddToCart, onBuyNow }) => {
    const [sortOrder, setSortOrder] = useState('rating-desc');
    const [priceLimit, setPriceLimit] = useState(2000);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [selectedCapacity, setSelectedCapacity] = useState('all');

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

    return (
        <div className="bg-freshpodd-blue text-freshpodd-light py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
                        {filteredAndSortedProducts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {filteredAndSortedProducts.map(product => (
                                    <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onBuyNow={onBuyNow} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-freshpodd-gray/20 rounded-lg">
                                <p className="text-xl text-gray-300">No products match your criteria.</p>
                                <button onClick={resetFilters} className="mt-4 bg-freshpodd-teal hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-md">Clear Filters</button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;