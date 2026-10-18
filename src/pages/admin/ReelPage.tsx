import { useState, useEffect } from 'react';
import { db, storage, collection, addDoc, getDocs, ref, uploadBytes, getDownloadURL } from '../../lib/firebase';
import { Product } from '../../types';

export default function ReelPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
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
    if (!file) return;

    const storageRef = ref(storage, `reels/${file.name}`);
    await uploadBytes(storageRef, file);
    const videoUrl = await getDownloadURL(storageRef);

    await addDoc(collection(db, 'reels'), {
      title,
      videoUrl,
      taggedProductIds: selectedProductIds,
      likesCount: 0,
    });
    alert('Reel uploaded');
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Upload Reel</h2>
      <form onSubmit={handleSubmit} className="space-y-4 border p-4">
        <input type="text" placeholder="Reel Title" onChange={e => setTitle(e.target.value)} className="w-full p-2 bg-black border" />
        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
        <div className="space-y-2">
          <p>Tag Products:</p>
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
        <button type="submit" className="bg-white text-black px-4 py-2 uppercase font-bold">Upload Reel</button>
      </form>
    </div>
  );
}
