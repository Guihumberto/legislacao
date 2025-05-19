// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithRedirect, signInWithPopup, getRedirectResult, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyXu5-p_QVvc_OZ0l0zd8eYsyAAKzpq7s",
  authDomain: "leges-estudodalei.firebaseapp.com",
  projectId: "leges-estudodalei",
  storageBucket: "leges-estudodalei.firebasestorage.app",
  messagingSenderId: "879627460563",
  appId: "1:879627460563:web:f114fe85ea441884cc9926"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const db = getFirestore(app);
const messaging = getMessaging(app);

export { auth, googleProvider, signInWithRedirect, signInWithPopup, getRedirectResult, onAuthStateChanged, signOut, db, messaging };
