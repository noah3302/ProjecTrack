// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHdUJ6BTTZVv6G-C51k2qLe-J7yufw7JA",
  authDomain: "projectrack-5dced.firebaseapp.com",
  projectId: "projectrack-5dced",
  storageBucket: "projectrack-5dced.appspot.com",
  messagingSenderId: "474556335812",
  appId: "1:474556335812:web:475e7432e173fee68eeb91",
  measurementId: "G-NT7SGELYTZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
