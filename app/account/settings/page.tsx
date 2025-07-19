"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  Trash2, 
  Loader2,
  AlertTriangle,
  CheckCircle
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import logo from "../../../public/logo.png"
import Image from "next/image"

interface FormData {
  name: string
  email: string
  phone: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function SettingsPage() {
  const { user, isLoading } = useAuth()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = "/"
    }
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }
  }, [user, isLoading])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setMessage(null)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage(null)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setMessage({ type: 'success', text: '設定が正常に更新されました' })
    }, 2000)
  }

  const handleDeleteAccount = async () => {
    if (!confirm('本当にアカウントを削除しますか？この操作は取り消せません。')) {
      return
    }

    setIsDeleting(true)
    // Simulate account deletion
    setTimeout(() => {
      setIsDeleting(false)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-session')
        window.location.href = '/'
      }
    }, 3000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <motion.header
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">ダッシュボード</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <Image src={logo} alt="Logo" width={32} height={32} />
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">アカウント設定</h1>
              </div>
            </div>
            <Badge variant="outline" className="text-sm">
              {user.plan === "free" ? "フリー" : user.plan === "standard" ? "スタンダード" : "プロ"}プラン
            </Badge>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">プロフィール情報</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  お名前
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="pl-10"
                    placeholder="お名前を入力"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  メールアドレス
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    placeholder="メールアドレスを入力"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-medium">
                  電話番号
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="pl-10"
                    placeholder="電話番号を入力"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSaving ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>保存中...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>保存</span>
                  </div>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Password Change */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-6">
              <Lock className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">パスワード変更</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-gray-700 font-medium">
                  現在のパスワード
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="currentPassword"
                    type={showPasswords ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="現在のパスワードを入力"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPasswords(!showPasswords)}
                  >
                    {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-gray-700 font-medium">
                    新しいパスワード
                  </Label>
                  <Input
                    id="newPassword"
                    type={showPasswords ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    placeholder="新しいパスワードを入力"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                    新しいパスワード（確認）
                  </Label>
                  <Input
                    id="confirmPassword"
                    type={showPasswords ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="新しいパスワードを再入力"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSaving ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>更新中...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4" />
                      <span>パスワード更新</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Account Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-800">アカウント管理</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">アカウント削除</h3>
                <p className="text-red-700 text-sm mb-4">
                  アカウントを削除すると、すべてのデータが完全に削除され、復元することはできません。
                </p>
                <Button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>削除中...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Trash2 className="w-4 h-4" />
                      <span>アカウントを削除</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Message Display */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className={`p-4 ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center space-x-3">
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-medium ${
                  message.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {message.text}
                </span>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
} 