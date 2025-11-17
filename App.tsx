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
import AdminPage from './components/AdminPage';
import LandingPage from './components/LandingPage';
import LogoutConfirmationModal from './components/LogoutConfirmationModal';
import BackToTopButton from './components/BackToTopButton';
import WishlistPage from './components/WishlistPage';
import QuotePage from './components/QuotePage';
import { ChatBubbleIcon } from './components/icons';
import { getQuoteFromGemini } from './services/geminiService';
import { type View, type User, type Product, type CartItem, type Order, type Currency, type StockNotification, type QuoteRequest } from './types';

// Mock Data
const MOCK_PRODUCTS_DATA: Product[] = [
  {
    id: 'FP004',
    name: 'FreshPodd Go 75L',
    description: 'Ultimate portability for your daily adventures. The FreshPodd Go is compact, lightweight, and perfect for keeping your food and drinks cold on day trips, at the beach, or in your vehicle.',
    price: 799.99,
    imageUrl: 'https://i.imgur.com/hR5h2aJ.jpeg',
    features: [
      'Detachable 50W Solar Panel',
      '48-Hour Cooling on Full Charge',
      'Lightweight & Compact Design',
      'Simple Digital Controls',
      'Shoulder Strap for Easy Carrying'
    ],
    specs: {
      'Capacity': '75 Liters',
      'Weight': '15 kg',
      'Dimensions': '50cm x 40cm x 45cm',
      'Cooling Range': '-18°C to 10°C',
      'Battery': '25,000mAh Lithium-ion',
    },
    averageRating: 4.7,
    reviewsCount: 115,
    stock: 0, // Out of stock for demonstration
  },
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
    reviewsCount: 88,
    stock: 50,
  },
  {
    id: 'FP002',
    name: 'FreshPodd Adventurer 300L',
    description: 'The perfect balance of capacity and portability. The Adventurer model is designed for serious enthusiasts who need more space and advanced features for extended trips off the grid.',
    price: 1899.99,
    imageUrl: 'https://i.imgur.com/wVAmZpL.jpeg',
    features: [
      'Integrated 150W Solar Panel',
      '80-Hour Cooling on Full Charge',
      'Upgraded All-Terrain Wheels',
      'Digital Temperature Control with App Sync',
      'USB-C & USB-A Charging Ports',
      'Internal LED Lighting'
    ],
    specs: {
      'Capacity': '300 Liters',
      'Weight': '35 kg',
      'Dimensions': '80cm x 55cm x 55cm',
      'Cooling Range': '-20°C to 20°C',
      'Battery': '60,000mAh Lithium-ion',
    },
    averageRating: 4.9,
    reviewsCount: 62,
    stock: 40,
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
    reviewsCount: 45,
    stock: 25,
  },
];

const MOCK_USERS_DATA: User[] = [
    { id: '1', name: 'Admin User', email: 'admin@example.com', password: 'adminpassword', isAdmin: true, phone: '555-0199' },
    { id: '2', name: 'Test User', email: 'user@example.com', password: 'password123', phone: '555-0101' },
];

const MOCK_QUOTES_DATA: QuoteRequest[] = [
    {
      id: 'QR001',
      name: 'Jane Doe',
      email: 'jane.doe@acmecorp.com',
      phone: '555-123-4567',
      company: 'ACME Corp',
      capacity: 500,
      features: ['Dual-zone temperature control', 'Custom branding/logo'],
      quantity: 15,
      details: 'Need units for transporting sensitive medical supplies.',
      status: 'New',
      date: '2024-07-28',
    },
];


