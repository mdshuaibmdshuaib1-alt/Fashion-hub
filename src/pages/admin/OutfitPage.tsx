import { useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs } from '../../lib/firebase';
import { Product } from '../../types';

export default function OutfitPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [bundlePrice, setBundlePrice] = useState(0);
  const [title, setTitle] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, 'products'));
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'outfitKits'), {
      title,
      productIds: selectedProductIds,
      bundlePrice,
      description: 'Curated look',
      discountPercent: 10,
      heroImage: '',
      aestheticCategory: 'Streetwear'
    });
    alert('Outfit kit added');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold uppercase tracking-widest">Create Outfit Kit</h2>
      <form onSubmit={handleSubmit} className="space-y-4 border border-white/20 p-6 rounded-3xl bg-gray-900">
        <input type="text" placeholder="Kit Title" onChange={e => setTitle(e.target.value)} className="w-full p-3 bg-black border border-white/30 rounded-xl" />
        <input type="number" placeholder="Bundle Price (₹)" onChange={e => setBundlePrice(Number(e.target.value))} className="w-full p-3 bg-black border border-white/30 rounded-xl" />
        <div className="space-y-2">
          <p>Select Products:</p>
          {products.map(p => (
            <label key={p.id} className="flex items-center gap-2">
              <input type="checkbox" onChange={e => {
                if (e.target.checked) setSelectedProductIds(prev => [...prev, p.id]);
                else setSelectedProductIds(prev => prev.filter(id => id !== p.id));
              }} />
              {p.title}
            </label>
          ))}
        </div>
        <button type="submit" className="w-full bg-white text-black py-3 rounded-full font-bold uppercase tracking-widest">Create Kit</button>
      </form>
    </div>
  );
}
