"use client"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  name: string
  email: string
  plan: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // ✅ Restore from localStorage
    const storedUser = localStorage.getItem("auth-user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Invalid stored user")
        localStorage.removeItem("auth-user")
      }
    }
    setIsLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem("auth-user")
    localStorage.removeItem("auth-token")
    setUser(null)
    window.location.href = "/"
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
