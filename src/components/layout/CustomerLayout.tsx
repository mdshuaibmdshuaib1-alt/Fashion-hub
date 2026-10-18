import { Outlet, Link } from 'react-router-dom';
import { Home, ShoppingBag, Heart, Package } from 'lucide-react';

export default function CustomerLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black font-sans">
      <header className="sticky top-0 z-50 bg-white border-b p-4 flex justify-between items-center tracking-widest">
        <Link to="/" className="text-2xl font-bold uppercase">LuxeStyle</Link>
        <Link to="/cart"><ShoppingBag /></Link>
      </header>
      <main className="flex-grow"><Outlet /></main>
      <nav className="sticky bottom-0 bg-white border-t p-4 flex justify-around uppercase text-xs font-bold tracking-widest">
        <Link to="/" className="flex flex-col items-center gap-1"><Home size={20} />Home</Link>
        <Link to="/wishlist" className="flex flex-col items-center gap-1"><Heart size={20} />Wishlist</Link>
        <Link to="/my-orders" className="flex flex-col items-center gap-1"><Package size={20} />Orders</Link>
      </nav>
    </div>
  );
}
