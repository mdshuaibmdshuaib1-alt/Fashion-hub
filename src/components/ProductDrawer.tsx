import { Product } from '../types';

export default function ProductDrawer({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] bg-white border-t border-black p-6 rounded-t-2xl">
      <h2 className="text-xl font-bold uppercase">{product.title}</h2>
      <p className="text-sm mt-2">{product.description}</p>
      <p className="text-lg font-bold mt-4">${product.price}</p>
      <button className="w-full bg-black text-white py-3 mt-4 uppercase">Add to Cart</button>
      <button onClick={onClose} className="w-full mt-2 text-sm underline uppercase">Close</button>
    </div>
  );
}
