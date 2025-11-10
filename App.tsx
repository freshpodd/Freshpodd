import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import ProductPage from './components/ProductPage';
import LoginPage from './components/LoginPage';
import CartPage from './components/CartPage';
import OrdersPage from './components/OrdersPage';
import ContactPage from './components/ContactPage';
import Chatbot from './components/Chatbot';
import ReturnPolicyPage from './components/ReturnPolicyPage';
import AdminPage from './components/AdminPage'; // Import AdminPage
import { ChatBubbleIcon } from './components/icons';
import { type View, type User, type Product, type CartItem, type Order } from './types';

// Mock Data
const MOCK_PRODUCTS_DATA: Product[] = [
  {
    id: 'FP001',
    name: 'FreshPodd Basic 150L',
    description: 'The reliable workhorse of the FreshPodd family. Perfect for families and adventurers who need dependable, ice-free cooling without the frills.',
    price: 1299.99,
    imageUrl: 'https://i.imgur.com/uF7hIe3.jpeg',
    features: [
      'Integrated 100W Solar Panel',
      '72-Hour Cooling on Full Charge',
      'Rugged All-Terrain Wheels',
      'Digital Temperature Control',
      'USB Charging Ports'
    ],
    specs: {
      'Capacity': '150 Liters',
      'Weight': '25 kg',
      'Dimensions': '60cm x 45cm x 50cm',
      'Cooling Range': '-20°C to 20°C',
      'Battery': '45,000mAh Lithium-ion',
    },
    averageRating: 4.8,
    reviewsCount: 88
  },
  {
    id: 'FP003',
    name: 'FreshPodd Pro 600L (AI-Powered)',
    description: 'The pinnacle of mobile cold storage. With a massive 600L capacity and AI-powered smart cooling technology, the Pro model optimizes power usage and ensures precise temperature management for commercial needs or extreme expeditions.',
    price: 2999.99,
    imageUrl: 'https://i.imgur.com/gKj3aML.jpeg',
    features: [
      'AI-Powered Smart Cooling',
      'Integrated 200W Solar Panel',
      '96-Hour Cooling on Full Charge',
      'Heavy-Duty All-Terrain Wheels',
      'Digital Temperature Control',
      'USB-C & USB-A Charging Ports',
      'Internal LED Lighting'
    ],
    specs: {
      'Capacity': '600 Liters',
      'Weight': '55 kg',
      'Dimensions': '120cm x 70cm x 65cm',
      'Cooling Range': '-22°C to 20°C',
      'Battery': '90,000mAh Lithium-ion',
    },
    averageRating: 4.9,
    reviewsCount: 45
  },
];

