import React, { useState, useMemo } from 'react';
import { type User, type Order, type Product, type QuoteRequest, type Warehouse, type ChartDataPoint, type HrDepartment } from '../types';
import { XMarkIcon, ArrowLeftIcon, ChartBarIcon, TruckIcon, BriefcaseIcon, ChartPieIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, CalendarIcon, ArrowDownTrayIcon, ShoppingCartIcon, UserCircleIcon } from './icons';

interface AdminPageProps {
  users: User[];
  orders: Order[];
  products: Product[];
  quoteRequests: QuoteRequest[];
  onUpdateOrder: (orderId: string, updates: Partial<Pick<Order, 'status' | 'paymentStatus'>>) => void;
  onUpdateProduct: (updatedProduct: Product) => void;
  onDeleteUser: (userId: string) => void;
  onUpdateQuoteStatus: (quoteId: string, status: QuoteRequest['status']) => void;
  onGoBack: () => void;
  canGoBack: boolean;
  formatPrice: (price: number) => string;
  warehouses: Warehouse[];
  onUpdateWarehouseStock: (productId: string, warehouseId: string, newStock: number) => void;
  getTotalStock: (productId: string) => number;
  salesChartData: ChartDataPoint[];
  hrData: HrDepartment[];
  marketingChartData: ChartDataPoint[];
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; trend?: number; trendLabel?: string }> = ({ title, value, icon, trend, trendLabel }) => (
    <div className="bg-freshpodd-gray/20 p-5 rounded-lg flex flex-col justify-between shadow-lg border border-white/5 h-full transform hover:scale-105 transition-transform duration-200">
        <div className="flex justify-between items-start mb-4">
            <div className="bg-freshpodd-gray/40 p-3 rounded-lg text-freshpodd-teal">{icon}</div>
            {trend !== undefined && (
                <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {trend >= 0 ? <ArrowTrendingUpIcon className="w-3 h-3 mr-1" /> : <ArrowTrendingDownIcon className="w-3 h-3 mr-1" />}
                    <span>{Math.abs(trend)}%</span>
                </div>
            )}
        </div>
        <div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold text-white mt-1">{value}</p>
            {trendLabel && <p className="text-xs text-gray-500 mt-2">{trendLabel}</p>}
        </div>
    </div>
);

const BarChart: React.FC<{ data: ChartDataPoint[]; title: string; formatValue: (value: number) => string | number; color?: string }> = ({ data, title, formatValue, color = 'bg-freshpodd-teal' }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className="bg-freshpodd-gray/20 p-6 rounded-lg shadow-lg border border-white/5 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">{title}</h3>
            <div className="flex justify-between items-end flex-grow space-x-3 relative min-h-[200px]">
                {data.map((d, i) => (
                    <div key={d.label} className="flex-1 flex flex-col items-center justify-end relative group" onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
                         {hoveredIndex === i && (
                            <div className="absolute -top-10 bg-black/80 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap z-10 pointer-events-none">
                                {d.label}: {formatValue(d.value)}
                            </div>
                         )}
                        <div className={`w-full ${color} rounded-t-sm opacity-80 hover:opacity-100 transition-all duration-300`} style={{ height: `${(d.value / maxValue) * 100}%` }}></div>
                        <div className="text-xs text-gray-400 mt-2 truncate w-full text-center">{d.label}</div>
                    </div>
                ))}
                {/* Horizontal grid lines background */}
                <div className="absolute inset-0 z-[-1] flex flex-col justify-between pointer-events-none opacity-20">
                     {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
                        <div key={tick} className="border-t border-gray-500 w-full h-0"></div>
                     ))}
                </div>
            </div>
        </div>
    );
};

