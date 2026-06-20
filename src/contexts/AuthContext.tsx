import { useEffect, useRef, useState, type ReactNode } from "react"
import { type User } from "firebase/auth"
import { listenAuthState, loginAnonymously } from "@/lib/firebase"
import { AuthContext } from "@/contexts/auth-context-instance"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const loggingOutRef = useRef(false)

  useEffect(() => {
    const unsubscribe = listenAuthState((firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)

      // Kalau ini perubahan auth state akibat logout yang sengaja,
      // matikan flag-nya setelah state baru (anonymous) settle.
      if (loggingOutRef.current) {
        loggingOutRef.current = false
        setIsLoggingOut(false)
      }

      // Kalau belum ada session sama sekali, login anonymous
      // supaya guest tetap bisa baca data dari Firestore di "/".
      if (!firebaseUser) {
        loginAnonymously().catch(() => {
          // diamkan; guest tetap bisa lihat UI walau gagal anonymous auth
        })
      }
    })
    return unsubscribe
  }, [])

  // Dipanggil sebelum logout() dieksekusi, supaya ProtectedRoute
  // tahu ini logout sengaja dan tidak redirect ke /admin/login.
  const beginLogout = () => {
    loggingOutRef.current = true
    setIsLoggingOut(true)
  }

  // Admin = user yang berhasil login email/password (bukan anonymous)
  const isAdmin = !!user && !user.isAnonymous

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, isLoggingOut, beginLogout }}>
      {children}
    </AuthContext.Provider>
  )
}