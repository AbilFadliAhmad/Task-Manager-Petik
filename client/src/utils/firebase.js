// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "taskmanager-petik.firebaseapp.com",
  projectId: "taskmanager-petik",
  storageBucket: "taskmanager-petik.appspot.com",
  messagingSenderId: "373357826970",
  appId: "1:373357826970:web:1e96ca054eed915041a023"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);