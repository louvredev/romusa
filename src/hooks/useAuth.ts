import { useContext } from "react"
import { AuthContext } from "@/contexts/auth-context-instance"

export function useAuth() {
  return useContext(AuthContext)
}