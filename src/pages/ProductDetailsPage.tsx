import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const docSnap = await getDoc(doc(db, 'products', id));
      if (docSnap.exists()) setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="p-8 text-center">Loading product details...</div>;

  const hasValidPrice = typeof product.offerPrice === 'number' && product.offerPrice > 0;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return alert('Please select size and color');
    addToCart({ productId: product.id, product, size: selectedSize, color: selectedColor, quantity });
    alert('Added to cart!');
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      <img src={product.images[0] || '/placeholder.jpg'} alt={product.title} className="w-full h-80 object-cover rounded-3xl" />
      <div className="mt-6 space-y-4">
        <h1 className="text-2xl font-bold tracking-tighter uppercase">{product.title}</h1>
        {hasValidPrice ? (
          <p className="text-2xl font-bold text-emerald-600">
            ₹{product.offerPrice} 
            {product.price > product.offerPrice && <span className="line-through text-gray-400 text-sm ml-2 font-normal">₹{product.price}</span>}
          </p>
        ) : (
          <p className="text-red-500">Price unavailable</p>
        )}
        <p className="text-gray-600">{product.description}</p>
        
        <div>
          <p className="text-sm font-bold uppercase mb-2">Sizes</p>
          <div className="flex gap-2">
            {product.sizes?.map(size => (
              <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 border rounded-full ${selectedSize === size ? 'bg-black text-white' : ''}`}>{size}</button>
            ))}
          </div>
        </div>
        
        <div>
          <p className="text-sm font-bold uppercase mb-2">Colors</p>
          <div className="flex gap-2">
            {product.colors?.map(color => (
              <button key={color} onClick={() => setSelectedColor(color)} className={`px-4 py-2 border rounded-full ${selectedColor === color ? 'bg-black text-white' : ''}`}>{color}</button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button onClick={handleAddToCart} disabled={!hasValidPrice} className="flex-1 bg-black text-white py-3 rounded-full font-bold uppercase tracking-widest disabled:opacity-50">Add to Cart</button>
          <button onClick={() => { handleAddToCart(); navigate('/cart'); }} disabled={!hasValidPrice} className="flex-1 bg-gray-100 py-3 rounded-full font-bold uppercase tracking-widest disabled:opacity-50">Buy Now</button>
        </div>
      </div>
    </div>
  );
}
