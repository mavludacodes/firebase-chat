import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-bd9e1.firebaseapp.com",
  projectId: "reactchat-bd9e1",
  storageBucket: "reactchat-bd9e1.appspot.com",
  messagingSenderId: "123694220976",
  appId: "1:123694220976:web:042aec568a54629900dd75",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
