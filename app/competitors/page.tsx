"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  TrendingUp,
  Star,
  Eye,
  ChevronDown,
  ChevronUp,
  Loader2,
  ArrowLeft,
  BarChart3,
  Calendar,
  DollarSign,
} from "lucide-react"
import Link from "next/link"

interface Competitor {
  id: string
  name: string
  rating: number
  price: number
  salesCount: number
  lastSeen: string
  trend: "up" | "down" | "stable"
}

const mockCompetitors: Competitor[] = [
  { id: "1", name: "seller001", rating: 98, price: 2800, salesCount: 1250, lastSeen: "2時間前", trend: "up" },
  { id: "2", name: "seller002", rating: 85, price: 2700, salesCount: 890, lastSeen: "1時間前", trend: "down" },
  { id: "3", name: "seller003", rating: 92, price: 3200, salesCount: 2100, lastSeen: "30分前", trend: "up" },
  { id: "4", name: "seller004", rating: 88, price: 2950, salesCount: 1450, lastSeen: "3時間前", trend: "stable" },
  { id: "5", name: "seller005", rating: 95, price: 3100, salesCount: 1800, lastSeen: "1時間前", trend: "up" },
  { id: "6", name: "seller006", rating: 82, price: 2600, salesCount: 750, lastSeen: "4時間前", trend: "down" },
  { id: "7", name: "seller007", rating: 90, price: 2900, salesCount: 1350, lastSeen: "2時間前", trend: "stable" },
  { id: "8", name: "seller008", rating: 87, price: 3000, salesCount: 1100, lastSeen: "1時間前", trend: "up" },
  { id: "9", name: "seller009", rating: 93, price: 3300, salesCount: 1950, lastSeen: "45分前", trend: "up" },
  { id: "10", name: "seller010", rating: 89, price: 2850, salesCount: 1200, lastSeen: "2時間前", trend: "stable" },
]

export default function CompetitorsPage() {
  const [displayCount, setDisplayCount] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  const loadMore = () => {
    setIsLoading(true)
    setTimeout(() => {
      setDisplayCount((prev) => Math.min(prev + 10, 100))
      setIsLoading(false)
    }, 1000)
  }

  const toggleCard = (id: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedCards(newExpanded)
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case "down":
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600 bg-green-50"
      case "down":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">競合分析</h1>
            </div>
            <Badge variant="outline" className="text-sm">
              {displayCount}/100 表示中
            </Badge>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          <Card className="p-4 bg-white/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{displayCount}</div>
              <div className="text-sm text-gray-600">競合者数</div>
            </div>
          </Card>
          <Card className="p-4 bg-white/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">¥2,890</div>
              <div className="text-sm text-gray-600">平均価格</div>
            </div>
          </Card>
          <Card className="p-4 bg-white/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">89.2%</div>
              <div className="text-sm text-gray-600">平均評価</div>
            </div>
          </Card>
          <Card className="p-4 bg-white/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">1,340</div>
              <div className="text-sm text-gray-600">平均売上</div>
            </div>
          </Card>
        </motion.div>

        {/* Competitors List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <AnimatePresence>
            {mockCompetitors.slice(0, displayCount).map((competitor, index) => (
              <motion.div
                key={competitor.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Main Card Content */}
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    {/* Competitor Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{competitor.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{competitor.rating}%</span>
                        </div>
                        {getTrendIcon(competitor.trend)}
                      </div>

                      {/* Mobile-optimized info grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">価格</span>
                          <div className="font-semibold text-blue-600">¥{competitor.price.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">売上数</span>
                          <div className="font-semibold">{competitor.salesCount.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">最終確認</span>
                          <div className="font-semibold">{competitor.lastSeen}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">トレンド</span>
                          <div className={`font-semibold px-2 py-1 rounded text-xs ${getTrendColor(competitor.trend)}`}>
                            {competitor.trend === "up" ? "上昇" : competitor.trend === "down" ? "下降" : "安定"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:ml-6">
                      <Button
                        onClick={() => toggleCard(competitor.id)}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>詳細</span>
                        {expandedCards.has(competitor.id) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
                            onClick={() => setSelectedCompetitor(competitor)}
                          >
                            <BarChart3 className="w-4 h-4" />
                            <span>分析</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2">
                              <BarChart3 className="w-5 h-5" />
                              <span>{selectedCompetitor?.name} - 詳細分析</span>
                            </DialogTitle>
                          </DialogHeader>
                          {selectedCompetitor && (
                            <div className="space-y-6">
                              {/* Performance Metrics */}
                              <div className="grid grid-cols-2 gap-4">
                                <Card className="p-4">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                    <span className="font-medium">売上推移</span>
                                  </div>
                                  <div className="text-2xl font-bold text-green-600">
                                    ¥{(selectedCompetitor.price * selectedCompetitor.salesCount).toLocaleString()}
                                  </div>
                                  <div className="text-sm text-gray-500">月間推定売上</div>
                                </Card>

                                <Card className="p-4">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                    <span className="font-medium">活動状況</span>
                                  </div>
                                  <div className="text-2xl font-bold text-blue-600">95%</div>
                                  <div className="text-sm text-gray-500">アクティブ率</div>
                                </Card>
                              </div>

                              {/* Price History Chart Placeholder */}
                              <Card className="p-4">
                                <h4 className="font-medium mb-4">価格推移（過去30日）</h4>
                                <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                                  <span className="text-gray-500">チャートデータを読み込み中...</span>
                                </div>
                              </Card>

                              {/* Sales History */}
                              <Card className="p-4">
                                <h4 className="font-medium mb-4">販売履歴</h4>
                                <div className="space-y-2">
                                  {[
                                    { date: "2025-01-15", sales: 45, price: 2800 },
                                    { date: "2025-01-14", sales: 38, price: 2850 },
                                    { date: "2025-01-13", sales: 52, price: 2750 },
                                  ].map((record, i) => (
                                    <div
                                      key={i}
                                      className="flex justify-between items-center py-2 border-b border-gray-100"
                                    >
                                      <span className="text-sm">{record.date}</span>
                                      <div className="text-right">
                                        <div className="text-sm font-medium">{record.sales}個販売</div>
                                        <div className="text-xs text-gray-500">¥{record.price.toLocaleString()}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </Card>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedCards.has(competitor.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-100 bg-gray-50 px-4 sm:px-6 py-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">最近の活動</h5>
                          <ul className="space-y-1 text-gray-600">
                            <li>• 価格を¥50値下げ（2時間前）</li>
                            <li>• 在庫を30個追加（1日前）</li>
                            <li>• 商品説明を更新（3日前）</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">競合優位性</h5>
                          <ul className="space-y-1 text-gray-600">
                            <li>• 高評価率: {competitor.rating}%</li>
                            <li>• 迅速な発送対応</li>
                            <li>• 豊富な商品バリエーション</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">注意点</h5>
                          <ul className="space-y-1 text-gray-600">
                            <li>• 価格変動が頻繁</li>
                            <li>• 在庫切れが多い</li>
                            <li>• レビュー対応が遅い</li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load More Button */}
        {displayCount < 100 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8"
          >
            <Button onClick={loadMore} disabled={isLoading} variant="outline" className="px-8 py-3 bg-transparent">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>読み込み中...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>さらに表示 ({Math.min(displayCount + 10, 100) - displayCount}件)</span>
                </div>
              )}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
