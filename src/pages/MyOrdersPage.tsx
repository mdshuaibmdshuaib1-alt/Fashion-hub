import { useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order } from '../types';
import { Link } from 'react-router-dom';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    if (!phone) return;
    setLoading(true);
    const q = query(collection(db, 'orders'), where('phone', '==', phone), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold uppercase mb-6 tracking-widest">My Orders</h1>
      <div className="flex gap-2 mb-6">
        <input placeholder="Enter Registered Phone" onChange={e => setPhone(e.target.value)} className="border p-2 rounded-lg flex-grow" />
        <button onClick={fetchOrders} className="bg-black text-white px-4 py-2 rounded-lg">Search</button>
      </div>
      {loading ? <p>Loading...</p> : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link to={`/order/${order.id}`} key={order.id} className="block border p-4 rounded-xl shadow-sm hover:border-black transition">
              <p className="font-bold">Order ID: {order.id.slice(0, 8)}...</p>
              <p className="text-sm">Status: <span className="font-semibold text-indigo-600">{order.status}</span></p>
              <p className="text-sm">Total: ₹{order.totalAmount}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
