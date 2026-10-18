import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';

interface CartItem {
  productId: string;
  size: string;
  color: string;
  quantity: number;
  product: Product;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeCartItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.productId === item.productId && i.size === item.size && i.color === item.color);
      if (existing) {
        return prev.map(i => i.productId === item.productId && i.size === item.size && i.color === item.color ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
  };

  const removeCartItem = (productId: string, size: string, color: string) => {
    setCartItems(prev => prev.filter(i => !(i.productId === productId && i.size === size && i.color === color)));
  };

  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    setCartItems(prev => prev.map(i => i.productId === productId && i.size === size && i.color === color ? { ...i, quantity } : i));
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeCartItem, updateQuantity, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
