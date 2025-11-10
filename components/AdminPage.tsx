import React, { useState, useMemo } from 'react';
import { type User, type Order, type Product } from '../types';
import { XMarkIcon } from './icons';

interface AdminPageProps {
  users: User[];
  orders: Order[];
  products: Product[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onUpdateProduct: (updatedProduct: Product) => void;
  onDeleteUser: (userId: string) => void;
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

const AdminPage: React.FC<AdminPageProps> = ({ users, orders, products, onUpdateOrderStatus, onUpdateProduct, onDeleteUser }) => {
    const [activeTab, setActiveTab] = useState<'users' | 'orders' | 'products'>('users');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const totalRevenue = useMemo(() => orders.reduce((sum, order) => sum + order.total, 0), [orders]);

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
        users: 'Users',
        orders: 'Orders',
        products: 'Products',
    };

    return (
        <div className="min-h-screen bg-freshpodd-blue text-freshpodd-light py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-white mb-8">Admin Dashboard</h1>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon="💰" />
                    <StatCard title="Total Orders" value={orders.length} icon="📦" />
                    <StatCard title="Total Users" value={users.length} icon="👥" />
                    <StatCard title="Products" value={products.length} icon="🧊" />
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

                    <div className="overflow-x-auto">
                         <table className="min-w-full divide-y divide-freshpodd-gray">
                            {activeTab === 'users' && (
                                <>
                                    <thead className="bg-freshpodd-gray/30">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-freshpodd-blue divide-y divide-freshpodd-gray">
                                        {users.map(user => (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.isAdmin ? <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-teal-800 text-teal-100">Admin</span> : 'Customer'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {!user.isAdmin && <button onClick={() => onDeleteUser(user.id)} className="text-red-500 hover:text-red-700">Delete</button>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </>
                            )}
                            {activeTab === 'orders' && (
                                 <>
                                    <thead className="bg-freshpodd-gray/30">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order ID</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                     <tbody className="bg-freshpodd-blue divide-y divide-freshpodd-gray">
                                        {orders.map(order => (
                                            <tr key={order.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">#{order.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.date}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.user.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${order.total.toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <select 
                                                        value={order.status} 
                                                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                                                        className="bg-freshpodd-gray text-white p-1 rounded-md border border-gray-600 focus:outline-none focus:ring-1 focus:ring-freshpodd-teal">
                                                        <option>Processing</option>
                                                        <option>Shipped</option>
                                                        <option>Delivered</option>
                                                    </select>
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
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rating</th>
                                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                        </tr>
                                    </thead>
                                     <tbody className="bg-freshpodd-blue divide-y divide-freshpodd-gray">
                                        {products.map(product => (
                                            <tr key={product.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{product.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${product.price.toFixed(2)}</td>
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
                </div>
            </div>

            {/* Edit Product Modal */}
            {isModalOpen && editingProduct && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" aria-modal="true">
                    <div className="bg-freshpodd-blue border border-freshpodd-teal/50 rounded-lg shadow-xl p-8 w-full max-w-lg m-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Edit Product</h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-white"><XMarkIcon /></button>
                        </div>
                        <form onSubmit={handleSaveProduct} className="space-y-4">
                             <div>
                                <label htmlFor="productName" className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
                                <input type="text" id="productName" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full bg-freshpodd-gray text-white p-2 rounded-md border border-gray-600" />
                            </div>
                            <div>
                                <label htmlFor="productPrice" className="block text-sm font-medium text-gray-300 mb-2">Price</label>
                                <input type="number" id="productPrice" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} className="w-full bg-freshpodd-gray text-white p-2 rounded-md border border-gray-600" />
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