import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBdOe1reWK4chEBuc5OgbM5RFk_0Hrw_jg",
  authDomain: "saanjh-a38e4.firebaseapp.com",
  projectId: "saanjh-a38e4",
  storageBucket: "saanjh-a38e4.firebasestorage.app",
  messagingSenderId: "169562926024",
  appId: "1:169562926024:web:c7ea8d2e7f7b3ad0bfaefd",
  measurementId: "G-3XPQ5VR334"

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);