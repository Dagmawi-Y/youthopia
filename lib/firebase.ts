import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCtaxacz9QBheAhgNWqA0yYtih7cyjqrwA",
  authDomain: "youthopia-c1e96.firebaseapp.com",
  projectId: "youthopia-c1e96",
  storageBucket: "youthopia-c1e96.firebasestorage.app",
  messagingSenderId: "463959657295",
  appId: "1:463959657295:web:577b25b774192e50f8933a",
  measurementId: "G-6X8G46JSBM",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
export { analytics };
