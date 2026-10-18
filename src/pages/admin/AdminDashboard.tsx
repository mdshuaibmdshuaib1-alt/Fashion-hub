import { useState, useEffect } from 'react';
import { db, storage, collection, addDoc, getDocs, updateDoc, doc, deleteDoc, onSnapshot, ref, uploadBytes, getDownloadURL } from '../../lib/firebase';
import { Product, Order, OutfitKit, Reel } from '../../types';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [outfits, setOutfits] = useState<OutfitKit[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);

  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, 'products'), (s) => setProducts(s.docs.map(d => ({id: d.id, ...d.data()} as Product))));
    const unsubOrders = onSnapshot(collection(db, 'orders'), (s) => setOrders(s.docs.map(d => ({id: d.id, ...d.data()} as Order))));
    const unsubOutfits = onSnapshot(collection(db, 'outfitKits'), (s) => setOutfits(s.docs.map(d => ({id: d.id, ...d.data()} as OutfitKit))));
    const unsubReels = onSnapshot(collection(db, 'reels'), (s) => setReels(s.docs.map(d => ({id: d.id, ...d.data()} as Reel))));
    return () => { unsubProducts(); unsubOrders(); unsubOutfits(); unsubReels(); };
  }, []);

  const totalSales = orders.filter(o => o.status === 'Delivered').reduce((sum, o) => sum + o.totalAmount, 0);

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-indigo-600 rounded-3xl text-white"><h3>Total Sales</h3><p className="text-3xl font-bold">₹{totalSales}</p></div>
            <div className="p-6 bg-emerald-500 rounded-3xl text-white"><h3>Total Orders</h3><p className="text-3xl font-bold">{orders.length}</p></div>
          </div>
        );
      case 'Products':
        return <ProductManager products={products} />;
      case 'Orders':
        return <OrderManager orders={orders} />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <nav className="w-64 bg-black text-white p-6 space-y-4">
        <h1 className="text-xl font-bold mb-8">LUXESTYLE ADMIN</h1>
        {['Dashboard', 'Products', 'Outfit Kits', 'Reels', 'Orders'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className="block w-full text-left p-3 hover:bg-white/10 rounded-xl">{tab}</button>
        ))}
      </nav>
      <main className="flex-grow p-8">{renderContent()}</main>
    </div>
  );
}

function ProductManager({ products }: { products: Product[] }) {
  const [formData, setFormData] = useState({ title: '', price: 0, offerPrice: 0, category: 'Tops' });
  const [file, setFile] = useState<File | null>(null);

  const handleAdd = async () => {
    if (!file) return;
    const storageRef = ref(storage, `products/${Date.now()}`);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);
    await addDoc(collection(db, 'products'), { ...formData, images: [imageUrl], stock: 10, sizes: ['S', 'M', 'L'], description: '' });
    alert('Product Added');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl space-y-4">
        <input type="text" placeholder="Title" onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border p-2 rounded-lg" />
        <input type="number" placeholder="MRP (₹)" onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full border p-2 rounded-lg" />
        <input type="number" placeholder="Offer Price (₹)" onChange={e => setFormData({...formData, offerPrice: Number(e.target.value)})} className="w-full border p-2 rounded-lg" />
        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
        <button onClick={handleAdd} className="bg-black text-white px-6 py-2 rounded-full">Add Product</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {products.map(p => <div key={p.id} className="bg-white p-4 rounded-xl">{p.title} - ₹{p.offerPrice}</div>)}
      </div>
    </div>
  );
}

function OrderManager({ orders }: { orders: Order[] }) {
  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'orders', id), { status });
  };

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <div key={order.id} className="bg-white p-4 rounded-xl flex justify-between items-center">
          <div><p className="font-bold">{order.shippingAddress.fullName}</p><p>₹{order.totalAmount}</p></div>
          <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)} className="border p-2">
            <option>Confirmed</option>
            <option>Packed</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>
        </div>
      ))}
    </div>
  );
}
