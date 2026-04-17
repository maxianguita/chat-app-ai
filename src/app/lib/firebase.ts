import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCeMBq5l-AxPTwFXlZvCM_pxcT8X-jBKh0",
  authDomain: "chat-app-d6428.firebaseapp.com",
  projectId: "chat-app-d6428",
  storageBucket: "chat-app-d6428.firebasestorage.app",
  messagingSenderId: "714325978324",
  appId: "1:714325978324:web:70503777f92c8371c41f41",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);