const MOCK_USERS_DATA: User[] = [
    { id: '1', name: 'Admin User', email: 'admin@example.com', password: 'adminpassword', isAdmin: true },
    { id: '2', name: 'Test User', email: 'user@example.com', password: 'password123' },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [isBuyNowFlow, setIsBuyNowFlow] = useState(false);

  // Convert mock data to state to allow for admin modifications
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS_DATA);
  const [users, setUsers] = useState<User[]>(MOCK_USERS_DATA);
  const [orders, setOrders] = useState<Order[]>([]);

  const showNotification = (message: string, isError = false) => {
    setNotification(message);
    // You might want to add a different style for errors
    setTimeout(() => setNotification(''), 3000);
  };
  
  const handleNavigate = (view: View) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleLogin = (credentials: { email: string; password: string; name?: string }) => {
    if (credentials.name) { // Signup
      const existingUser = users.find(u => u.email === credentials.email);
      if (existingUser) {
        showNotification('An account with this email already exists.', true);
        return;
      }
      const newUser: User = {
        id: (users.length + 1).toString(),
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        isAdmin: false,
      };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      setOrders([]); // Clear orders for new user
      handleNavigate('home');
      showNotification(`Welcome, ${newUser.name}!`);
    } else { // Login
      const foundUser = users.find(u => u.email === credentials.email && u.password === credentials.password);
      if (foundUser) {
        setCurrentUser(foundUser);
        // Mock loading orders for the logged-in user
        setOrders([
            { 
                id: 'FP1024', 
                date: '2023-11-05', 
                user: { id: '2', name: 'Test User' },
                items: [{ product: products[0], quantity: 1 }], 
                total: 1403.99, 
                status: 'Shipped',
                shippingInfo: { address: '123 Tech Lane', city: 'Silicon Valley', postalCode: '94043', country: 'USA' }
            },
            { 
                id: 'FP1007', 
                date: '2023-08-12', 
                user: { id: '2', name: 'Test User' },
                items: [{ product: products[1], quantity: 1 }], 
                total: 3239.99, 
                status: 'Delivered',
                shippingInfo: { address: '456 Innovation Ave', city: 'Austin', postalCode: '73301', country: 'USA' }
            }
        ].filter(order => foundUser.isAdmin || order.user.id === foundUser.id)); // Admins see all orders
        handleNavigate('home');
        showNotification(`Welcome back, ${foundUser.name}!`);
      } else {
        showNotification('Invalid email or password.', true);
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setOrders([]);
    handleNavigate('home');
    showNotification('You have been logged out.');
  };

  const addToCart = (item: CartItem, showNotif = true) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(i => i.product.id === item.product.id);
      if (existingItem) {
        return prevCart.map(i => i.product.id === item.product.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prevCart, item];
    });
    if (showNotif) {
      showNotification(`${item.product.name} added to cart!`);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart(cart.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };
  
  const handleCheckout = () => {
    if (!currentUser) {
        handleNavigate('login');
        showNotification('Please log in to proceed with checkout.', true);
        return;
    }
    const newOrder: Order = {
        id: `FP${1025 + orders.length}`,
        date: new Date().toISOString().split('T')[0],
        user: { id: currentUser.id, name: currentUser.name },
        items: cart,
        total: cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0) * 1.08,
        status: 'Processing',
        shippingInfo: { address: '789 User Street', city: 'Anytown', postalCode: '12345', country: 'USA' }
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    handleNavigate('orders');
    showNotification('Your order has been placed successfully!');
  };

  const handleBuyNow = (item: CartItem) => {
    addToCart(item, false);
    setIsBuyNowFlow(true);
  };
  
  // Admin handlers
  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    showNotification(`Order #${orderId} status updated to ${status}.`);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    showNotification(`${updatedProduct.name} has been updated.`);
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
        showNotification("You cannot delete your own account.", true);
        return;
    }
    setUsers(users.filter(u => u.id !== userId));
    showNotification(`User has been deleted.`);
  };

  useEffect(() => {
    if (isBuyNowFlow && cart.length > 0) {
      setIsBuyNowFlow(false);
      handleCheckout();
    }
  }, [isBuyNowFlow, cart]);


  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'product':
        return <ProductPage products={products} onAddToCart={addToCart} onBuyNow={handleBuyNow} />;
      case 'cart':
        return <CartPage cartItems={cart} onRemoveItem={removeFromCart} onUpdateQuantity={updateCartQuantity} onCheckout={handleCheckout} onNavigate={handleNavigate} />;
      case 'orders':
         if (!currentUser) {
            handleNavigate('login');
            return null;
         }
        return <OrdersPage orders={orders.filter(o => currentUser.isAdmin || o.user.id === currentUser.id)} onBuyAgain={addToCart} onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage />;
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'returns':
        return <ReturnPolicyPage />;
      case 'admin':
        if (!currentUser?.isAdmin) {
            handleNavigate('home');
            return null;
        }
        return <AdminPage users={users} orders={orders} products={products} onUpdateOrderStatus={handleUpdateOrderStatus} onUpdateProduct={handleUpdateProduct} onDeleteUser={handleDeleteUser} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };
  
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className="flex flex-col min-h-screen bg-freshpodd-blue">
      <Header onNavigate={handleNavigate} cartItemCount={cartItemCount} user={currentUser} onLogout={handleLogout}/>
      <main className="flex-grow">
        {renderView()}
      </main>
      <Footer onNavigate={handleNavigate} />
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      {!isChatOpen && (
        <button onClick={() => setIsChatOpen(true)} className="fixed bottom-6 right-6 bg-freshpodd-teal text-white p-4 rounded-full shadow-lg hover:bg-teal-500 transition-transform transform hover:scale-110">
            <ChatBubbleIcon className="w-8 h-8"/>
        </button>
      )}
      {notification && (
        <div className="fixed top-24 right-6 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-out">
            {notification}
        </div>
      )}
      <style>{`
        @keyframes fade-in-out {
            0% { opacity: 0; transform: translateY(-20px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
        }
        .animate-fade-in-out {
            animation: fade-in-out 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;