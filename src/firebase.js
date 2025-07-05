// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyBkY9_w1qKX7PuYiRZBFBotkV-ApmRuhxY",
  authDomain: "hhkt-78cca.firebaseapp.com",
  databaseURL: "https://hhkt-78cca-default-rtdb.firebaseio.com",
  projectId: "hhkt-78cca",
  storageBucket: "hhkt-78cca.appspot.com",
  messagingSenderId: "772878553632",
  appId: "1:772878553632:web:3cdad6270cfcd6454e6245",
  measurementId: "G-6Q0GQ5GYG0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { db, storage };

