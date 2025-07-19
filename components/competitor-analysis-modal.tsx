"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, Users, DollarSign, Package, Star, ExternalLink, RefreshCw } from "lucide-react"

interface Product {
  id: string
  title: string
  price: number
  image: string
  category: string
  subcategory: string
  salesCount: number
  rating: number
  mercariUrl: string
  lastUpdated: Date
}

interface Competitor {
  id: string
  name: string
  rating: number
  price: number
  salesCount: number
  lastSeen: string
  trend: "up" | "down" | "stable"
  image: string
  mercariUrl: string
}

interface CompetitorAnalysisModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

const mockCompetitors: Competitor[] = [
  {
    id: "1",
    name: "seller001",
    rating: 98,
    price: 2800,
    salesCount: 1250,
    lastSeen: "5時間前",
    trend: "up",
    image: "https://static.mercdn.net/c!/w=240,f=webp/thumb/photos/m43982021195_1.jpg?1749545086",
    mercariUrl: "https://mercari.com/jp/items/m12345678901",
  },
  {
    id: "2",
    name: "seller002",
    rating: 85,
    price: 2700,
    salesCount: 890,
    lastSeen: "1時間前",
    trend: "down",
    image: "https://static.mercdn.net/c!/w=240,f=webp/thumb/photos/m43982021195_1.jpg?1749545086",
    mercariUrl: "https://mercari.com/jp/items/m12345678902",
  },
  {
    id: "3",
    name: "seller003",
    rating: 92,
    price: 3200,
    salesCount: 2100,
    lastSeen: "30分前",
    trend: "up",
    image: "https://static.mercdn.net/c!/w=240,f=webp/thumb/photos/m43982021195_1.jpg?1749545086",
    mercariUrl: "https://mercari.com/jp/items/m12345678903",
  },
]

export function CompetitorAnalysisModal({ product, isOpen, onClose }: CompetitorAnalysisModalProps) {
  const [sortBy, setSortBy] = useState<"price" | "sales" | "rating">("sales")
  const [isRefreshing, setIsRefreshing] = useState(false)

  if (!product) return null

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 2000)
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

  const sortedCompetitors = [...mockCompetitors].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price
      case "sales":
        return b.salesCount - a.salesCount
      case "rating":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>競合分析 - {product.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Analysis Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-sm">競合者数</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{mockCompetitors.length}</div>
              <div className="text-sm text-gray-500">アクティブ</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-medium text-sm">平均価格</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                ¥
                {Math.round(
                  mockCompetitors.reduce((sum, c) => sum + c.price, 0) / mockCompetitors.length,
                ).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">市場平均</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Package className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-sm">総販売数</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {mockCompetitors.reduce((sum, c) => sum + c.salesCount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">過去30日</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-sm">平均評価</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                {(mockCompetitors.reduce((sum, c) => sum + c.rating, 0) / mockCompetitors.length).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">満足度</div>
            </Card>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">並び替え:</span>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">販売数順</SelectItem>
                  <SelectItem value="price">価格順</SelectItem>
                  <SelectItem value="rating">評価順</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 bg-transparent"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>データ更新</span>
            </Button>
          </div>

          {/* Competitors List */}
          <div className="space-y-4">
            {sortedCompetitors.map((competitor, index) => (
              <motion.div
                key={competitor.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    {/* Competitor Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={competitor.image || "/placeholder.svg"}
                        alt={competitor.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    </div>

                    {/* Competitor Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-800">{competitor.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{competitor.rating}%</span>
                        </div>
                        {getTrendIcon(competitor.trend)}
                      </div>

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

                    {/* Actions */}
                    <div className="flex flex-col space-y-2 sm:ml-6">
                      <Button
                        onClick={() => window.open(competitor.mercariUrl, "_blank")}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 flex items-center space-x-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>メルカリで見る</span>
                      </Button>
                    </div>
                  </div>

                  {/* Comparison with current product */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-gray-500 mb-1">価格差</div>
                        <div
                          className={`font-semibold ${
                            competitor.price < product.price
                              ? "text-red-600"
                              : competitor.price > product.price
                                ? "text-green-600"
                                : "text-gray-600"
                          }`}
                        >
                          {competitor.price < product.price && "-"}
                          {competitor.price > product.price && "+"}¥
                          {Math.abs(competitor.price - product.price).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500 mb-1">売上差</div>
                        <div
                          className={`font-semibold ${
                            competitor.salesCount > product.salesCount
                              ? "text-red-600"
                              : competitor.salesCount < product.salesCount
                                ? "text-green-600"
                                : "text-gray-600"
                          }`}
                        >
                          {competitor.salesCount > product.salesCount && "+"}
                          {competitor.salesCount < product.salesCount && "-"}
                          {Math.abs(competitor.salesCount - product.salesCount).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500 mb-1">評価差</div>
                        <div
                          className={`font-semibold ${
                            competitor.rating > product.rating
                              ? "text-red-600"
                              : competitor.rating < product.rating
                                ? "text-green-600"
                                : "text-gray-600"
                          }`}
                        >
                          {competitor.rating > product.rating && "+"}
                          {competitor.rating < product.rating && "-"}
                          {Math.abs(competitor.rating - product.rating).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Market Insights */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">市場インサイト</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">価格ポジション</h4>
                <p className="text-sm text-gray-600">
                  あなたの商品価格（¥{product.price.toLocaleString()}）は市場平均より
                  {product.price >
                  Math.round(mockCompetitors.reduce((sum, c) => sum + c.price, 0) / mockCompetitors.length)
                    ? "高く"
                    : "低く"}
                  設定されています。
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">競合優位性</h4>
                <p className="text-sm text-gray-600">
                  販売数では{mockCompetitors.filter((c) => c.salesCount < product.salesCount).length}社を上回っており、
                  良好なポジションにあります。
                </p>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
