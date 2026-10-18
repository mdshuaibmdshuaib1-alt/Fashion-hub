import { useState, useEffect } from 'react';
import { db, collection, getDocs, doc, updateDoc, query, orderBy } from '../../lib/firebase';
import { Order } from '../../types';

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
    };
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    await updateDoc(doc(db, 'orders', orderId), { status });
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status as any } : o));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Orders</h2>
      {orders.map(order => (
        <div key={order.id} className="border border-white/20 p-4">
          <p>Customer: {order.shippingAddress.fullName}</p>
          <p>Status: {order.status}</p>
          <select onChange={(e) => updateStatus(order.id, e.target.value)} className="bg-black border p-1 mt-2">
            <option value="Confirmed">Confirmed</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      ))}
    </div>
  );
}
