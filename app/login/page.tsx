"use client"
declare global {
  interface Window {
    google: any; // or a more specific type if available
  }
}

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { GoogleIcon } from "@/components/icons/google-icon"
import { Separator } from "@/components/ui/separator"
import { authenticateUser, authenticateWithGoogle, generateToken, saveSession } from "@/lib/auth"
import type { AuthSession } from "@/lib/auth"
import logo from "../../public/logo.png"
import Image from "next/image"
import { useEffect } from "react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [someBoolean, setSomeBoolean] = useState<boolean>(false);


  useEffect(() => {
    if (!window.google && typeof window !== "undefined") {
      const script = document.createElement("script")
      script.src = "https://accounts.google.com/gsi/client"
      script.async = true
      script.defer = true
      document.body.appendChild(script)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "ログインに失敗しました")
      // Store JWT and user info
      localStorage.setItem("auth-token", data.token)
      localStorage.setItem("auth-user", JSON.stringify(data.user))
      window.location.href = "/dashboard"
    } catch (error) {
      setError(error instanceof Error ? error.message : "ログインに失敗しました")
    } finally {
      setIsLoading(false)
    }
  }
  

  interface TokenResponse {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
  }
  
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError("");
  
    try {
      if (!window.google) throw new Error("Google API not loaded");
  
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        scope: "openid email profile",
        callback: async (response: TokenResponse) => {
          if (!response.access_token) {
            setError("Google認証に失敗しました");
            setIsGoogleLoading(false);
            return;
          }
  
          const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${response.access_token}` },
          });
  
          const userInfo = await userInfoRes.json();
  
          if (!userInfo.sub) {
            setError("Google認証に失敗しました");
            setIsGoogleLoading(false);
            return;
          }
  
          const backendRes = await fetch("/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: response.access_token }),
          });
  
          const backendData = await backendRes.json();
  
          if (!backendRes.ok) {
            throw new Error(backendData.error || "Google認証に失敗しました");
          }
  
          localStorage.setItem("auth-token", backendData.token);
          localStorage.setItem("auth-user", JSON.stringify(backendData.user));
          window.location.href = "/dashboard";
        },
      });
  
      client.requestAccessToken();
    } catch (error) {
      setError("Google認証に失敗しました");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-6">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100 rounded-full opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-100 rounded-full opacity-10"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
  {/* Back to Home */}
  <Link href="/">
    <motion.div
      className="inline-flex items-center space-x-2 mb-6 hover:scale-105 transition-transform"
      whileHover={{ scale: 1.05 }}
    >
      <ArrowLeft className="w-5 h-5 text-gray-600" />
      <span className="text-gray-600">ホームに戻る</span>
    </motion.div>
  </Link>

  {/* Logo - Separate Block */}
  <motion.div
    className="w-full flex justify-center mb-3"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.1 }}
  >
    <div className="block">
      <Image src={logo} alt="Logo" width={100} height={100} />
    </div>
  </motion.div>

  {/* Title - Separate Block */}
  <motion.div
    className="w-full flex justify-center mb-2"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.2 }}
  >
    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      セラーナビ
    </h1>
  </motion.div>

  {/* Subtitle */}
  <motion.p
    className="text-gray-600"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.4 }}
  >
    アカウントにログインしてください
  </motion.p>
</div>



        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Google Sign In */}
              <motion.div className="mb-6" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  variant="outline"
                  className="w-full h-12 border-gray-200 hover:bg-gray-50 bg-transparent"
                >
                  {isGoogleLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <div className="flex items-center space-x-3">
                      <GoogleIcon className="w-5 h-5" />
                      <span>Googleでログイン</span>
                    </div>
                  )}
                </Button>
              </motion.div>

              <div className="relative mb-6">
                <Separator />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white px-4 text-sm text-gray-500">または</span>
                </div>
              </div>
              {error && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  メールアドレス
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  パスワード
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="パスワードを入力"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setSomeBoolean(checked === true)} />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    ログイン状態を保持
                  </Label>
                </div>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                  パスワードを忘れた方
                </Link>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>ログイン中...</span>
                    </div>
                  ) : (
                    "ログイン"
                  )}
                </Button>
              </motion.div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600">
                アカウントをお持ちでない方は{" "}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  新規登録
                </Link>
              </p>
              <p className="text-center text-sm text-gray-500 mt-2">7日間無料トライアル付き</p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
