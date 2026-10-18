import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, collection, onSnapshot } from '../lib/firebase';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const q = collection(db, 'products');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(data.filter(p => p.active)); // Only active products
      setLoading(false);
    }, (err) => {
      setError('Failed to load products.');
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <div className="p-8 text-center">Loading collection...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-4 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 tracking-tighter uppercase">Latest Collections</h1>
      {products.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No products available at the moment.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {products.map(product => {
            const hasValidPrice = typeof product.offerPrice === 'number' && product.offerPrice > 0;
            return (
              <div key={product.id} className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <div className="w-full h-40 bg-gray-100 rounded-xl mb-3 overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                  {product.images && product.images[0] ? (
                    <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                  )}
                </div>
                <h3 className="font-bold text-sm text-gray-900 truncate cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>{product.title || 'Untitled Product'}</h3>
                {hasValidPrice ? (
                  <p className="text-emerald-600 font-bold text-sm mt-1">
                    ₹{product.offerPrice} 
                    {product.price > product.offerPrice && <span className="line-through text-gray-400 text-xs ml-1 font-normal">₹{product.price}</span>}
                  </p>
                ) : (
                  <p className="text-red-500 text-xs mt-1">Price unavailable</p>
                )}
                <button 
                  onClick={() => addToCart({productId: product.id, product, size: 'M', color: 'Default', quantity: 1})} 
                  className="w-full mt-3 bg-black text-white py-2 rounded-full text-xs uppercase font-bold tracking-widest hover:bg-gray-800 transition"
                  disabled={!hasValidPrice}
                >
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
