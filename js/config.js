// js/config.js — Configuration Firebase originale du projet L'Héritage d'Anubis
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyCjhLWYOiBT6wSkXrbCNjtweNhDWysZzqg",
  authDomain: "heritage-anubis.firebaseapp.com",
  projectId: "heritage-anubis",
  storageBucket: "heritage-anubis.firebasestorage.app",
  messagingSenderId: "275108250979",
  appId: "1:275108250979:web:19414505c45876d22dbf56"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
