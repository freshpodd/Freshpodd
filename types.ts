import { type Chat } from "@google/genai";

export type View = 'home' | 'product' | 'cart' | 'orders' | 'contact' | 'login' | 'returns' | 'admin' | 'landing' | 'wishlist';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  isAdmin?: boolean;
  phone?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  features: string[];
  specs: { [key: string]: string };
  averageRating: number;
  reviewsCount: number;
  stock: number;
}

export interface Review {
  id:string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  product: Product;
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
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  shippingInfo: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
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