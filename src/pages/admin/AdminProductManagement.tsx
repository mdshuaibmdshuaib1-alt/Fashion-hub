import { useState, useEffect } from 'react';
import { db, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from '../../lib/firebase';
import { Product } from '../../types';

export default function AdminProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({ title: '', price: 0, offerPrice: 0, category: 'Tops', active: true });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (s) => 
      setProducts(s.docs.map(d => ({id: d.id, ...d.data()} as Product)))
    );
    return unsub;
  }, []);

  const handleAdd = async () => {
    await addDoc(collection(db, 'products'), { ...formData, images: [], sizes: [], colors: [], stock: 0 });
    alert('Product Added');
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Admin Product Management</h2>
      <div className="bg-white p-4 rounded shadow space-y-2">
        <input placeholder="Title" onChange={e => setFormData({...formData, title: e.target.value})} className="border p-2 w-full" />
        <button onClick={handleAdd} className="bg-black text-white px-4 py-2">Add Product</button>
      </div>
      <div className="grid gap-2">
        {products.map(p => (
          <div key={p.id} className="flex justify-between items-center p-2 border">
            <span>{p.title} - ₹{p.offerPrice}</span>
            <button onClick={() => deleteDoc(doc(db, 'products', p.id))} className="text-red-500">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
