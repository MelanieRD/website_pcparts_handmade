// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLAl6SlPWHaLGGqKqwCKa2Rk2WUks6iUQ",
  authDomain: "cohamishop.firebaseapp.com",
  databaseURL: "https://cohamishop-default-rtdb.firebaseio.com",
  projectId: "cohamishop",
  storageBucket: "cohamishop.firebasestorage.app",
  messagingSenderId: "381973763751",
  appId: "1:381973763751:web:47a8dd7276f5df5683ad82"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
