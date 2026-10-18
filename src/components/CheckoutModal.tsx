import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, addDoc, collection } from '../lib/firebase';
import { useCart } from '../context/CartContext';

export default function CheckoutModal({ onClose }: { onClose: () => void }) {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [address, setAddress] = useState({ fullName: '', phone: '', address: '', city: '', pincode: '' });
  const handlePlaceOrder = async () => {
    const orderData = {
      items: cartItems.length > 0 
        ? cartItems.map(i => ({ productId: i.productId, quantity: i.quantity, size: i.size }))
        : [{ productId: 'mock-p1', quantity: 1, size: 'M' }],
      totalAmount: cartTotal > 0 ? cartTotal : 1999,
      shippingAddress: address,
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      orderStatus: 'Confirmed',
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, 'orders'), orderData);
      clearCart();
      navigate('/order-confirmation');
      onClose();
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Check console.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm p-8 rounded-3xl shadow-2xl">
        <h2 className="text-xl font-bold uppercase mb-6 tracking-widest">Shipping Address</h2>
        <input placeholder="Full Name" onChange={e => setAddress({...address, fullName: e.target.value})} className="w-full border-b border-gray-300 p-2 mb-4 focus:border-black outline-none" />
        <input placeholder="Phone Number" onChange={e => setAddress({...address, phone: e.target.value})} className="w-full border-b border-gray-300 p-2 mb-4 focus:border-black outline-none" />
        <input placeholder="Street Address" onChange={e => setAddress({...address, address: e.target.value})} className="w-full border-b border-gray-300 p-2 mb-4 focus:border-black outline-none" />
        <input placeholder="City" onChange={e => setAddress({...address, city: e.target.value})} className="w-full border-b border-gray-300 p-2 mb-4 focus:border-black outline-none" />
        <input placeholder="Pincode" onChange={e => setAddress({...address, pincode: e.target.value})} className="w-full border-b border-gray-300 p-2 mb-6 focus:border-black outline-none" />
        
        <button onClick={handlePlaceOrder} className="w-full bg-black text-white py-4 rounded-full uppercase font-bold tracking-widest hover:bg-gray-800 transition">
          Place Order (COD)
        </button>
        <button onClick={onClose} className="w-full mt-4 text-xs uppercase tracking-widest underline text-gray-500">Cancel</button>
      </div>
    </div>
  );
}
