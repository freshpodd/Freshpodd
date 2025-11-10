import React, { useState, useMemo } from 'react';
import { type User, type Order, type Product } from '../types';
import { XMarkIcon, ArrowLeftIcon } from './icons';

interface AdminPageProps {
  users: User[];
  orders: Order[];
  products: Product[];
  onUpdateOrder: (orderId: string, updates: Partial<Pick<Order, 'status' | 'paymentStatus'>>) => void;
  onUpdateProduct: (updatedProduct: Product) => void;
  onDeleteUser: (userId: string) => void;
  onGoBack: () => void;
  canGoBack: boolean;
}

const StatCard: React.FC<{ title: string; value: string | number, icon: string }> = ({ title, value, icon }) => (
    <div className="bg-freshpodd-gray/20 p-6 rounded-lg flex items-center space-x-4">
        <div className="text-3xl">{icon}</div>
        <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const OrderProgressBar: React.FC<{ status: Order['status'] }> = ({ status }) => {
    const steps = ['Processing', 'Shipped', 'Delivered'];
    const currentStepIndex = steps.indexOf(status);

    return (
        <div className="w-full">
            <div className="flex justify-between mb-1">
                {steps.map((step, index) => (
                    <div
                        key={step}
                        className={`text-xs font-semibold ${index <= currentStepIndex ? 'text-freshpodd-teal' : 'text-gray-500'}`}
                    >
                        {step}
                    </div>
                ))}
            </div>
            <div className="relative w-full h-2 bg-freshpodd-gray rounded-full">
                <div
                    className="absolute top-0 left-0 h-2 bg-freshpodd-teal rounded-full transition-all duration-500"
                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                ></div>
            </div>
        </div>
    );
};


const AdminPage: React.FC<AdminPageProps> = ({ users, orders, products, onUpdateOrder, onUpdateProduct, onDeleteUser, onGoBack, canGoBack }) => {
    const [activeTab, setActiveTab] = useState<'orders' | 'users' | 'products'>('orders');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const totalRevenue = useMemo(() => orders.reduce((sum, order) => sum + order.total, 0), [orders]);
    const totalStock = useMemo(() => products.reduce((sum, product) => sum + product.stock, 0), [products]);


    const handleOpenEditModal = (product: Product) => {
        setEditingProduct({ ...product });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSaveProduct = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            onUpdateProduct(editingProduct);
            handleCloseModal();
        }
    };
    
    const tabs = {
        orders: 'Orders',
        users: 'Users',
        products: 'Products',
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

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon="💰" />
                    <StatCard title="Total Orders" value={orders.length} icon="📦" />
                    <StatCard title="Total Users" value={users.length} icon="👥" />
                    <StatCard title="Total Units Available" value={totalStock} icon="🧊" />
                </div>

                {/* Management Section */}
                <div className="bg-freshpodd-gray/20 p-6 rounded-lg shadow-lg">
                    <div className="border-b border-freshpodd-gray mb-6">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            {Object.entries(tabs).map(([key, value]) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key as any)}
                                    className={`${
                                        activeTab === key
                                        ? 'border-freshpodd-teal text-freshpodd-teal'
                                        : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    {value}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {activeTab === 'orders' && (
                        <div className="space-y-6">
                            {orders.map(order => (
                                <div key={order.id} className="bg-freshpodd-gray/20 p-6 rounded-lg shadow-md">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white">Order #{order.id}</h3>
                                            <p className="text-sm text-gray-400">Date: {order.date} · Total: ${order.total.toFixed(2)}</p>
                                        </div>
                                        <div className="flex space-x-4 mt-4 md:mt-0">
                                            <div>
                                                <label className="text-xs text-gray-400">Payment</label>
                                                <select
                                                    value={order.paymentStatus}
                                                    onChange={(e) => onUpdateOrder(order.id, { paymentStatus: e.target.value as Order['paymentStatus'] })}
                                                    className="bg-freshpodd-gray text-white p-1 rounded-md border border-gray-600 text-sm focus:outline-none focus:ring-1 focus:ring-freshpodd-teal"
                                                >
                                                    <option>Pending</option>
                                                    <option>Paid</option>
                                                    <option>Refunded</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-400">Status</label>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => onUpdateOrder(order.id, { status: e.target.value as Order['status'] })}
                                                    className="bg-freshpodd-gray text-white p-1 rounded-md border border-gray-600 text-sm focus:outline-none focus:ring-1 focus:ring-freshpodd-teal"
                                                >
                                                    <option>Processing</option>
                                                    <option>Shipped</option>
                                                    <option>Delivered</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <OrderProgressBar status={order.status} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-freshpodd-gray pt-4">
                                        <div>
                                            <h4 className="font-semibold text-white mb-2">Customer Information</h4>
                                            <p className="text-sm text-gray-300"><strong>Name:</strong> {order.user.name}</p>
                                            <p className="text-sm text-gray-300"><strong>Address:</strong> {`${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.postalCode}, ${order.shippingInfo.country}`}</p>
                                            <p className="text-sm text-gray-300"><strong>Phone:</strong> {order.shippingInfo.phone}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-white mb-2">Items Ordered</h4>
                                            <ul className="text-sm text-gray-300 list-disc list-inside">
                                                {order.items.map(item => (
                                                    <li key={item.product.id}>{item.quantity} x {item.product.name}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {(activeTab === 'users' || activeTab === 'products') && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-freshpodd-gray">
                                {activeTab === 'users' && (
                                    <>
                                        <thead className="bg-freshpodd-gray/30">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Phone</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-freshpodd-blue divide-y divide-freshpodd-gray">
                                            {users.map(user => (
                                                <tr key={user.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.phone || 'N/A'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.isAdmin ? <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-teal-800 text-teal-100">Admin</span> : 'Customer'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        {!user.isAdmin && <button onClick={() => onDeleteUser(user.id)} className="text-red-500 hover:text-red-700">Delete</button>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </>
                                )}
                                {activeTab === 'products' && (
                                    <>
                                        <thead className="bg-freshpodd-gray/30">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stock</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rating</th>
                                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-freshpodd-blue divide-y divide-freshpodd-gray">
                                            {products.map(product => (
                                                <tr key={product.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{product.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${product.price.toFixed(2)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.stock}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.averageRating.toFixed(1)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button onClick={() => handleOpenEditModal(product)} className="text-freshpodd-teal hover:text-teal-400">Edit</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </>
                                )}
                            </table>
                        </div>
                     )}
                </div>
            </div>

            {/* Edit Product Modal */}
            {isModalOpen && editingProduct && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" aria-modal="true">
                    <div className="bg-freshpodd-blue border border-freshpodd-teal/50 rounded-lg shadow-xl p-8 w-full max-w-lg max-h-full overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Edit Product</h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-white"><XMarkIcon /></button>
                        </div>
                        <form onSubmit={handleSaveProduct} className="space-y-4">
                             <div>
                                <label htmlFor="productName" className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
                                <input type="text" id="productName" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full bg-freshpodd-gray text-white p-2 rounded-md border border-gray-600" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="productPrice" className="block text-sm font-medium text-gray-300 mb-2">Price</label>
                                    <input type="number" step="0.01" id="productPrice" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} className="w-full bg-freshpodd-gray text-white p-2 rounded-md border border-gray-600" />
                                </div>
                                 <div>
                                    <label htmlFor="productStock" className="block text-sm font-medium text-gray-300 mb-2">Stock</label>
                                    <input type="number" id="productStock" value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: Number(e.target.value)})} className="w-full bg-freshpodd-gray text-white p-2 rounded-md border border-gray-600" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="productDescription" className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea id="productDescription" rows={4} value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full bg-freshpodd-gray text-white p-2 rounded-md border border-gray-600"></textarea>
                            </div>
                            <div className="flex justify-end space-x-4 pt-4">
                                <button type="button" onClick={handleCloseModal} className="bg-freshpodd-gray/50 text-white font-bold py-2 px-4 rounded-md">Cancel</button>
                                <button type="submit" className="bg-freshpodd-teal hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-md">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;