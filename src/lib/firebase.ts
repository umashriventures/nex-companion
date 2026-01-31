import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOMjtDh4fTb60-PwScH1eenxPoP8LXPsQ",
  authDomain: "neuralexchange-b6b7f.firebaseapp.com",
  projectId: "neuralexchange-b6b7f",
  storageBucket: "neuralexchange-b6b7f.firebasestorage.app",
  messagingSenderId: "466469896602",
  appId: "1:466469896602:web:f216c3f9d06f0356a23a23",
  measurementId: "G-NEH4DBE7WB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
