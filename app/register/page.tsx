"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Sparkles,
  Mail,
  Lock,
  ArrowLeft,
  Loader2,
  User,
  Phone,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Crown,
  Zap,
  Gift,
} from "lucide-react"
import Link from "next/link"
import { GoogleIcon } from "@/components/icons/google-icon"
import { registerUser, authenticateWithGoogle, generateToken, saveSession } from "@/lib/auth"
import type { AuthSession, PlanType } from "@/lib/auth"
import logo from "../../public/logo.png"
import Image from "next/image"

interface FormData {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  selectedPlan: PlanType
  agreeToTerms: boolean
  agreeToPrivacy: boolean
  agreeToMarketing: boolean
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
  terms?: string
  general?: string
}

const plans = [
  {
    id: "free" as PlanType,
    name: "フリー",
    price: "¥0",
    icon: <Gift className="w-5 h-5" />,
    color: "border-gray-300 hover:border-gray-400",
    features: ["ランキング検索（月3回）", "競合詳細検索（月3回）", "基本的な商品情報表示"],
  },
  {
    id: "standard" as PlanType,
    name: "スタンダード",
    price: "¥2,480",
    icon: <Zap className="w-5 h-5" />,
    color: "border-blue-300 hover:border-blue-400",
    popular: true,
    features: [
      "ランキング検索（月30回）",
      "競合詳細検索（月30回）",
      "検索履歴（5日間保存）",
      "リアルタイム検索（月10回）",
    ],
  },
  {
    id: "pro" as PlanType,
    name: "プロ",
    price: "¥3,480",
    icon: <Crown className="w-5 h-5" />,
    color: "border-purple-300 hover:border-purple-400",
    features: [
      "ランキング検索（無制限）",
      "競合詳細検索（無制限）",
      "検索履歴（無制限保存）",
      "リアルタイム検索（無制限）",
    ],
  },
]

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    selectedPlan: "free",
    agreeToTerms: false,
    agreeToPrivacy: false,
    agreeToMarketing: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!window.google && typeof window !== "undefined") {
      const script = document.createElement("script")
      script.src = "https://accounts.google.com/gsi/client"
      script.async = true
      script.defer = true
      document.body.appendChild(script)
    }
  }, [])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "お名前を入力してください"
    } else if (formData.name.length < 2) {
      newErrors.name = "お名前は2文字以上で入力してください"
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = "メールアドレスを入力してください"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "有効なメールアドレスを入力してください"
    }

    // Phone validation (Japanese format)
    const phoneRegex = /^(\+81|0)[0-9]{10,11}$/
    if (!formData.phone) {
      newErrors.phone = "電話番号を入力してください"
    } else if (!phoneRegex.test(formData.phone.replace(/-/g, ""))) {
      newErrors.phone = "有効な電話番号を入力してください"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "パスワードを入力してください"
    } else if (formData.password.length < 8) {
      newErrors.password = "パスワードは8文字以上で入力してください"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "パスワードは大文字、小文字、数字を含む必要があります"
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "パスワード確認を入力してください"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "パスワードが一致しません"
    }

    // Terms validation
    if (!formData.agreeToTerms || !formData.agreeToPrivacy) {
      newErrors.terms = "利用規約とプライバシーポリシーに同意してください"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean | PlanType) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          plan: formData.selectedPlan,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "登録に失敗しました")
      // Store JWT and user info
      localStorage.setItem("auth-token", data.token)
      localStorage.setItem("auth-user", JSON.stringify(data.user))
      setSuccess(true)
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 2000)
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : "登録に失敗しました" })
    } finally {
      setIsLoading(false)
    }
  }

  let googleSignInInProgress = false // outside the function



    // Load Google script only once
    useEffect(() => {
      const existingScript = document.getElementById("google-client-script")
      if (existingScript) return
  
      const script = document.createElement("script")
      script.src = "https://accounts.google.com/gsi/client"
      script.async = true
      script.defer = true
      script.id = "google-client-script"
      document.head.appendChild(script)
    }, [])
  
    const handleGoogleSignUp = () => {
      if (googleSignInInProgress) return
      googleSignInInProgress = true
      setIsGoogleLoading(true)
      setErrors({})
  
      if (typeof window === "undefined" || !window.google) {
        setErrors({ general: "Googleライブラリの読み込みに失敗しました" })
        setIsGoogleLoading(false)
        googleSignInInProgress = false
        return
      }
  
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: async (response: { credential: string }) => {
          try {
            if (!response.credential) throw new Error("Google認証に失敗しました")
  
            const res = await fetch("/api/auth/google", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                idToken: response.credential,
                plan: formData.selectedPlan,
              }),
            })
  
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Google認証に失敗しました")
  
            localStorage.setItem("auth-token", data.token)
            localStorage.setItem("auth-user", JSON.stringify(data.user))
            window.location.href = "/dashboard"
          } catch (err) {
            console.error(err)
            setErrors({ general: "Google認証に失敗しました" })
          } finally {
            setIsGoogleLoading(false)
            googleSignInInProgress = false
          }
        },
      })
  
      // Trigger the one-tap or popup
      window.google.accounts.id.prompt()
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
        className="w-full max-w-2xl relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <motion.div
              className="inline-flex items-center space-x-2 mb-6 hover:scale-105 transition-transform"
              whileHover={{ scale: 1.05 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600">ログインに戻る</span>
            </motion.div>
          </Link>

          <motion.div
            className="flex items-center justify-center space-x-3 mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Image src={logo} alt="desc" width={100}/>
          </motion.div>
          <motion.div
            className="flex items-center justify-center space-x-3 mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
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
            新しいアカウントを作成
          </motion.p>
          <motion.p
            className="text-sm text-blue-600 font-medium mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            7日間無料トライアル付き
          </motion.p>
        </div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            {/* Google Sign Up */}
            <motion.div className="mb-6" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleGoogleSignUp}
                disabled={isGoogleLoading}
                variant="outline"
                className="w-full h-12 border-gray-200 hover:bg-gray-50 bg-transparent"
              >
                {isGoogleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <div className="flex items-center space-x-3">
                    <GoogleIcon className="w-5 h-5" />
                    <span>Googleで登録</span>
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-800">{errors.general}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {/* Main Form Layout - 2 Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Personal Information */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name Field */}
                    <div className="space-y-6">
                      <Label htmlFor="name" className="text-gray-700 font-medium">
                        お名前 <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className={`pl-10 h-12 ${errors.name ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"} focus:ring-blue-500`}
                          placeholder="山田太郎"
                        />
                      </div>
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-600"
                        >
                          {errors.name}
                        </motion.p>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-6">
                      <Label htmlFor="phone" className="text-gray-700 font-medium">
                        電話番号 <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className={`pl-10 h-12 ${errors.phone ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"} focus:ring-blue-500`}
                          placeholder="090-1234-5678"
                        />
                      </div>
                      {errors.phone && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-600"
                        >
                          {errors.phone}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-5">
                    <Label htmlFor="email" className="text-gray-700 font-medium relative">
                      メールアドレス <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`pl-10 h-12 ${errors.email ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"} focus:ring-blue-500`}
                        placeholder="your@email.com"
                      />
                    </div>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-600"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>

                  {/* Password Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Password Field */}
                    <div className="space-y-10">
                      <Label htmlFor="password" className="text-gray-700 font-medium relative">
                        パスワード <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          className={`pl-10 pr-10 h-12 ${errors.password ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"} focus:ring-blue-500`}
                          placeholder="8文字以上"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-600"
                        >
                          {errors.password}
                        </motion.p>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-10">
                      <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                        パスワード確認 <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          className={`pl-10 pr-10 h-12 ${errors.confirmPassword ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"} focus:ring-blue-500`}
                          placeholder="パスワードを再入力"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-600"
                        >
                          {errors.confirmPassword}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-10">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                        className="mt-1"
                      />
                      <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                        <Link href="/terms" className="text-blue-600 hover:text-blue-700 underline">
                          利用規約
                        </Link>
                        に同意します <span className="text-red-500">*</span>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="privacy"
                        checked={formData.agreeToPrivacy}
                        onCheckedChange={(checked) => handleInputChange("agreeToPrivacy", checked as boolean)}
                        className="mt-1"
                      />
                      <Label htmlFor="privacy" className="text-sm text-gray-600 leading-relaxed">
                        <Link href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
                          プライバシーポリシー
                        </Link>
                        に同意します <span className="text-red-500">*</span>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="marketing"
                        checked={formData.agreeToMarketing}
                        onCheckedChange={(checked) => handleInputChange("agreeToMarketing", checked as boolean)}
                        className="mt-1"
                      />
                      <Label htmlFor="marketing" className="text-sm text-gray-600 leading-relaxed">
                        マーケティング情報の受信に同意します（任意）
                      </Label>
                    </div>

                    {errors.terms && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-600"
                      >
                        {errors.terms}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Right Column - Plan Selection */}
                <div className="lg:col-span-1">
                  <div className="sticky top-8">
                    <div className="space-y-4">
                      <Label className="text-gray-700 font-medium text-lg">プランを選択</Label>
                      <RadioGroup
                        value={formData.selectedPlan}
                        onValueChange={(value) => handleInputChange("selectedPlan", value as PlanType)}
                        className="space-y-3"
                      >
                        {plans.map((plan) => (
                          <div key={plan.id} className="relative">
                            {plan.popular && (
                              <div className="absolute -top-2 -right-2 z-10">
                                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">人気</span>
                              </div>
                            )}
                            <Label
                              htmlFor={plan.id}
                              className={`cursor-pointer block p-4 rounded-lg border-2 transition-all ${
                                formData.selectedPlan === plan.id
                                  ? "border-blue-500 bg-blue-50"
                                  : plan.color + " bg-white hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <RadioGroupItem value={plan.id} id={plan.id} className="mt-1" />
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    {plan.icon}
                                    <span className="font-semibold text-sm">{plan.name}</span>
                                  </div>
                                  <div className="text-lg font-bold text-blue-600 mb-3">{plan.price}</div>
                                  <ul className="text-xs text-gray-600 space-y-1">
                                    {plan.features.map((feature, i) => (
                                      <li key={i} className="flex items-start">
                                        <span className="text-green-500 mr-1">•</span>
                                        <span>{feature}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>アカウント作成中...</span>
                    </div>
                  ) : (
                    "アカウントを作成"
                  )}
                </Button>
              </motion.div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600">
                すでにアカウントをお持ちの方は{" "}
                <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                  ログイン
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}