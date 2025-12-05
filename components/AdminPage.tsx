import React, { useState, useMemo } from 'react';
import { type User, type Order, type Product, type QuoteRequest, type Warehouse, type ChartDataPoint, type HrDepartment } from '../types';
import { XMarkIcon, ArrowLeftIcon, ChartBarIcon, TruckIcon, BriefcaseIcon, ChartPieIcon } from './icons';

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

const StatCard: React.FC<{ title: string; value: string | number, icon: React.ReactNode, subtext?: string }> = ({ title, value, icon, subtext }) => (
    <div className="bg-freshpodd-gray/20 p-5 rounded-lg flex items-start space-x-4">
        <div className="bg-freshpodd-gray/40 p-3 rounded-lg">{icon}</div>
        <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
        </div>
    </div>
);

const BarChart: React.FC<{ data: ChartDataPoint[], title: string, formatValue: (value: number) => string | number }> = ({ data, title, formatValue }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    return (
        <div className="bg-freshpodd-gray/20 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
            <div className="flex justify-between items-end h-48 space-x-2">
                {data.map(d => (
                    <div key={d.label} className="flex-1 flex flex-col items-center justify-end">
                        <div className="text-xs text-gray-300 transform-gpu" title={formatValue(d.value).toString()}>{formatValue(d.value)}</div>
                        <div className="w-full bg-freshpodd-teal rounded-t-md hover:bg-teal-400 transition-colors" style={{ height: `${(d.value / maxValue) * 100}%` }}></div>
                        <div className="text-xs text-gray-400 mt-1">{d.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LineChart: React.FC<{ data: ChartDataPoint[], title: string }> = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d.value / maxValue) * 100}`).join(' ');
    return (
        <div className="bg-freshpodd-gray/20 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
            <div className="h-48 relative">
                <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                    <polyline fill="none" stroke="#14b8a6" strokeWidth="2" points={points} />
                </svg>
            </div>
        </div>
    );
};

const PieChart: React.FC<{ data: HrDepartment[], title: string }> = ({ data, title }) => {
    const total = data.reduce((sum, d) => sum + d.count, 0);
    let cumulative = 0;
    return (
         <div className="bg-freshpodd-gray/20 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
                 <div className="relative w-40 h-40">
                    <svg viewBox="0 0 32 32" className="transform -rotate-90">
                        {data.map(d => {
                            const percentage = (d.count / total) * 100;
                            const dasharray = `${percentage} ${100 - percentage}`;
                            const dashoffset = -cumulative;
                            cumulative += percentage;
                            return <circle key={d.name} r="16" cx="16" cy="16" fill="transparent" stroke={d.color} strokeWidth="32" strokeDasharray={dasharray} strokeDashoffset={dashoffset}></circle>
                        })}
                    </svg>
                </div>
                <div className="flex flex-col space-y-2">
                    {data.map(d => (
                         <div key={d.name} className="flex items-center text-sm">
                             <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: d.color }}></span>
                             <span className="text-gray-300">{d.name}: {d.count}</span>
                         </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const DashboardTab: React.FC<Pick<AdminPageProps, 'orders' | 'users' | 'quoteRequests' | 'warehouses' | 'formatPrice' | 'salesChartData' | 'hrData' | 'marketingChartData'>> = (props) => {
    const { orders, users, quoteRequests, warehouses, formatPrice, salesChartData, hrData, marketingChartData } = props;
    const totalRevenue = useMemo(() => orders.reduce((sum, order) => sum + order.total, 0), [orders]);
    const avgOrderValue = totalRevenue / (orders.length || 1);
    {/* FIX: Explicitly typing the accumulator and value in reduce to prevent incorrect type inference. */}
    const totalStock = warehouses.reduce((sum: number, w) => sum + Object.values(w.stock).reduce((s: number, count: number) => s + count, 0), 0);
    const totalEmployees = hrData.reduce((sum: number, dept) => sum + dept.count, 0);

    return (
        <div className="space-y-8">
            {/* Sales */}
            <section>
                <h2 className="text-2xl font-bold text-white mb-4">Sales Performance Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <StatCard title="Total Revenue" value={formatPrice(totalRevenue)} icon={<ChartBarIcon className="w-6 h-6 text-freshpodd-teal" />} />
                    <StatCard title="Average Order Value" value={formatPrice(avgOrderValue)} icon={<span className="text-2xl">📈</span>} />
                    <StatCard title="Total Orders" value={orders.length} icon={<span className="text-2xl">📦</span>} />
                </div>
                <BarChart data={salesChartData} title="Revenue by Month" formatValue={(v) => formatPrice(v)} />
            </section>
             {/* Logistics */}
            <section>
                <h2 className="text-2xl font-bold text-white mb-4">Logistics & Operations</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <StatCard title="Total Stock (All Warehouses)" value={totalStock} icon={<TruckIcon className="w-6 h-6 text-freshpodd-teal" />} />
                    <StatCard title="Shipments" value={orders.filter(o => o.status === 'Shipped').length} icon={<span className="text-2xl">✈️</span>} />
                    <StatCard title="Warehouses" value={warehouses.length} icon={<span className="text-2xl">🏢</span>} />
                </div>
                 <BarChart data={warehouses.map(w => ({ label: w.name.split(' ')[0], value: Object.values(w.stock).reduce((s: number, c: number) => s + c, 0) }))} title="Live Stock Levels by Warehouse" formatValue={v => v} />
            </section>
            {/* HR & Marketing */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Human Resources</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <StatCard title="Total Employees" value={totalEmployees} icon={<BriefcaseIcon className="w-6 h-6 text-freshpodd-teal" />} />
                     </div>
                    <PieChart data={hrData} title="Department Breakdown" />
                </section>
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Marketing Analytics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <StatCard title="Website Traffic" value={`${marketingChartData[marketingChartData.length-1].value.toLocaleString()}`} subtext="Last 30 days" icon={<span className="text-2xl">🌐</span>} />
                        <StatCard title="Conversion Rate" value="2.5%" icon={<span className="text-2xl">🎯</span>} />
                    </div>
                     <LineChart data={marketingChartData} title="Website Traffic Over Time" />
                </section>
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
                <h1 className="text-4xl font-extrabold text-white mb-8">Admin Dashboard</h1>

                <div className="bg-freshpodd-gray/20 p-2 sm:p-6 rounded-lg shadow-lg">
                    <div className="border-b border-freshpodd-gray mb-6">
                        <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto" aria-label="Tabs">
                             {Object.entries(tabs).map(([key, value]) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key as any)}
                                    className={`${
                                        activeTab === key
                                        ? 'border-freshpodd-teal text-freshpodd-teal'
                                        : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                                    } whitespace-nowrap py-4 px-1 sm:px-2 border-b-2 font-medium text-sm sm:text-base`}
                                >
                                    {value}
                                </button>
                            ))}
                        </nav>
                    </div>
                    
                    <div className="mt-8">
                        {activeTab === 'dashboard' && <DashboardTab {...props} />}
                        {activeTab === 'orders' && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-freshpodd-gray">
                                    <thead className="bg-freshpodd-gray/30">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Order</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Total</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Payment</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-freshpodd-blue divide-y divide-freshpodd-gray">
                                        {orders.map(order => (
                                            <tr key={order.id}>
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
                                <table className="min-w-full divide-y divide-freshpodd-gray">
                                    <thead className="bg-freshpodd-gray/30">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Product</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Price (USD)</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Total Stock</th>
                                            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-freshpodd-blue divide-y divide-freshpodd-gray">
                                        {products.map(product => (
                                            <tr key={product.id}>
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
                                <table className="min-w-full divide-y divide-freshpodd-gray">
                                    <thead className="bg-freshpodd-gray/30">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Role</th>
                                            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-freshpodd-blue divide-y divide-freshpodd-gray">
                                        {users.map(user => (
                                            <tr key={user.id}>
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
                                <table className="min-w-full divide-y divide-freshpodd-gray">
                                    <thead className="bg-freshpodd-gray/30">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Quantity</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Est. Quote</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-freshpodd-blue divide-y divide-freshpodd-gray">
                                        {quoteRequests.map(quote => (
                                            <tr key={quote.id}>
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
        </div>
    );
};

export default AdminPage;