import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Configuración
const firebaseConfig = {
  apiKey: "AIzaSyDmYYGRmUDEOtgbiO37l0hNfbZ0shC3cB0",
  authDomain: "gestionrestaurante-99b84.firebaseapp.com",
  projectId: "gestionrestaurante-99b84",
  storageBucket: "gestionrestaurante-99b84.firebasestorage.app",
  messagingSenderId: "436759352562",
  appId: "1:436759352562:web:5fe3e2fe0631ad38f1ac6b",
  measurementId: "G-E5D6H214L9"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Exportaciones
export { auth, db, signInWithEmailAndPassword, doc, getDoc };