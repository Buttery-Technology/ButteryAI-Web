import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD96akZfGciBle4lDQP84BYDYDKOgDwTnE",
  authDomain: "buttery-ai.firebaseapp.com",
  databaseURL: "https://buttery-ai-default-rtdb.firebaseio.com",
  projectId: "buttery-ai",
  storageBucket: "buttery-ai.firebasestorage.app",
  messagingSenderId: "931125895905",
  appId: "1:931125895905:web:f82e81bdcda8fcef504da0",
  measurementId: "G-T13EPESL1P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
