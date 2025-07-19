"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Crown, Zap, Gift, Check, Star, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import logo from "../../../public/logo.png"
import Image from "next/image"

interface Plan {
  id: string
  name: string
  price: number
  originalPrice?: number
  features: string[]
  popular?: boolean
  icon: React.ReactNode
  color: string
}

const plans: Plan[] = [
  {
    id: "free",
    name: "フリー",
    price: 0,
    features: [
      "ランキング検索（月3回まで）",
      "競合詳細検索（月3回まで）",
    ],
    icon: <Gift className="w-6 h-6" />,
    color: "from-gray-400 to-gray-600",
  },
  {
    id: "standard",
    name: "スタンダード",
    price: 2480,
    originalPrice: 3480,
    features: [
      "ランキング検索（月30回まで）",
      "競合詳細検索（月30回まで）",
      "検索履歴（いいね・お気に入り）（保存期間5日間）",
      "リアルタイム検索（月10回まで）",
    ],
    popular: true,
    icon: <Zap className="w-6 h-6" />,
    color: "from-blue-500 to-purple-600",
  },
  {
    id: "pro",
    name: "プロ",
    price: 3480,
    originalPrice: 4480,
    features: [
      "ランキング検索（無制限）",
      "競合詳細検索（無制限）",
      "検索履歴（いいね・お気に入り）（無制限保存）",
      "リアルタイム検索（無制限）",
    ],
    icon: <Crown className="w-6 h-6" />,
    color: "from-purple-500 to-pink-600",
  },
]

export default function PlanPage() {
  const { user, isLoading } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<string>("")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = "/"
    }
  }, [user, isLoading])

  const handlePlanUpdate = async (planId: string) => {
    setIsUpdating(true)
    // Simulate plan update
    setTimeout(() => {
      setIsUpdating(false)
      alert(`${plans.find(p => p.id === planId)?.name}プランに更新しました！`)
      window.location.href = "/dashboard"
    }, 2000)
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
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">プラン更新</h1>
              </div>
            </div>
            <Badge variant="outline" className="text-sm">
              {user.plan === "free" ? "フリー" : user.plan === "standard" ? "スタンダード" : "プロ"}プラン
            </Badge>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            最適なプランを選択してください
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            現在の{user.plan === "free" ? "フリー" : user.plan === "standard" ? "スタンダード" : "プロ"}プランから、
            より多くの機能を利用できるプランにアップグレードできます。
          </p>
        </motion.div>

        {/* Plans Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="relative"
            >
              <Card className={`p-6 h-full relative overflow-hidden flex flex-col ${
                plan.popular ? 'ring-2 ring-blue-500 shadow-lg' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
                    人気
                  </div>
                )}
                
                {/* Header Section */}
                <div className="text-center mb-6 flex-shrink-0">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${plan.color} text-white mb-4`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <span className="text-3xl font-bold text-gray-800">
                      ¥{plan.price.toLocaleString()}
                    </span>
                    {plan.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        ¥{plan.originalPrice.toLocaleString()}
                      </span>
                    )}
                    {plan.price > 0 && <span className="text-sm text-gray-600">/月</span>}
                  </div>
                  {plan.id === user.plan && (
                    <Badge variant="secondary" className="mb-4">
                      現在のプラン
                    </Badge>
                  )}
                </div>

                {/* Features Section */}
                <div className="flex-grow mb-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Button Section */}
                <div className="flex-shrink-0">
                  {plan.id === user.plan ? (
                    <Button disabled className="w-full h-12 bg-gray-300 text-gray-600">
                      現在のプラン
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handlePlanUpdate(plan.id)}
                      disabled={isUpdating}
                      className={`w-full h-12 bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-medium`}
                    >
                      {isUpdating ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>更新中...</span>
                        </div>
                      ) : (
                        plan.price === 0 ? "無料で開始" : "プランに変更"
                      )}
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="p-8 bg-white/80 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">よくある質問</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">プランの変更はいつでも可能ですか？</h4>
                <p className="text-gray-600">はい、いつでもプランを変更できます。変更は即座に反映されます。</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">解約はいつでも可能ですか？</h4>
                <p className="text-gray-600">はい、いつでも解約できます。解約後も月末まではサービスをご利用いただけます。</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">無料トライアルはありますか？</h4>
                <p className="text-gray-600">スタンダード・プロプランには7日間の無料トライアルが付いています。</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 