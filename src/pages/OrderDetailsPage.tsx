import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order } from '../types';

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (id) getDoc(doc(db, 'orders', id)).then(s => s.exists() && setOrder({id: s.id, ...s.data()} as Order));
  }, [id]);

  if (!order) return <div className="p-6">Loading...</div>;

  const steps = ['Confirmed', 'Packed', 'Shipped', 'Delivered'];
  const currentStep = steps.indexOf(order.status);

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-xl font-bold uppercase mb-6">Order #{order.id.slice(0, 8)}</h1>
      <div className="space-y-4 mb-8">
        {steps.map((step, idx) => (
          <div key={step} className={`flex items-center gap-4 ${idx <= currentStep ? 'text-indigo-600' : 'text-gray-300'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${idx <= currentStep ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>{idx + 1}</div>
            <p className="font-bold">{step}</p>
          </div>
        ))}
      </div>
      <div className="border-t pt-4">
        <p>Delivery to: {order.shippingAddress?.fullName}</p>
        <p>{order.shippingAddress?.address}</p>
        <p className="font-bold mt-4">Total: ₹{order.totalAmount}</p>
        {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
          <button onClick={() => updateDoc(doc(db, 'orders', order.id!), {status: 'Cancelled'})} className="mt-6 text-red-500 underline">Cancel Order</button>
        )}
      </div>
    </div>
  );
}
