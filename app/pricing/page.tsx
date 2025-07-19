"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, ArrowLeft, Crown, Zap } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: "フリー",
      price: 0,
      annualPrice: 0,
      icon: <Sparkles className="w-6 h-6" />,
      color: "from-gray-500 to-gray-600",
      features: ["ランキング検索（月3回）", "競合詳細検索（月3回）", "基本的な商品情報表示", "コミュニティサポート"],
      limitations: ["検索履歴保存なし", "リアルタイム検索なし", "詳細分析機能なし"],
    },
    {
      name: "スタンダード",
      price: 2480,
      annualPrice: 24800, // 2ヶ月分お得
      icon: <Zap className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      popular: true,
      features: [
        "ランキング検索（月30回）",
        "競合詳細検索（月30回）",
        "検索履歴（5日間保存）",
        "リアルタイム検索（月10回）",
        "価格トレンド分析",
        "メールサポート",
      ],
      limitations: ["長期履歴保存なし", "高度な分析機能制限"],
    },
    {
      name: "プロ",
      price: 3480,
      annualPrice: 34800, // 2ヶ月分お得
      icon: <Crown className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
      features: [
        "ランキング検索（無制限）",
        "競合詳細検索（無制限）",
        "検索履歴（無制限保存）",
        "リアルタイム検索（無制限）",
        "高度な分析ダッシュボード",
        "API アクセス",
        "優先サポート",
        "カスタムレポート",
      ],
      limitations: [],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <motion.header
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">ホーム</span>
                </Button>
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">料金プラン</h1>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">あなたに最適なプランを選択</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            7日間の無料トライアルで全機能をお試しいただけます。 いつでもプランの変更・キャンセルが可能です。
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${!isAnnual ? "text-gray-900 font-medium" : "text-gray-500"}`}>月額</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? "text-gray-900 font-medium" : "text-gray-500"}`}>
              年額
              <Badge variant="secondary" className="ml-2 text-xs">
                2ヶ月お得
              </Badge>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">人気No.1</Badge>
                </div>
              )}

              <Card
                className={`p-6 sm:p-8 h-full ${
                  plan.popular ? "ring-2 ring-blue-500 shadow-xl scale-105" : "shadow-lg hover:shadow-xl"
                } transition-all duration-300 bg-white/80 backdrop-blur-sm`}
              >
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${plan.color} text-white mb-4`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                      ¥{isAnnual ? Math.floor(plan.annualPrice / 12).toLocaleString() : plan.price.toLocaleString()}
                    </span>
                    <span className="text-gray-600 ml-1">/月</span>
                    {isAnnual && plan.price > 0 && (
                      <div className="text-sm text-gray-500 mt-1">年額: ¥{plan.annualPrice.toLocaleString()}</div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">含まれる機能</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start space-x-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">制限事項</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, i) => (
                          <li key={i} className="flex items-start space-x-3">
                            <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-gray-400 rounded-full mx-auto mt-1.5" />
                            </div>
                            <span className="text-sm text-gray-500">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className={`w-full py-3 ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        : plan.name === "プロ"
                          ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                          : "bg-gray-600 hover:bg-gray-700"
                    } text-white font-semibold`}
                  >
                    {plan.name === "フリー" ? "無料で始める" : "7日間無料トライアル"}
                  </Button>
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <Card className="p-6 sm:p-8 bg-white/80 backdrop-blur-sm">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">よくある質問</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">無料トライアルについて</h4>
                <p className="text-sm text-gray-600">
                  全プランで7日間の無料トライアルをご利用いただけます。期間中はプロプランの全機能をお試しいただけます。
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">プラン変更について</h4>
                <p className="text-sm text-gray-600">
                  いつでもプランの変更・キャンセルが可能です。変更は次回請求日から適用されます。
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">支払い方法</h4>
                <p className="text-sm text-gray-600">
                  クレジットカード（Visa、MasterCard、JCB、American Express）でのお支払いが可能です。
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">データの保存期間</h4>
                <p className="text-sm text-gray-600">
                  プランによって検索履歴の保存期間が異なります。プロプランでは無制限で保存されます。
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
