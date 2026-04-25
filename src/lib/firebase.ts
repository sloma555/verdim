import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyATavqsht9XbQqBWoFhIo7Ss-9ouXS3H88",
  authDomain: "cashflow-65449.firebaseapp.com",
  projectId: "cashflow-65449",
  storageBucket: "cashflow-65449.firebasestorage.app",
  messagingSenderId: "218735230538",
  appId: "1:218735230538:web:ac01e7dbc019a26207b0b3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;

