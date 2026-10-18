import { useCart } from '../context/CartContext';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer({ isOpen, onClose, onCheckout }: { isOpen: boolean; onClose: () => void; onCheckout: () => void }) {
  const { cartItems, removeCartItem, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-full sm:w-96 h-full p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold uppercase tracking-widest">Your Cart</h2>
          <button onClick={onClose}><X /></button>
        </div>
        <div className="flex-grow overflow-y-auto space-y-4">
          {cartItems.map(item => (
            <div key={`${item.productId}-${item.size}`} className="flex gap-4 border-b pb-4">
              <img src={item.product.images[0]} className="h-20 w-16 object-cover rounded-lg" />
              <div className="flex-1">
                <p className="font-bold text-sm">{item.product.title}</p>
                <p className="text-xs text-gray-500">Size: {item.size} | Color: {item.color}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateQuantity(item.productId, item.size, item.color, Math.max(1, item.quantity - 1))} className="px-2 border rounded">-</button>
                  <span className="text-sm font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)} className="px-2 border rounded">+</button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">₹{item.product.offerPrice * item.quantity}</p>
                <button onClick={() => removeCartItem(item.productId, item.size, item.color)} className="text-[10px] text-red-500 uppercase mt-2">Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t pt-4">
          <p className="text-xl font-bold flex justify-between uppercase tracking-widest">Grand Total: <span>₹{cartTotal}</span></p>
          <button onClick={() => { onClose(); navigate('/checkout'); }} className="w-full bg-black text-white py-4 mt-4 rounded-full uppercase tracking-widest font-bold">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