const CONVERSION_RATES: Record<Currency, number> = {
    USD: 1,
    INR: 83.50,
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [history, setHistory] = useState<View[]>(['landing']);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [isBuyNowFlow, setIsBuyNowFlow] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [stockNotifications, setStockNotifications] = useState<StockNotification[]>([]);


  // Convert mock data to state to allow for admin modifications
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS_DATA);
  const [users, setUsers] = useState<User[]>(MOCK_USERS_DATA);
  const [orders, setOrders] = useState<Order[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>(MOCK_QUOTES_DATA);
  
  const formatPrice = (priceInUsd: number) => {
    const rate = CONVERSION_RATES[currency];
    const convertedPrice = priceInUsd * rate;
    return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
        style: 'currency',
        currency: currency,
    }).format(convertedPrice);
  };
  
  const conversionRate = CONVERSION_RATES[currency];


  useEffect(() => {
    const handleScroll = () => {
        setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
      window.scrollTo({
          top: 0,
          behavior: 'smooth',
      });
  };

  const showNotification = (message: string, isError = false) => {
    setNotification(message);
    // You might want to add a different style for errors
    setTimeout(() => setNotification(''), 3000);
  };
  
  const handleNavigate = (view: View) => {
    setHistory(prev => {
        if (prev[prev.length - 1] === view) {
            return prev; // Do not add duplicate consecutive views
        }
        return [...prev, view];
    });
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleGoBack = () => {
    setHistory(prev => {
        if (prev.length <= 1) return prev; // Cannot go back further
        const newHistory = prev.slice(0, -1);
        setCurrentView(newHistory[newHistory.length - 1]);
        return newHistory;
    });
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
      setWishlist([]); // Clear wishlist for new user
      handleNavigate('home');
      showNotification(`Welcome, ${newUser.name}!`);
    } else { // Login
      const foundUser = users.find(u => u.email === credentials.email && u.password === credentials.password);
      if (foundUser) {
        setCurrentUser(foundUser);
        setWishlist([]); // Clear any guest wishlist
        // Mock loading orders for the logged-in user
        setOrders([
            { 
                id: 'FP1024', 
                date: '2023-11-05', 
                user: { id: '2', name: 'Test User' },
                items: [{ product: products[0], quantity: 1 }], 
                total: 1403.99, 
                status: 'Shipped',
                paymentStatus: 'Paid',
                shippingInfo: { address: '123 Tech Lane', city: 'Silicon Valley', postalCode: '94043', country: 'USA', phone: '555-0101' }
            },
            { 
                id: 'FP1007', 
                date: '2023-08-12', 
                user: { id: '2', name: 'Test User' },
                items: [{ product: products[1], quantity: 1 }], 
                total: 3239.99, 
                status: 'Delivered',
                paymentStatus: 'Paid',
                shippingInfo: { address: '456 Innovation Ave', city: 'Austin', postalCode: '73301', country: 'USA', phone: '555-0101' }
            }
        ].filter(order => foundUser.isAdmin || order.user.id === foundUser.id)); // Admins see all orders
        
        if (foundUser.isAdmin) {
          handleNavigate('admin');
        } else {
          handleNavigate('home');
        }
        showNotification(`Welcome back, ${foundUser.name}!`);
      } else {
        showNotification('Invalid email or password.', true);
      }
    }
  };

  const handleInitiateLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  const handleConfirmLogout = () => {
    setCurrentUser(null);
    setOrders([]);
    setWishlist([]);
    handleNavigate('home');
    showNotification('You have been logged out.');
    setIsLogoutModalOpen(false);
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
  
  const handleToggleWishlist = (productId: string) => {
    if (!currentUser) {
        handleNavigate('login');
        showNotification('Please log in to manage your wishlist.', true);
        return;
    }
    setWishlist(prev => {
        const exists = prev.find(p => p.id === productId);
        if (exists) {
            showNotification('Removed from wishlist.');
            return prev.filter(p => p.id !== productId);
        } else {
            const productToAdd = products.find(p => p.id === productId);
            if (productToAdd) {
                showNotification('Added to wishlist!');
                return [...prev, productToAdd];
            }
            return prev;
        }
    });
  };

  const handleCheckout = () => {
    if (!currentUser) {
        handleNavigate('login');
        showNotification('Please log in to proceed with checkout.', true);
        return;
    }

    // Decrement stock
    let canFulfill = true;
    const newProducts = [...products];
    cart.forEach(item => {
        const productIndex = newProducts.findIndex(p => p.id === item.product.id);
        if (productIndex !== -1 && newProducts[productIndex].stock >= item.quantity) {
            newProducts[productIndex].stock -= item.quantity;
        } else {
            canFulfill = false;
        }
    });

    if (!canFulfill) {
        showNotification('Error: Not enough stock for one or more items.', true);
        return;
    }

    const newOrder: Order = {
        id: `FP${1025 + orders.length}`,
        date: new Date().toISOString().split('T')[0],
        user: { id: currentUser.id, name: currentUser.name },
        items: cart,
        total: cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0) * 1.08,
        status: 'Processing',
        paymentStatus: 'Paid', // Assume payment is successful on checkout
        shippingInfo: { address: '789 User Street', city: 'Anytown', postalCode: '12345', country: 'USA', phone: currentUser.phone || 'N/A' }
    };

    setProducts(newProducts);
    setOrders([newOrder, ...orders]);
    setCart([]);
    handleNavigate('orders');
    showNotification('Your order has been placed successfully!');
  };

  const handleBuyNow = (item: CartItem) => {
    addToCart(item, false);
    setIsBuyNowFlow(true);
  };

  const handleStockNotificationSignup = (productId: string, email: string) => {
    setStockNotifications(prev => [...prev, { productId, email }]);
    showNotification(`We'll notify you at ${email} when the product is back in stock!`);
  };

  const handleGenerateQuote = async (requestData: Omit<QuoteRequest, 'id' | 'status' | 'date' | 'estimatedQuote'>): Promise<string | null> => {
    try {
        const quoteText = await getQuoteFromGemini(requestData, currency);
        return quoteText;
    } catch (error) {
        console.error("Error generating quote:", error);
        showNotification("Sorry, we couldn't generate an instant quote. Our team will still review your request and get back to you shortly.", true);
        return null;
    }
  };

  const handleQuoteRequestSubmit = (requestData: Omit<QuoteRequest, 'id' | 'status' | 'date'>) => {
    const newRequest: QuoteRequest = {
        ...requestData,
        id: `QR${(quoteRequests.length + 1).toString().padStart(3, '0')}`,
        status: 'New',
        date: new Date().toISOString().split('T')[0],
    };
    setQuoteRequests(prev => [newRequest, ...prev]);
    showNotification('Your quote request has been submitted successfully!');
  };
  
  // Admin handlers
  const handleUpdateOrder = (orderId: string, updates: Partial<Pick<Order, 'status' | 'paymentStatus'>>) => {
      setOrders(orders.map(o => o.id === orderId ? { ...o, ...updates } : o));
      const updateMessage = updates.status ? `status updated to ${updates.status}` : `payment status updated to ${updates.paymentStatus}`;
      showNotification(`Order #${orderId} ${updateMessage}.`);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    const oldProduct = products.find(p => p.id === updatedProduct.id);
    let notificationMessage = `${updatedProduct.name} has been updated.`;

    if (oldProduct && oldProduct.stock === 0 && updatedProduct.stock > 0) {
        const notificationsForProduct = stockNotifications.filter(n => n.productId === updatedProduct.id);
        if (notificationsForProduct.length > 0) {
            console.log(`Simulating sending "back in stock" emails to:`, notificationsForProduct.map(n => n.email));
            setStockNotifications(prev => prev.filter(n => n.productId !== updatedProduct.id));
            notificationMessage += ` ${notificationsForProduct.length} users notified about restock.`;
        }
    }
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    showNotification(notificationMessage);
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
        showNotification("You cannot delete your own account.", true);
        return;
    }
    setUsers(users.filter(u => u.id !== userId));
    showNotification(`User has been deleted.`);
  };

   const handleUpdateQuoteStatus = (quoteId: string, status: QuoteRequest['status']) => {
    setQuoteRequests(quotes => quotes.map(q => q.id === quoteId ? { ...q, status } : q));
    showNotification(`Quote #${quoteId} status updated to ${status}.`);
  };


  useEffect(() => {
    if (isBuyNowFlow && cart.length > 0) {
      setIsBuyNowFlow(false);
      handleCheckout();
    }
  }, [isBuyNowFlow, cart]);


  const renderView = () => {
    const canGoBack = history.length > 1;
    switch (currentView) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'home':
        return <HomePage onNavigate={handleNavigate} onGoBack={handleGoBack} canGoBack={canGoBack} />;
      case 'product':
        return <ProductPage products={products} onAddToCart={addToCart} onBuyNow={handleBuyNow} onGoBack={handleGoBack} canGoBack={canGoBack} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} currentUser={currentUser} formatPrice={formatPrice} conversionRate={conversionRate} onStockNotificationSignup={handleStockNotificationSignup} />;
      case 'cart':
        return <CartPage cartItems={cart} onRemoveItem={removeFromCart} onUpdateQuantity={updateCartQuantity} onCheckout={handleCheckout} onNavigate={handleNavigate} onGoBack={handleGoBack} canGoBack={canGoBack} formatPrice={formatPrice} />;
      case 'orders':
         if (!currentUser) {
            handleNavigate('login');
            return null;
         }
        return <OrdersPage orders={orders.filter(o => currentUser.isAdmin || o.user.id === currentUser.id)} onBuyAgain={addToCart} onNavigate={handleNavigate} onGoBack={handleGoBack} canGoBack={canGoBack} formatPrice={formatPrice} />;
      case 'contact':
        return <ContactPage onGoBack={handleGoBack} canGoBack={canGoBack} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onGoBack={handleGoBack} canGoBack={canGoBack} />;
      case 'returns':
        return <ReturnPolicyPage onGoBack={handleGoBack} canGoBack={canGoBack} />;
      case 'quote':
        return <QuotePage currentUser={currentUser} onSubmit={handleQuoteRequestSubmit} onGenerateQuote={handleGenerateQuote} onGoBack={handleGoBack} canGoBack={canGoBack} />;
      case 'wishlist':
        if (!currentUser) {
            handleNavigate('login');
            return null;
        }
        return <WishlistPage wishlistItems={wishlist} onAddToCart={addToCart} onToggleWishlist={handleToggleWishlist} onNavigate={handleNavigate} onGoBack={handleGoBack} canGoBack={canGoBack} formatPrice={formatPrice} />;
      case 'admin':
        if (!currentUser?.isAdmin) {
            handleNavigate('home');
            return null;
        }
        return <AdminPage users={users} orders={orders} products={products} quoteRequests={quoteRequests} onUpdateOrder={handleUpdateOrder} onUpdateProduct={handleUpdateProduct} onDeleteUser={handleDeleteUser} onUpdateQuoteStatus={handleUpdateQuoteStatus} onGoBack={handleGoBack} canGoBack={canGoBack} formatPrice={formatPrice} />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };
  
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className="flex flex-col min-h-screen bg-freshpodd-blue">
      {currentView !== 'landing' && <Header onNavigate={handleNavigate} cartItemCount={cartItemCount} wishlistItemCount={wishlist.length} user={currentUser} onLogout={handleInitiateLogout} currency={currency} onCurrencyChange={setCurrency} />}
      <main className="flex-grow">
        {renderView()}
      </main>
      {currentView !== 'landing' && <Footer onNavigate={handleNavigate} />}
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} currency={currency} />
       {currentView !== 'landing' && !isChatOpen && (
        <button onClick={() => setIsChatOpen(true)} className="fixed bottom-6 right-6 bg-freshpodd-teal text-white p-4 rounded-full shadow-lg hover:bg-teal-500 transition-transform transform hover:scale-110 z-50">
            <ChatBubbleIcon className="w-8 h-8"/>
        </button>
      )}
      {notification && (
        <div className="fixed top-24 right-6 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-out">
            {notification}
        </div>
      )}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
      {currentView !== 'landing' && <BackToTopButton isVisible={showBackToTop} onClick={scrollToTop} />}
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