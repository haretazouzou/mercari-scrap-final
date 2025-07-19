// Simplified auth utilities for Next.js environment
export type PlanType = "free" | "standard" | "pro"

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  plan: PlanType
  trialEndsAt?: Date
  createdAt: Date
}

export interface AuthSession {
  user: User
  token: string
  expiresAt: Date
}

// Mock user database
const mockUsers: User[] = [
  {
    id: "1",
    name: "テストユーザー",
    email: "test@example.com",
    plan: "pro",
    createdAt: new Date(),
  },
]

// Simple password validation (for demo purposes)
export const validatePassword = (password: string): boolean => {
  return password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
}

// Simple email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Generate simple token (for demo - in production use proper JWT)
export const generateToken = (user: User): string => {
  const payload = {
    userId: user.id,
    email: user.email,
    plan: user.plan,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  }
  return btoa(JSON.stringify(payload))
}

// Verify simple token
export const verifyToken = (token: string): { userId: string; email: string; plan: string } | null => {
  try {
    const payload = JSON.parse(atob(token))
    if (payload.exp < Date.now()) {
      return null // Token expired
    }
    return {
      userId: payload.userId,
      email: payload.email,
      plan: payload.plan,
    }
  } catch {
    return null
  }
}

// Get trial end date
export const getTrialEndDate = (): Date => {
  const now = new Date()
  now.setDate(now.getDate() + 7)
  return now
}

// Mock authentication functions
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // For demo, accept any valid email/password combination
  if (validateEmail(email) && password.length > 0) {
    let user = mockUsers.find((u) => u.email === email)
    if (!user) {
      // Create new user for demo
      user = {
        id: Date.now().toString(),
        name: email.split("@")[0],
        email,
        plan: "free",
        trialEndsAt: getTrialEndDate(),
        createdAt: new Date(),
      }
      mockUsers.push(user)
    }
    return user
  }
  return null
}

export const registerUser = async (userData: {
  name: string
  email: string
  phone: string
  password: string
  plan: PlanType
}): Promise<User | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Check if user already exists
  if (mockUsers.find((u) => u.email === userData.email)) {
    throw new Error("このメールアドレスは既に登録されています")
  }

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    plan: userData.plan,
    trialEndsAt: getTrialEndDate(),
    createdAt: new Date(),
  }

  mockUsers.push(newUser)
  return newUser
}

export const authenticateWithGoogle = async (): Promise<User> => {
  // Simulate Google OAuth
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const googleUser = {
    id: "google_" + Date.now(),
    name: "Google ユーザー",
    email: "google.user@example.com",
    plan: "free" as const,
    trialEndsAt: getTrialEndDate(),
    createdAt: new Date(),
  }

  // Check if user exists, if not create new one
  let user = mockUsers.find((u) => u.email === googleUser.email)
  if (!user) {
    mockUsers.push(googleUser)
    user = googleUser
  }

  return user
}

// Local storage helpers for client-side session management
export const saveSession = (session: AuthSession): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth-session", JSON.stringify(session))
  }
}

export const getSession = (): AuthSession | null => {
  if (typeof window !== "undefined") {
    const sessionData = localStorage.getItem("auth-session")
    if (sessionData) {
      const session = JSON.parse(sessionData)
      // Check if session is expired
      if (new Date(session.expiresAt) > new Date()) {
        return session
      } else {
        clearSession()
      }
    }
  }
  return null
}

export const clearSession = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth-session")
  }
}

export const hashPassword = async (password: string): Promise<string> => {
  // In a real application, use a proper hashing algorithm like bcrypt
  // For this example, we'll just use a simple base64 encoding
  return btoa(password)
}
