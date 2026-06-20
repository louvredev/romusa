import { type ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAdmin, loading, isLoggingOut } = useAuth()

  // Lagi proses logout sengaja -> jangan kelip ke /admin/login,
  // arahkan langsung ke "/" sampai auth state baru settle.
  if (isLoggingOut) {
    return <Navigate to="/" replace />
  }

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}