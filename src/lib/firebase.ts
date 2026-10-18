import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAXANFgsvy8lmcabR5hcS1",
  authDomain: "fashion-pwa.firebaseapp.com",
  projectId: "fashion-pwa",
  storageBucket: "fashion-pwa.appspot.com",
  messagingSenderId: "679133566871",
  appId: "1:679133566871:web:5869fb1ca4"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export * from 'firebase/auth';
export * from 'firebase/firestore';
export * from 'firebase/storage';
