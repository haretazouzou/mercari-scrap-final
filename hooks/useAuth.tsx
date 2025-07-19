"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getSession, clearSession } from "@/lib/auth"
import type { AuthSession, User } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  session: AuthSession | null
  isLoading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentSession = getSession()
    setSession(currentSession)
    setIsLoading(false)
  }, [])

  const logout = () => {
    clearSession()
    setSession(null)
    window.location.href = "/"
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        session,
        isLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
