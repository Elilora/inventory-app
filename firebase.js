// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfL97LH8YxuUsbcoOIsZf3DEI5ZA76w_I",
  authDomain: "inventory-management-d2169.firebaseapp.com",
  projectId: "inventory-management-d2169",
  storageBucket: "inventory-management-d2169.appspot.com",
  messagingSenderId: "367714253501",
  appId: "1:367714253501:web:0d5089dab8fdbc39c4d5d4",
  measurementId: "G-S8QDDX5G0B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}