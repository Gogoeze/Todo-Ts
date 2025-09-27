import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDYf0FlHNVNeCz1Ov5vwEo-4QtJPv5R3jg",
  authDomain: "todoauth-cf7f6.firebaseapp.com",
  projectId: "todoauth-cf7f6",
  storageBucket: "todoauth-cf7f6.firebasestorage.app",
  messagingSenderId: "546707139023",
  appId: "1:546707139023:web:4073e76b0ea554eb3e0aba",
  measurementId: "G-4C1TXT00B4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);