export interface Product {
  id: string;
  title: string;
  category: string;
  price: number; // Original
  offerPrice: number; // Discounted
  stock: number;
  images: string[];
  sizes: string[];
  colors: string[];
  description: string;
}

export interface OutfitKit {
  id: string;
  title: string;
  description: string;
  productIds: string[];
  bundlePrice: number;
  discountPercent: number;
  heroImage: string;
  aestheticCategory: string;
}

export interface Reel {
  id: string;
  videoUrl: string;
  title: string;
  taggedProductIds: string[];
  likesCount: number;
}

export interface Order {
  id: string;
  userId: string;
  items: { productId: string; quantity: number }[];
  totalAmount: number;
  shippingAddress: string;
  status: 'Pending' | 'Packed' | 'Shipped' | 'Delivered';
  paymentId: string;
  createdAt: Date;
}

export interface User {
  uid: string;
  phoneNumber: string;
  role: 'customer' | 'admin';
  address: string;
}
