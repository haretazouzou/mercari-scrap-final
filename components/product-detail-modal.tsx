"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Star,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Package,
  Eye,
  Heart,
  Share2,
  BarChart3,
} from "lucide-react"

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

interface ProductDetailModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "similar">("overview")

  if (!product) return null

  const getDataFreshness = (product: Product) => {
    const hoursAgo = Math.floor((Date.now() - product.lastUpdated.getTime()) / (1000 * 60 * 60))
    if (hoursAgo < 1) return "1時間以内に更新"
    if (hoursAgo < 24) return `${hoursAgo}時間前に更新`
    const daysAgo = Math.floor(hoursAgo / 24)
    return `${daysAgo}日前に更新`
  }

  const mockPriceHistory = [
    { date: "2025-01-10", price: 3200 },
    { date: "2025-01-11", price: 3100 },
    { date: "2025-01-12", price: 2980 },
    { date: "2025-01-13", price: 2980 },
    { date: "2025-01-14", price: 2850 },
  ]

  const mockSimilarProducts = [
    { id: "s1", title: "類似商品 1", price: 2800, image: "https://static.mercdn.net/c!/w=240,f=webp/thumb/photos/m43982021195_1.jpg?1749545086" },
    { id: "s2", title: "類似商品 2", price: 3200, image: "https://static.mercdn.net/c!/w=240,f=webp/thumb/photos/m43982021195_1.jpg?1749545086" },
    { id: "s3", title: "類似商品 3", price: 2650, image: "https://static.mercdn.net/c!/w=240,f=webp/thumb/photos/m43982021195_1.jpg?1749545086" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>商品詳細</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={"https://static.mercdn.net/c!/w=240,f=webp/thumb/photos/m43982021195_1.jpg?1749545086" || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => window.open(product.mercariUrl, "_blank")}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  メルカリで見る
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{product.title}</h3>
                <p className="text-sm text-gray-600">{product.subcategory}</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-3xl font-bold text-blue-600">¥{product.price.toLocaleString()}</div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{product.rating}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{product.salesCount}</div>
                    <div className="text-sm text-gray-600">販売数</div>
                  </div>
                </Card>
                <Card className="p-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                      ¥{(product.price * product.salesCount).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">推定売上</div>
                  </div>
                </Card>
              </div>

              <div className="space-y-2">
                <Badge variant="outline" className="text-sm">
                  <Calendar className="w-3 h-3 mr-1" />
                  {getDataFreshness(product)}
                </Badge>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-green-100 text-green-800">人気上昇中</Badge>
                  <Badge className="bg-blue-100 text-blue-800">価格安定</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: "overview", label: "概要", icon: <Eye className="w-4 h-4" /> },
                { id: "history", label: "価格履歴", icon: <TrendingUp className="w-4 h-4" /> },
                { id: "similar", label: "類似商品", icon: <BarChart3 className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px]">
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-medium">平均価格</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">¥{product.price.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">過去30日間</div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">価格トレンド</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-600">-5.2%</span>
                    </div>
                    <div className="text-sm text-gray-500">先週比</div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Package className="w-4 h-4 text-purple-600" />
                      <span className="font-medium">在庫状況</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">良好</div>
                    <div className="text-sm text-gray-500">推定在庫数: 25個</div>
                  </Card>
                </div>

                <Card className="p-4">
                  <h4 className="font-medium mb-4">商品説明</h4>
                  <p className="text-gray-600 leading-relaxed">
                    この商品は{product.category}カテゴリーの人気商品です。
                    高品質な素材を使用し、優れたデザインが特徴的です。
                    多くのユーザーから高い評価を得ており、リピート購入率も高い商品となっています。
                  </p>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-4">販売者情報</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">販売者評価</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>4.8 (1,234件)</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">発送までの日数</span>
                      <span>1-2日</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">発送元</span>
                      <span>東京都</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === "history" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <Card className="p-4">
                  <h4 className="font-medium mb-4">価格推移（過去7日間）</h4>
                  <div className="h-48 bg-gray-100 rounded flex items-center justify-center mb-4">
                    <span className="text-gray-500">価格チャート（実装予定）</span>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-4">価格履歴</h4>
                  <div className="space-y-3">
                    {mockPriceHistory.map((record, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">{record.date}</span>
                        <div className="text-right">
                          <div className="font-medium">¥{record.price.toLocaleString()}</div>
                          {i > 0 && (
                            <div
                              className={`text-xs ${
                                record.price < mockPriceHistory[i - 1].price
                                  ? "text-red-600"
                                  : record.price > mockPriceHistory[i - 1].price
                                    ? "text-green-600"
                                    : "text-gray-500"
                              }`}
                            >
                              {record.price < mockPriceHistory[i - 1].price && "↓"}
                              {record.price > mockPriceHistory[i - 1].price && "↑"}
                              {record.price === mockPriceHistory[i - 1].price && "→"}
                              {Math.abs(record.price - mockPriceHistory[i - 1].price).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === "similar" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <Card className="p-4">
                  <h4 className="font-medium mb-4">類似商品</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockSimilarProducts.map((similar) => (
                      <div key={similar.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                        <img
                          src={similar.image || "/placeholder.svg"}
                          alt={similar.title}
                          className="w-full h-20 object-cover rounded mb-2"
                        />
                        <h5 className="font-medium text-sm mb-1">{similar.title}</h5>
                        <div className="text-blue-600 font-bold">¥{similar.price.toLocaleString()}</div>
                        <Button size="sm" variant="outline" className="w-full mt-2 bg-transparent">
                          詳細を見る
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
