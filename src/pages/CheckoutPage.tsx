import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, collection, addDoc, runTransaction, doc } from '../lib/firebase';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', city: '', state: '', pincode: '' });
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!/^\d{10}$/.test(formData.phone)) return alert('Invalid phone number.');
    if (!/^\d{6}$/.test(formData.pincode)) return alert('Invalid PIN code.');
    if (!formData.name || !formData.address || !formData.city || !formData.state) return alert('All fields required.');
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await runTransaction(db, async (transaction) => {
        // Validate stock
        for (const item of cartItems) {
          const pRef = doc(db, 'products', item.productId);
          const pDoc = await transaction.get(pRef);
          if (!pDoc.exists() || pDoc.data().stock < item.quantity) throw new Error(`Product ${item.product.title} out of stock.`);
          transaction.update(pRef, { stock: pDoc.data().stock - item.quantity });
        }
        // Save order
        const orderRef = collection(db, 'orders');
        await addDoc(orderRef, {
          ...formData,
          items: cartItems.map(i => ({ productId: i.productId, quantity: i.quantity, size: i.size, color: i.color, price: i.product.offerPrice })),
          totalAmount: cartTotal,
          status: 'Confirmed',
          createdAt: new Date(),
        });
      });
      clearCart();
      navigate('/order-confirmation');
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6 uppercase tracking-widest">Checkout</h1>
      <div className="space-y-4">
        <input placeholder="Full Name" onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-3 rounded-xl" />
        <input placeholder="Phone (10 digits)" onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border p-3 rounded-xl" />
        <input placeholder="Address" onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border p-3 rounded-xl" />
        <div className="flex gap-2">
            <input placeholder="City" onChange={e => setFormData({...formData, city: e.target.value})} className="w-full border p-3 rounded-xl" />
            <input placeholder="State" onChange={e => setFormData({...formData, state: e.target.value})} className="w-full border p-3 rounded-xl" />
        </div>
        <input placeholder="PIN Code (6 digits)" onChange={e => setFormData({...formData, pincode: e.target.value})} className="w-full border p-3 rounded-xl" />
        <button onClick={handlePlaceOrder} disabled={loading} className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest">
            {loading ? 'Processing...' : 'Place Order (COD)'}
        </button>
      </div>
    </div>
  );
}
