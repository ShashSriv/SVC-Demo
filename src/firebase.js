// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNPJQvcHLQV-Et94m8N1WKDQoZ8LZF-x0",
  authDomain: "svc-demo-facab.firebaseapp.com",
  projectId: "svc-demo-facab",
  storageBucket: "svc-demo-facab.appspot.com",
  messagingSenderId: "19773977152",
  appId: "1:19773977152:web:fa8ba16cdf2a305aeea5a5",
  measurementId: "G-WJ6F2DKGTY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);