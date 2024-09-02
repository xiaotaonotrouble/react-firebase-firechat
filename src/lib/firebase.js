// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
console.log("VITE_API_KEY:", import.meta.env.VITE_API_KEY);
console.log("VITE_TEST_VARIABLE:", import.meta.env.VITE_TEST_VARIABLE);


// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: "AIzaSyAegybgSt8N5mD8YANzuzl0hVstoLnebsk",
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "firechat-ac267.firebaseapp.com",
  projectId: "firechat-ac267",
  storageBucket: "firechat-ac267.appspot.com",
  messagingSenderId: "875025440324",
  appId: "1:875025440324:web:23ebaaccebd08f2b7e6611"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();          // login or register using this authentication
export const db = getFirestore();       // upload user info using database
export const storage = getStorage();    // Upload User image using storage
