import { Product, OutfitKit, Reel } from '../types';

export const products: Product[] = [
  { id: 'p1', title: 'Vibrant Indigo Shirt', category: 'Streetwear', price: 1999, stock: 10, images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'], sizes: ['S', 'M', 'L'], description: 'Premium indigo cotton.' },
  { id: 'p2', title: 'Emerald Tailored Pants', category: 'Old Money', price: 2499, stock: 5, images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500'], sizes: ['30', '32', '34'], description: 'Sharp silhouette.' },
  { id: 'p3', title: 'Violet Oversized Hoodie', category: 'Streetwear', price: 2999, stock: 20, images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500'], sizes: ['M', 'L', 'XL'], description: 'Oversized comfort.' },
];

export const outfitKits: OutfitKit[] = [
  {
    id: 'k1',
    title: 'Vibrant Street Look',
    description: 'Effortless style.',
    productIds: ['p1', 'p3'],
    bundlePrice: 4499,
    discountPercent: 20,
    heroImage: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=800',
    aestheticCategory: 'Streetwear',
  },
];

export const reels: Reel[] = [
  { id: 'r1', videoUrl: 'https://sample-videos.com/video123.mp4', title: 'Styling the Linen Shirt', taggedProductIds: ['p1'], likesCount: 1200 },
];
