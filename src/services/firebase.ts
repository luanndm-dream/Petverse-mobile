
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyChThDJINNxXrWTiUSoKWjoqF7UH66ONcU",
  authDomain: "petverse-chatting.firebaseapp.com",
  projectId: "petverse-chatting",
  storageBucket: "petverse-chatting.appspot.com",
  messagingSenderId: "943355249739",
  appId: "1:943355249739:web:aaba9402eb06080c36f9ce",
  measurementId: "G-5T2MLV0JC5"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const realtimeDb = getDatabase(app);