import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// export const firebaseConfig = {
//   "projectId": "studio-5559843711-3d231",
//   "appId": "1:686111410503:web:9ff384ca362924f07b6462",
//   "apiKey": "AIzaSyAPKwTvUOdId8ZbZF3RmjyUGwrz0kpXbzw",
//   "authDomain": "studio-5559843711-3d231.firebaseapp.com",
//   "measurementId": "",
//   "messagingSenderId": "686111410503"
// };

export const firebaseConfig = {
  "projectId": process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  "appId": process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  "apiKey": process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  "authDomain": process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  "measurementId": "",
  "messagingSenderId": process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  "storageBucket": process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);