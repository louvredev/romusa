import { createContext } from "react"
import { type User } from "firebase/auth"

export type AuthContextValue = {
  user: User | null
  isAdmin: boolean
  loading: boolean
  isLoggingOut: boolean
  beginLogout: () => void
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAdmin: false,
  loading: true,
  isLoggingOut: false,
  beginLogout: () => {},
})