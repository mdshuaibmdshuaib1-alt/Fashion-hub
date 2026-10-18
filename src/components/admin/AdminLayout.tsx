import { Link, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <nav className="w-64 border-r border-white/20 p-6 space-y-4">
        <h2 className="text-xl font-bold mb-8">ADMIN</h2>
        <Link to="/admin" className="block p-2 hover:bg-white/10">Dashboard</Link>
        <Link to="/admin/products" className="block p-2 hover:bg-white/10">Products</Link>
        <Link to="/admin/outfits" className="block p-2 hover:bg-white/10">Outfit Kits</Link>
        <Link to="/admin/reels" className="block p-2 hover:bg-white/10">Reels</Link>
        <Link to="/admin/orders" className="block p-2 hover:bg-white/10">Orders</Link>
      </nav>
      <main className="flex-grow p-8">
        <Outlet />
      </main>
    </div>
  );
}
