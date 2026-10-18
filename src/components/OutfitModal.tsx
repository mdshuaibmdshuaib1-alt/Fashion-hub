import { useState } from 'react';
import { Product, OutfitKit } from '../types';
import { useCart } from '../context/CartContext';

export default function OutfitModal({ kit, products, onClose }: { kit: OutfitKit; products: Product[]; onClose: () => void }) {
  const { addToCart } = useCart();
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const kitProducts = products.filter(p => kit.productIds.includes(p.id));

  const handleAddToCart = () => {
    kitProducts.forEach(product => {
      addToCart({ productId: product.id, product, size: selectedSizes[product.id] || 'M', quantity: 1 });
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full sm:max-w-md p-8 rounded-t-2xl sm:rounded-none">
        <h2 className="text-xl font-bold uppercase mb-6 tracking-widest">{kit.title}</h2>
        {kitProducts.map(product => (
          <div key={product.id} className="mb-6">
            <p className="text-xs font-bold uppercase">{product.title}</p>
            <div className="flex gap-2 mt-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSizes(prev => ({ ...prev, [product.id]: size }))}
                  className={`w-10 h-10 border text-xs font-bold ${selectedSizes[product.id] === size ? 'bg-black text-white' : 'border-black'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="border-t pt-6 mt-6">
          <p className="text-xl font-bold tracking-widest">₹{kit.bundlePrice}</p>
          <button onClick={handleAddToCart} className="w-full bg-black text-white py-4 mt-6 uppercase font-bold tracking-widest">
            Add Entire Look to Cart
          </button>
          <button onClick={onClose} className="w-full mt-4 text-xs uppercase tracking-widest underline">Close</button>
        </div>
      </div>
    </div>
  );
}
