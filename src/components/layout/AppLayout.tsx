import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Home, ShoppingBag, User, Film } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CartDrawer from '../CartDrawer';
import CheckoutModal from '../CheckoutModal';

export default function AppLayout() {
  const { cartItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white text-black font-sans">
      <header className="sticky top-0 z-50 bg-white border-b border-black p-4 flex justify-between items-center tracking-widest">
        <Link to="/" className="text-2xl font-bold uppercase">LuxeStyle</Link>
        <button onClick={() => setIsCartOpen(true)} className="relative">
          <ShoppingBag />
          {cartItems.length > 0 && <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{cartItems.length}</span>}
        </button>
      </header>
      
      <main className="flex-grow p-4">
        <Outlet />
      </main>

      <nav className="sticky bottom-0 z-50 bg-white border-t border-black p-4 flex justify-around uppercase text-xs font-bold tracking-widest">
        <Link to="/" className="flex flex-col items-center gap-1"><Home size={20} />Home</Link>
        <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center gap-1"><ShoppingBag size={20} />Cart</button>
      </nav>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={() => {setIsCartOpen(false); setIsCheckoutOpen(true);}} />
      {isCheckoutOpen && <CheckoutModal onClose={() => setIsCheckoutOpen(false)} />}
    </div>
  );
}
