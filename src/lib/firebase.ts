import { initializeApp } from "firebase/app"
import {
  getAuth,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import { getDatabase } from "firebase/database"

// ⚠️ GANTI dengan config Firebase project kamu yang sudah ada
const firebaseConfig = {
  apiKey: "AIzaSyBltmrbYU7RUC_OyjMia6h6V4iTYtb9vKQ",
  authDomain: "romusa-f5668.firebaseapp.com",
  databaseURL: "https://romusa-f5668-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "romusa-f5668",
  storageBucket: "romusa-f5668.firebasestorage.app",
  messagingSenderId: "415864268606",
  appId: "1:415864268606:web:0790df16b1e86d3473ee6f"
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getDatabase(app)

export async function loginAdmin(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

export async function loginAnonymously() {
  const result = await signInAnonymously(auth)
  return result.user
}

export async function logout() {
  await signOut(auth)
}

export function listenAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}