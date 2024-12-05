// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtaxacz9QBheAhgNWqA0yYtih7cyjqrwA",
  authDomain: "youthopia-c1e96.firebaseapp.com",
  projectId: "youthopia-c1e96",
  storageBucket: "youthopia-c1e96.firebasestorage.app",
  messagingSenderId: "463959657295",
  appId: "1:463959657295:web:577b25b774192e50f8933a",
  measurementId: "G-6X8G46JSBM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
