import { Link } from 'react-router-dom';

export default function OrderConfirmationPage() {
  return (
    <div className="p-8 text-center bg-white min-h-screen flex flex-col items-center justify-center">
      <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white text-4xl mb-6 shadow-xl">✓</div>
      <h1 className="text-3xl font-bold uppercase mb-4 tracking-tighter">Order Confirmed!</h1>
      <p className="text-gray-600 mb-8">Your stylish order is being processed.</p>
      <div className="bg-gray-100 p-6 rounded-2xl w-full max-w-sm text-left">
        <p className="text-sm font-bold uppercase mb-2">Order Summary</p>
        <p className="text-sm text-gray-500">Status: Confirmed</p>
        <p className="text-sm text-gray-500">Payment: Pending (COD)</p>
      </div>
      <Link to="/" className="mt-8 bg-black text-white px-8 py-3 rounded-full uppercase font-bold tracking-widest">Continue Shopping</Link>
    </div>
  );
}
