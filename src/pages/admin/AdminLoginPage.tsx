import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists() && userDoc.data().role === 'admin') {
        navigate('/admin');
      } else {
        alert('Access denied: Not an admin.');
      }
    } catch (e) {
      alert('Login failed: ' + e);
    }
  };

  return (
    <div className="p-8 max-w-sm mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Admin Login</h1>
      <input type="email" onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full border p-2" />
      <input type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full border p-2" />
      <button onClick={handleLogin} className="w-full bg-black text-white py-2">Login</button>
    </div>
  );
}