const AreaChart: React.FC<{ data: ChartDataPoint[]; title: string }> = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d.value / maxValue) * 100}`).join(' ');
    // Close the loop for area fill
    const areaPoints = `${points} 100,100 0,100`;

    return (
        <div className="bg-freshpodd-gray/20 p-6 rounded-lg shadow-lg border border-white/5">
            <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-semibold text-white">{title}</h3>
                 <div className="flex space-x-2">
                    <span className="w-3 h-3 bg-freshpodd-teal/50 rounded-full"></span>
                    <span className="text-xs text-gray-400">Trend</span>
                 </div>
            </div>
            <div className="h-64 relative w-full overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <polygon points={areaPoints} fill="url(#chartGradient)" />
                    <polyline fill="none" stroke="#14b8a6" strokeWidth="1.5" points={points} vectorEffect="non-scaling-stroke" />
                    {/* Data Points */}
                    {data.map((d, i) => (
                        <circle 
                            key={i} 
                            cx={(i / (data.length - 1)) * 100} 
                            cy={100 - (d.value / maxValue) * 100} 
                            r="1" 
                            fill="#fff" 
                            className="hover:r-2 transition-all cursor-pointer"
                        >
                            <title>{d.label}: {d.value}</title>
                        </circle>
                    ))}
                </svg>
                 {/* X Axis Labels */}
                 <div className="flex justify-between mt-2">
                    {data.map((d,i) => (
                        <span key={i} className="text-xs text-gray-500">{d.label}</span>
                    ))}
                 </div>
            </div>
        </div>
    );
};

const DonutChart: React.FC<{ data: { label: string; value: number; color: string }[]; title: string }> = ({ data, title }) => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let cumulative = 0;

    return (
         <div className="bg-freshpodd-gray/20 p-6 rounded-lg shadow-lg border border-white/5 h-full">
            <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>
            <div className="flex flex-col items-center justify-center h-full">
                 <div className="relative w-48 h-48 mb-6">
                    <svg viewBox="0 0 32 32" className="transform -rotate-90 w-full h-full">
                        {data.map(d => {
                            if (total === 0) return null;
                            const percentage = (d.value / total) * 100;
                            const dasharray = `${percentage} ${100 - percentage}`;
                            const dashoffset = -cumulative;
                            cumulative += percentage;
                            return (
                                <circle 
                                    key={d.label} 
                                    r="16" cx="16" cy="16" 
                                    fill="transparent" 
                                    stroke={d.color} 
                                    strokeWidth="8" 
                                    strokeDasharray={dasharray} 
                                    strokeDashoffset={dashoffset}
                                    className="hover:opacity-80 transition-opacity cursor-pointer"
                                >
                                    <title>{d.label}: {Math.round(percentage)}%</title>
                                </circle>
                            )
                        })}
                        {/* Center text */}
                        <text x="50%" y="50%" textAnchor="middle" dy="0.3em" className="text-[0.15rem] fill-white font-bold" transform="rotate(90 16 16)">
                            Total
                        </text>
                    </svg>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full">
                    {data.map(d => (
                         <div key={d.label} className="flex items-center text-xs">
                             <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: d.color }}></span>
                             <span className="text-gray-300 truncate flex-grow">{d.label}</span>
                             <span className="text-white font-bold">{d.value}</span>
                         </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const RecentActivityList: React.FC<{ orders: Order[], formatPrice: (p: number) => string }> = ({ orders, formatPrice }) => (
    <div className="bg-freshpodd-gray/20 rounded-lg shadow-lg border border-white/5 h-full overflow-hidden flex flex-col">
        <div className="p-6 border-b border-freshpodd-gray/50">
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        </div>
        <div className="overflow-y-auto flex-grow p-0">
            {orders.length === 0 ? (
                <p className="p-6 text-gray-500 text-center">No recent activity.</p>
            ) : (
                <ul className="divide-y divide-freshpodd-gray/30">
                    {orders.slice(0, 6).map(order => (
                        <li key={order.id} className="p-4 hover:bg-white/5 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-freshpodd-teal/20 p-2 rounded-full">
                                        <ShoppingCartIcon className="w-4 h-4 text-freshpodd-teal"/>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Order #{order.id}</p>
                                        <p className="text-xs text-gray-400">{order.user.name} placed a new order</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-white">{formatPrice(order.total)}</p>
                                    <p className="text-xs text-gray-500">{order.date}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
        <div className="p-4 border-t border-freshpodd-gray/50 text-center">
             <button className="text-freshpodd-teal text-sm font-semibold hover:text-white transition-colors">View All Activity</button>
        </div>
    </div>
);


const DashboardTab: React.FC<Pick<AdminPageProps, 'orders' | 'users' | 'quoteRequests' | 'warehouses' | 'formatPrice' | 'salesChartData' | 'hrData' | 'marketingChartData' | 'products'>> = (props) => {
    const { orders, users, quoteRequests, warehouses, formatPrice, salesChartData, hrData, marketingChartData, products } = props;
    
    // Derived Metrics
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = totalRevenue / (orders.length || 1);
    const totalStock = warehouses.reduce((sum: number, w) => sum + Object.values(w.stock).reduce((s: number, c: number) => s + c, 0), 0);
    const totalEmployees = hrData.reduce((sum: number, dept) => sum + dept.count, 0);
    
    // Product Sales Share Logic
    const salesByProduct = useMemo(() => {
        const counts: Record<string, number> = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                counts[item.product.name] = (counts[item.product.name] || 0) + item.quantity;
            });
        });
        const colors = ['#14b8a6', '#3b82f6', '#f97316', '#8b5cf6', '#ec4899'];
        return Object.entries(counts).map(([label, value], index) => ({
            label,
            value,
            color: colors[index % colors.length]
        })).sort((a, b) => b.value - a.value).slice(0, 5); // Top 5
    }, [orders]);

    const handleExport = () => {
        alert("Downloading CSV report...");
    };

    return (
        <div className="space-y-6 animate-fade-in">
             {/* Header Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-freshpodd-gray/20 p-4 rounded-lg border border-white/5">
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <CalendarIcon className="w-5 h-5" />
                    <span>Last 30 Days</span>
                    <span className="text-gray-600">|</span>
                    <span className="text-green-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Live Updates</span>
                </div>
                <div className="flex gap-3">
                     <button className="flex items-center space-x-2 bg-freshpodd-gray text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors text-sm">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Filter Date</span>
                     </button>
                     <button onClick={handleExport} className="flex items-center space-x-2 bg-freshpodd-teal text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors text-sm shadow-lg shadow-teal-500/20">
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        <span>Export Report</span>
                     </button>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={formatPrice(totalRevenue)} icon={<ChartBarIcon className="w-6 h-6" />} trend={12.5} trendLabel="vs. previous 30 days" />
                <StatCard title="Active Orders" value={orders.length} icon={<ShoppingCartIcon className="w-6 h-6" />} trend={5.2} trendLabel="Processing or Shipped" />
                <StatCard title="Avg. Order Value" value={formatPrice(avgOrderValue)} icon={<span className="text-xl font-bold">$</span>} trend={-2.1} trendLabel="vs. previous 30 days" />
                <StatCard title="Conversion Rate" value="3.2%" icon={<ArrowTrendingUpIcon className="w-6 h-6" />} trend={0.8} trendLabel="From 2.4% last month" />
            </div>

            {/* Main Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <AreaChart data={salesChartData} title="Revenue Trend Overview" />
                </div>
                <div>
                     <DonutChart data={salesByProduct} title="Top Selling Products" />
                </div>
            </div>

            {/* Operations & User Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <BarChart 
                        data={warehouses.map(w => ({ label: w.name.split(' ')[0], value: (Object.values(w.stock) as number[]).reduce((s, c) => s + c, 0) }))} 
                        title="Global Stock Levels" 
                        formatValue={v => v}
                        color="bg-blue-500"
                    />
                </div>
                <div className="lg:col-span-1">
                     <BarChart 
                         data={marketingChartData} 
                         title="Daily Active Users" 
                         formatValue={v => v.toLocaleString()}
                         color="bg-purple-500"
                    />
                </div>
                <div className="lg:col-span-1">
                    <RecentActivityList orders={orders} formatPrice={formatPrice} />
                </div>
            </div>
            
            {/* HR Section (Collapsible or smaller) */}
            <div className="bg-freshpodd-gray/20 p-6 rounded-lg border border-white/5">
                 <div className="flex items-center mb-4 space-x-2">
                    <BriefcaseIcon className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-semibold text-white">Internal Resources</h3>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {hrData.map(dept => (
                         <div key={dept.name} className="flex items-center space-x-3 bg-freshpodd-gray/30 p-3 rounded-lg">
                             <div className="w-3 h-3 rounded-full" style={{backgroundColor: dept.color}}></div>
                             <div>
                                 <p className="text-xs text-gray-400">{dept.name}</p>
                                 <p className="text-lg font-bold text-white">{dept.count}</p>
                             </div>
                         </div>
                     ))}
                 </div>
            </div>
        </div>
    );
};

const EditProductModal: React.FC<{
    product: Product;
    warehouses: Warehouse[];
    onClose: () => void;
    onSave: (updatedProduct: Product) => void;
    onUpdateStock: (productId: string, warehouseId: string, newStock: number) => void;
}> = ({ product: initialProduct, warehouses, onClose, onSave, onUpdateStock }) => {
    const [product, setProduct] = useState(initialProduct);
    const [stockLevels, setStockLevels] = useState(() => {
        const initialState: { [key: string]: number } = {};
        warehouses.forEach(w => {
            initialState[w.id] = w.stock[initialProduct.id] || 0;
        });
        return initialState;
    });

    const handleStockChange = (warehouseId: string, value: string) => {
        const newStock = Math.max(0, parseInt(value) || 0);
        setStockLevels(prev => ({...prev, [warehouseId]: newStock}));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(product);
        Object.entries(stockLevels).forEach(([warehouseId, newStock]) => {
            onUpdateStock(product.id, warehouseId, newStock);
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" aria-modal="true">
            <div className="bg-freshpodd-blue border border-freshpodd-teal/50 rounded-lg shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Edit Product: {product.name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XMarkIcon /></button>
                </div>
                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-4 border-b border-freshpodd-gray pb-2">Product Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="productName" className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
                                <input type="text" id="productName" value={product.name} onChange={e => setProduct({...product, name: e.target.value})} className="w-full bg-freshpodd-gray text-white p-2 rounded-md border border-gray-600" />
                            </div>
                            <div>
                                <label htmlFor="productPrice" className="block text-sm font-medium text-gray-300 mb-2">Price (USD)</label>
                                <input type="number" step="0.01" id="productPrice" value={product.price} onChange={e => setProduct({...product, price: Number(e.target.value)})} className="w-full bg-freshpodd-gray text-white p-2 rounded-md border border-gray-600" />
                            </div>
                            <div>
                                <label htmlFor="productDescription" className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea id="productDescription" rows={3} value={product.description} onChange={e => setProduct({...product, description: e.target.value})} className="w-full bg-freshpodd-gray text-white p-2 rounded-md border border-gray-600"></textarea>
                            </div>
                        </div>
                    </div>
                     <div>
                        <h3 className="text-xl font-semibold text-white mb-4 border-b border-freshpodd-gray pb-2">Warehouse Stock</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {warehouses.map(w => (
                                <div key={w.id}>
                                    <label htmlFor={`stock-${w.id}`} className="block text-sm font-medium text-gray-300 mb-2">{w.name}</label>
                                    <input type="number" id={`stock-${w.id}`} value={stockLevels[w.id]} onChange={e => handleStockChange(w.id, e.target.value)} className="w-full bg-freshpodd-gray text-white p-2 rounded-md border border-gray-600" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-freshpodd-gray/50 text-white font-bold py-2 px-4 rounded-md">Cancel</button>
                        <button type="submit" className="bg-freshpodd-teal hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-md">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const AdminPage: React.FC<AdminPageProps> = (props) => {
    const { users, orders, products, quoteRequests, onUpdateOrder, onUpdateProduct, onDeleteUser, onUpdateQuoteStatus, onGoBack, canGoBack, formatPrice, warehouses, onUpdateWarehouseStock, getTotalStock } = props;
    const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'quotes' | 'products' | 'users'>('dashboard');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleOpenEditModal = (product: Product) => {
        setEditingProduct({ ...product });
        setIsModalOpen(true);
    };

    const tabs = {
        dashboard: 'Dashboard',
        orders: 'Orders',
        quotes: 'Quotes',
        products: 'Products',
        users: 'Users',
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
                <div className="flex justify-between items-center mb-8">
                     <h1 className="text-4xl font-extrabold text-white">Admin Portal</h1>
                     <div className="flex items-center space-x-2 text-gray-400 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>System Online</span>
                     </div>
                </div>

                <div className="bg-freshpodd-gray/10 p-2 sm:p-6 rounded-lg shadow-2xl backdrop-blur-sm border border-white/5">
                    <div className="border-b border-freshpodd-gray/50 mb-6">
                        <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto" aria-label="Tabs">
                             {Object.entries(tabs).map(([key, value]) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key as any)}
                                    className={`${
                                        activeTab === key
                                        ? 'border-freshpodd-teal text-freshpodd-teal'
                                        : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                                    } whitespace-nowrap py-4 px-1 sm:px-2 border-b-2 font-medium text-sm sm:text-base transition-colors duration-200`}
                                >
                                    {value}
                                </button>
                            ))}
                        </nav>
                    </div>
                    
                    <div className="mt-8 min-h-[500px]">
                        {activeTab === 'dashboard' && <DashboardTab {...props} />}
                        {activeTab === 'orders' && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-freshpodd-gray/50">
                                    <thead className="bg-freshpodd-gray/30">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Order</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Total</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Payment</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-freshpodd-blue/50 divide-y divide-freshpodd-gray/50">
                                        {orders.map(order => (
                                            <tr key={order.id} className="hover:bg-freshpodd-gray/20 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-white">{order.id}<div className="text-xs text-gray-500">{order.date}</div></td>
                                                <td className="px-6 py-4 text-sm text-gray-300">{order.user.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-300">{formatPrice(order.total)}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <select value={order.paymentStatus} onChange={(e) => onUpdateOrder(order.id, { paymentStatus: e.target.value as Order['paymentStatus'] })} className="bg-freshpodd-gray text-white p-1 rounded-md border border-gray-600 text-xs focus:outline-none">
                                                        <option>Pending</option><option>Paid</option><option>Refunded</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <select value={order.status} onChange={(e) => onUpdateOrder(order.id, { status: e.target.value as Order['status'] })} className="bg-freshpodd-gray text-white p-1 rounded-md border border-gray-600 text-xs focus:outline-none">
                                                        <option>Processing</option><option>Shipped</option><option>Delivered</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {activeTab === 'products' && (
                             <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-freshpodd-gray/50">
                                    <thead className="bg-freshpodd-gray/30">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Product</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Price (USD)</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Total Stock</th>
                                            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-freshpodd-blue/50 divide-y divide-freshpodd-gray/50">
                                        {products.map(product => (
                                            <tr key={product.id} className="hover:bg-freshpodd-gray/20 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-white">{product.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-300">${product.price.toFixed(2)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-300">{getTotalStock(product.id)}</td>
                                                <td className="px-6 py-4 text-right text-sm font-medium">
                                                    <button onClick={() => handleOpenEditModal(product)} className="text-freshpodd-teal hover:text-teal-400">Edit</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {activeTab === 'users' && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-freshpodd-gray/50">
                                    <thead className="bg-freshpodd-gray/30">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Role</th>
                                            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-freshpodd-blue/50 divide-y divide-freshpodd-gray/50">
                                        {users.map(user => (
                                            <tr key={user.id} className="hover:bg-freshpodd-gray/20 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-white">{user.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-300">{user.email}</td>
                                                <td className="px-6 py-4 text-sm text-gray-300">{user.isAdmin ? 'Admin' : 'Customer'}</td>
                                                <td className="px-6 py-4 text-right text-sm font-medium">
                                                    {!user.isAdmin && <button onClick={() => onDeleteUser(user.id)} className="text-red-500 hover:text-red-700">Delete</button>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {activeTab === 'quotes' && (
                             <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-freshpodd-gray/50">
                                    <thead className="bg-freshpodd-gray/30">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Quantity</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Est. Quote</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-freshpodd-blue/50 divide-y divide-freshpodd-gray/50">
                                        {quoteRequests.map(quote => (
                                            <tr key={quote.id} className="hover:bg-freshpodd-gray/20 transition-colors">
                                                <td className="px-6 py-4 text-sm text-white">{quote.name}<div className="text-xs text-gray-500">{quote.id}</div></td>
                                                <td className="px-6 py-4 text-sm text-gray-300">{quote.quantity}</td>
                                                <td className="px-6 py-4 text-sm text-gray-300">{quote.estimatedQuote || 'N/A'}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <select value={quote.status} onChange={(e) => onUpdateQuoteStatus(quote.id, e.target.value as QuoteRequest['status'])} className="bg-freshpodd-gray text-white p-1 rounded-md border border-gray-600 text-xs focus:outline-none">
                                                        <option>New</option><option>Quoted</option><option>Closed</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {isModalOpen && editingProduct && (
                <EditProductModal 
                    product={editingProduct} 
                    warehouses={warehouses}
                    onClose={() => setIsModalOpen(false)} 
                    onSave={onUpdateProduct}
                    onUpdateStock={onUpdateWarehouseStock}
                />
            )}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default AdminPage;