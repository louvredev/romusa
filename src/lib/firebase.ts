import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyBltmrbYU7RUC_OyjMia6h6V4iTYtb9vKQ",
  authDomain: "romusa-f5668.firebaseapp.com",
  databaseURL: "https://romusa-f5668-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "romusa-f5668",
  storageBucket: "romusa-f5668.firebasestorage.app",
  messagingSenderId: "415864268606",
  appId: "1:415864268606:web:0790df16b1e86d3473ee6f"
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)