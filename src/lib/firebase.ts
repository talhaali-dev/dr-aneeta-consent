import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "gen-lang-client-0553650423",
  appId: "1:420025231181:web:bb4e2c6c684adb7df97904",
  apiKey: "AIzaSyAbuukQOGAr_QqASkRBhkBpGMrrO6zMQok",
  authDomain: "gen-lang-client-0553650423.firebaseapp.com",
  storageBucket: "gen-lang-client-0553650423.firebasestorage.app",
  messagingSenderId: "420025231181"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-f560822a-f7ae-4a1a-bc4b-709e426ea278");
