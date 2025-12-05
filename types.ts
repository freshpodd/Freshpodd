import { type Chat } from "@google/genai";

export type Currency = 'USD' | 'INR' | 'EUR' | 'GBP';

export type View = 'home' | 'product' | 'cart' | 'orders' | 'contact' | 'login' | 'returns' | 'admin' | 'landing' | 'wishlist' | 'quote';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  isAdmin?: boolean;
  phone?: string;
}

// New types for Admin Dashboard
export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface HrDepartment {
    name: string;
    count: number;
    color: string;
}

// New type for multi-warehouse system
export interface Warehouse {
  id: string;
  name: string;
  location: string; // e.g., "Chicago, USA"
  country: string;
  coords: { x: number, y: number }; // For map visualization
  stock: {
    [productId: string]: number;
  };
}


export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // This will always be in USD
  imageUrl: string;
  features: string[];
  specs: { [key: string]: string };
  averageRating: number;
  reviewsCount: number;
  // stock: number; // This is now managed per warehouse
}

export interface Review {
  id:string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  product: Product & { stock: number }; // Stock is now total stock
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  user: {
    id: string;
    name: string;
  };
  items: CartItem[];
  total: number; // Always in USD
  status: 'Processing' | 'Shipped' | 'Delivered';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  shippingInfo: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    coords?: { x: number, y: number }; // For map visualization
  };
  paymentMethod?: 'UPI' | 'Online Banking' | 'Cash on Delivery';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface GeminiChatSession {
  chat: Chat;
  history: { role: 'user' | 'model', parts: { text: string }[] }[];
}

export interface StockNotification {
  productId: string;
  email: string;
}

export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  capacity: number;
  dimensions?: string;
  features: string[];
  otherFeatures?: string;
  quantity: number;
  details: string;
  status: 'New' | 'Quoted' | 'Closed';
  date: string;
  estimatedQuote?: string;
}