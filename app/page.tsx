"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles, Mail, Lock, Loader2 } from "lucide-react"
import Link from "next/link"
import { GoogleIcon } from "@/components/icons/google-icon"
import { Separator } from "@/components/ui/separator"
import { authenticateUser, authenticateWithGoogle, generateToken, saveSession } from "@/lib/auth"
import type { AuthSession } from "@/lib/auth"
import logo from "../public/logo.png"
import Image from "next/image"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const user = await authenticateUser(email, password)

      if (user) {
        const token = generateToken(user)
        const session: AuthSession = {
          user,
          token,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }

        saveSession(session)
        window.location.href = "/dashboard"
      } else {
        setError("メールアドレスまたはパスワードが正しくありません")
      }
    } catch (error) {
      setError("ログインに失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      const user = await authenticateWithGoogle()
      const token = generateToken(user)
      const session: AuthSession = {
        user,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }

      saveSession(session)
      window.location.href = "/dashboard"
    } catch (error) {
      setError("Google認証に失敗しました")
    } finally {
      setIsGoogleLoading(false)
    }
  }

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
          <motion.div
            className="flex items-center justify-center space-x-3 mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Image src={logo} alt="desc" width={100}/>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              セラーナビ
            </h1>
          </motion.div>

          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            輸入商品分析ツールにログイン
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
                  <Checkbox id="remember" checked={rememberMe} onCheckedChange={setRememberMe} />
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
