import { useState, useEffect } from 'react';
import { db, storage, collection, addDoc, getDocs, ref, uploadBytes, getDownloadURL } from '../../lib/firebase';
import { Product } from '../../types';

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', price: 0, offerPrice: 0, category: 'Streetwear' });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, 'products'));
    setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Please select an image file.');
    setLoading(true);
    try {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'products'), {
        ...formData,
        images: [imageUrl],
        stock: 10,
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'New product',
      });
      fetchProducts();
      setFormData({ title: '', price: 0, offerPrice: 0, category: 'Streetwear' });
      setFile(null);
      alert('Product added!');
    } catch (e) {
      alert('Error: ' + e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold uppercase tracking-widest">Manage Products</h2>
      <form onSubmit={handleSubmit} className="space-y-4 border border-white/20 p-6 rounded-3xl bg-gray-900">
        <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 bg-black border border-white/30 rounded-xl" />
        <input type="number" placeholder="Original Price (₹)" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full p-3 bg-black border border-white/30 rounded-xl" />
        <input type="number" placeholder="Offer Price (₹)" value={formData.offerPrice} onChange={e => setFormData({...formData, offerPrice: Number(e.target.value)})} className="w-full p-3 bg-black border border-white/30 rounded-xl" />
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full p-3 bg-black border border-white/30 rounded-xl text-white" />
        <button type="submit" disabled={loading} className="w-full bg-white text-black py-3 rounded-full font-bold uppercase tracking-widest">
          {loading ? 'Uploading...' : 'Add Product'}
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map(p => (
          <div key={p.id} className="p-4 border border-white/20 rounded-2xl flex items-center gap-4">
            {p.images && p.images[0] ? <img src={p.images[0]} className="w-16 h-16 object-cover rounded-lg" /> : <div className="w-16 h-16 bg-gray-700 rounded-lg" />}
            <div>
              <p className="font-bold">{p.title}</p>
              <p className="text-emerald-400">₹{p.offerPrice} <span className="line-through text-gray-500 text-xs">₹{p.price}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
