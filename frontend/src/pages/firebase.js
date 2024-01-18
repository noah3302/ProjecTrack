// Importiere die Funktion, die du aus dem SDKs brauchst
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

// Die Firebase-Konfiguration der Webanwendung
// Für Firebase JS SDK ab Version 7.20.0 und später ist measurementId optional
const firebaseConfig = {
  apiKey: "AIzaSyDHdUJ6BTTZVv6G-C51k2qLe-J7yufw7JA",
  authDomain: "projectrack-5dced.firebaseapp.com",
  projectId: "projectrack-5dced",
  storageBucket: "projectrack-5dced.appspot.com",
  messagingSenderId: "474556335812",
  appId: "1:474556335812:web:475e7432e173fee68eeb91",
  measurementId: "G-NT7SGELYTZ"
};

// Firebase inizialisieren
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);