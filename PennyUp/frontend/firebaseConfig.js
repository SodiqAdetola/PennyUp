// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCB-V87wSWz5P_Wnz2O6qQ7n_u8GJ0EGoQ",
  authDomain: "pennyup-aade4.firebaseapp.com",
  projectId: "pennyup-aade4",
  storageBucket: "pennyup-aade4.firebasestorage.app",
  messagingSenderId: "329368523535",
  appId: "1:329368523535:web:1f1c0a096d90d62658647a",
  measurementId: "G-2X917YC9PS"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage)
}); 