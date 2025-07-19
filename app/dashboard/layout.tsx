"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("auth-token")
      if (!token) {
        router.replace("/login")
        return
      }
      const res = await fetch("/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        router.replace("/login")
        return
      }
      setLoading(false)
    }
    checkAuth()
  }, [router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">認証中...</div>
  }
  return <>{children}</>
} 