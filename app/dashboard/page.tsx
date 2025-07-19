"use client"

import { useState, useEffect, useRef, useLayoutEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Search,
  Filter,
  TrendingUp,
  RefreshCw,
  Clock,
  Database,
  Loader2,
  CheckCircle,
  AlertCircle,
  Zap,
  Calendar,
  User,
  Settings,
  LogOut,
  Crown,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { ProductDetailModal } from "@/components/product-detail-modal"
import { CompetitorAnalysisModal } from "@/components/competitor-analysis-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import logo from "../../public/logo.png"
import Image from "next/image"

type ProcessingStatus = "cache" | "fetching" | "complete" | "error"
type SearchType = "normal" | "realtime"
type TimePeriod = "7" | "14" | "30" | "60" | "90"

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

const mockProducts: Product[] = [
  {
    id: "1",
    title: "韓国ファッション レディース ワンピース",
    price: 2980,
    image: "https://static.mercdn.net/c!/w=240,f=webp/thumb/photos/m43982021195_1.jpg?1749545086",
    category: "ファッション",
    subcategory: "レディース > ワンピース",
    salesCount: 150,
    rating: 4.5,
    mercariUrl: "https://mercari.com/jp/items/m12345678901",
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "2",
    title: "中国製 スマートフォンケース iPhone用",
    price: 1580,
    image: "https://static.mercdn.net/c!/w=240,f=webp/thumb/photos/m43982021195_1.jpg?1749545086",
    category: "家電・スマホ",
    subcategory: "スマートフォン > アクセサリー",
    salesCount: 89,
    rating: 4.2,
    mercariUrl: "https://mercari.com/jp/items/m12345678902",
    lastUpdated: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: "3",
    title: "海外ブランド キッチン用品セット",
    price: 4200,
    image: "https://static.mercdn.net/c!/w=240,f=webp/thumb/photos/m43982021195_1.jpg?1749545086",
    category: "ホーム・キッチン",
    subcategory: "キッチン用品 > 調理器具",
    salesCount: 67,
    rating: 4.8,
    mercariUrl: "https://mercari.com/jp/items/m12345678903",
    lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
  },
  {
    id: "4",
    title: "海外ブランド キッチン用品セット",
    price: 3500,
    image: "https://static.mercdn.net/c!/w=240,f=webp/thumb/photos/m43982021195_1.jpg?1749545086",
    category: "ホーム・キッチン",
    subcategory: "キッチン用品 > 調理器具",
    salesCount: 67,
    rating: 4.8,
    mercariUrl: "https://mercari.com/jp/items/m12345678903",
    lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
  },
]

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const [status, setStatus] = useState<ProcessingStatus>("cache")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [priceRange, setPriceRange] = useState([1000, 5000])
  const [isSearching, setIsSearching] = useState(false)
  const [searchType, setSearchType] = useState<SearchType>("normal")
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("30")
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showAnalysisModal, setShowAnalysisModal] = useState(false)
  const [accountSheetOpen, setAccountSheetOpen] = useState(false)
  const isMobileRef = useRef(false)

  // Keep track of screen size for perfect response
  useLayoutEffect(() => {
    const checkMobile = () => {
      isMobileRef.current = window.innerWidth < 640
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const categories = {
    ファッション: {
      レディース: ["ワンピース", "トップス", "スカート", "パンツ", "アウター", "下着・ランジェリー", "靴", "バッグ"],
      メンズ: ["ジャケット", "スーツ", "シャツ", "パンツ", "アウター", "下着", "靴", "バッグ"],
      キッズ: ["子供服", "ベビー服", "靴", "アクセサリー"],
    },
    家電・スマホ: {
      スマートフォン: ["iPhone", "Android", "アクセサリー", "充電器", "ケース"],
      パソコン: ["ノートPC", "デスクトップ", "周辺機器", "ソフトウェア"],
      家電: ["キッチン家電", "生活家電", "AV機器", "美容家電"],
    },
    ホーム・キッチン: {
      キッチン用品: ["調理器具", "食器", "収納", "キッチン家電"],
      インテリア: ["家具", "照明", "装飾品", "カーテン"],
      日用品: ["掃除用品", "バス用品", "洗濯用品", "収納用品"],
    },
  }

  const timePeriods = [
    { value: "7", label: "過去7日間" },
    { value: "14", label: "過去14日間" },
    { value: "30", label: "過去30日間" },
    { value: "60", label: "過去60日間" },
    { value: "90", label: "過去90日間" },
  ]

  const handleSearch = async (type: SearchType) => {
    setIsSearching(true)
    setSearchType(type)
    setStatus("fetching")
  
    if (type === "realtime") {
      try {
        const res = await fetch("http://localhost:8000/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            keyword: searchQuery,
            category: selectedCategory,
            price_min: priceRange[0],
            price_max: priceRange[1],
          }),
        })
        const [products, setProducts] = useState<Product[]>([])
  
        const data = await res.json()
  
        console.log("Real-time scraped items:", data.items)
  
        // ✅ Update your product list state here
        setProducts(data.items || [])
      } catch (error) {
        console.error("Scraping failed:", error)
        setStatus("error")
      }
    } else {
      // Simulate cache data fetch
      setTimeout(() => {
        setStatus("complete")
        setIsSearching(false)
      }, 3000)
    }
  
    // Real-time status update after fetching
    if (type === "realtime") {
      setTimeout(() => {
        setStatus("complete")
        setLastUpdated(new Date())
        setIsSearching(false)
      }, 5000)
    }
  }

  const handleRefresh = () => {
    setStatus("fetching")
    setTimeout(() => {
      setStatus("complete")
      setLastUpdated(new Date())
    }, 2000)
  }

  const getStatusDisplay = () => {
    const daysSinceUpdate = Math.floor((Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24))

    if (!user || user.plan !== "pro") {
      // Free/Standard: Always show data freshness and cache message
      return {
        icon: <Database className="w-4 h-4 text-blue-500" />, 
        text: `${daysSinceUpdate === 0 ? "本日" : `${daysSinceUpdate}日前`}のデータを表示中、リアルタイム検索を行うとリアルタイムデータが表示されます。※リアルタイム検索はスタンダードプラン・プロプランでご利用いただけます`,
        color: "bg-blue-50 text-blue-700 border-blue-200",
      }
    }

    // Pro: Show cache status only after real-time search
    switch (status) {
      case "cache":
        return {
          icon: <Database className="w-4 h-4 text-blue-500" />, 
          text: `キャッシュから表示中 (${daysSinceUpdate}日前に更新)`,
          color: "bg-blue-50 text-blue-700 border-blue-200",
        }
      case "fetching":
        return {
          icon: <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />, 
          text: searchType === "realtime" ? "リアルタイム検索中... (最大30秒)" : "新しいデータを取得中... (最大10秒)",
          color: "bg-orange-50 text-orange-700 border-orange-200",
        }
      case "complete":
        return {
          icon: <CheckCircle className="w-4 h-4 text-green-500" />, 
          text: `更新完了: ${daysSinceUpdate === 0 ? "本日" : `${daysSinceUpdate}日前`}に取得したデータを表示`,
          color: "bg-green-50 text-green-700 border-green-200",
        }
      case "error":
        return {
          icon: <AlertCircle className="w-4 h-4 text-red-500" />, 
          text: "エラー: データの取得に失敗しました",
          color: "bg-red-50 text-red-700 border-red-200",
        }
    }
  }

  const getDataFreshness = (product: Product) => {
    const hoursAgo = Math.floor((Date.now() - product.lastUpdated.getTime()) / (1000 * 60 * 60))
    if (hoursAgo < 1) return "1時間以内に更新"
    if (hoursAgo < 24) return `${hoursAgo}時間前に更新`
    const daysAgo = Math.floor(hoursAgo / 24)
    return `${daysAgo}日前に更新`
  }

  const statusDisplay = getStatusDisplay()

  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = "/"
    }
  }, [user, isLoading])

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

  const handleProductDetail = (product: Product) => {
    setSelectedProduct(product)
    setShowDetailModal(true)
  }

  const handleCompetitorAnalysis = (product: Product) => {
    setSelectedProduct(product)
    setShowAnalysisModal(true)
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
              <span className="text-sm text-gray-600">こんにちは、{user?.name || 'ユーザー'}さん</span>
              <Badge variant="outline" className="text-xs w-fit">
                {user?.plan === "free" ? "フリー" : user?.plan === "standard" ? "スタンダード" : "プロ"}プラン
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
              {user?.plan === "pro" && (
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  disabled={status === "fetching"}
                  className="flex items-center justify-center space-x-2 bg-transparent w-full sm:w-auto"
                >
                  <RefreshCw className={`w-4 h-4 ${status === "fetching" ? "animate-spin" : ""}`} />
                  <span>更新</span>
                </Button>
              )}
              
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
    <Button
      variant="outline"
      size="sm"
      className="hidden sm:flex items-center justify-center space-x-2 bg-transparent"
    >
      <User className="w-4 h-4" />
      <span>アカウント</span>
    </Button>
  </DropdownMenuTrigger>
                {/* Desktop dropdown only */}
                <DropdownMenuContent align="end" className="hidden sm:block w-56">
                  <div className="flex items-center justify-start p-2">
                    <div className="flex items-center space-x-2">
                      <Image src={logo} alt="Logo" width={24} height={24} />
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name || 'ユーザー'}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email || ''}</p>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.location.href = "/account/plan"}>
                    <Crown className="mr-2 h-4 w-4" />
                    <span>プラン変更</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = "/account/settings"}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>設定</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('auth-session');
                      localStorage.removeItem('auth-user');
                      localStorage.removeItem('auth-token');
                      window.location.href = '/'
                    }
                  }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>ログアウト</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Mobile: open sheet directly */}
<Button
  variant="outline"
  size="sm"
  className="flex sm:hidden items-center justify-center space-x-2 bg-transparent"
  onClick={() => setAccountSheetOpen(true)}
>
  <User className="w-4 h-4" />
  <span>アカウント</span>
</Button>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{new Date().toLocaleTimeString("ja-JP")}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Status Indicator */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Card className={`p-4 border ${statusDisplay.color}`}>
            <div className="flex items-center space-x-3">
              {statusDisplay.icon}
              <span className="font-medium text-sm">{statusDisplay.text}</span>
            </div>
          </Card>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              検索条件
            </h2>

            <div className="space-y-6">
              {/* Search Query and Time Period */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search" className="text-gray-700 font-medium text-sm">
                    キーワード検索
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12"
                      placeholder="商品名を入力..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium text-sm">集計期間</Label>
                  <Select value={timePeriod} onValueChange={(value) => setTimePeriod(value as TimePeriod)}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timePeriods.map((period) => (
                        <SelectItem key={period.value} value={period.value}>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{period.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Category and Price Range */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium text-sm">カテゴリー</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="カテゴリーを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categories).map(([mainCategory, subCategories]) => (
                        <div key={mainCategory}>
                          <div className="px-2 py-1 text-sm font-semibold text-gray-700 bg-gray-50">{mainCategory}</div>
                          {Object.entries(subCategories).map(([subCategory, items]) => (
                            <div key={subCategory}>
                              <div className="px-4 py-1 text-sm text-gray-600">{subCategory}</div>
                              {items.map((item) => (
                                <SelectItem
                                  key={item}
                                  value={`${mainCategory} > ${subCategory} > ${item}`}
                                  className="pl-8"
                                >
                                  {item}
                                </SelectItem>
                              ))}
                            </div>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium text-sm">
                    価格帯: ¥{priceRange[0].toLocaleString()} - ¥{priceRange[1].toLocaleString()}
                  </Label>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={10000}
                      min={0}
                      step={500}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>¥0</span>
                    <span>¥10,000</span>
                  </div>
                </div>
              </div>

              {/* Search Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                  <Button
                    onClick={() => handleSearch("normal")}
                    disabled={isSearching}
                    variant="outline"
                    className="w-full sm:w-auto px-8 py-3 bg-transparent"
                  >
                    {isSearching && searchType === "normal" ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>検索中...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Search className="w-4 h-4" />
                        <span>通常検索</span>
                      </div>
                    )}
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Button
  onClick={() => handleSearch("realtime")}
  disabled={isSearching || user.plan === "free"}
  className={`
    bg-gradient-to-r from-blue-600 to-purple-600 
    hover:from-blue-700 hover:to-purple-700 
    text-white px-8 py-3 w-full sm:w-auto 
    disabled:opacity-60 disabled:cursor-not-allowed
  `}
>
  {isSearching && searchType === "realtime" ? (
    <div className="flex items-center space-x-2">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>リアルタイム検索中...</span>
    </div>
  ) : (
    <div className="flex items-center space-x-2">
      <Zap className="w-4 h-4" />
      <span>リアルタイム検索</span>
    </div>
  )}
</Button>
                </motion.div>
              </div>

              {user.plan === "free" && (
                <div className="text-sm text-gray-500 text-center">
                  リアルタイム検索はスタンダード・プロプランでご利用いただけます
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {mockProducts.map((product, index) => (
  <motion.div
    key={product.id || index}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row items-start relative"
  >
    {/* 🏆 Ranking Badge */}
    <div className="absolute left-[-12px] top-4 sm:top-6 z-10">
      <span
        className={`text-white text-sm font-bold px-3 py-1 rounded-full shadow-md
          ${index === 0 ? "bg-yellow-400" :
            index === 1 ? "bg-gray-400" :
            index === 2 ? "bg-amber-600" :
            "bg-blue-500"}`}
      >
        {index === 0 ? "🥇 1位" :
         index === 1 ? "🥈 2位" :
         index === 2 ? "🥉 3位" :
         `${index + 1}位`}
      </span>
    </div>

    {/* Product Image */}
    <div
      className="w-full sm:w-32 h-48 sm:h-32 bg-gray-200 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
      onClick={() => handleProductDetail(product)}
    >
      <img
        src={product.image}
        alt="商品画像"
        className="w-full h-full object-cover"
      />
    </div>

    {/* Product Details */}
    <div className="p-4 flex-1">
      <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
      <p className="text-gray-600 text-sm mb-2">
        {product.category} &gt; {product.subcategory}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xl font-bold text-blue-600">
            ¥{product.price.toLocaleString()}
          </span>
          <span className="text-gray-500 text-xs">
            {getDataFreshness(product)}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-600">{product.salesCount}+ 件</span>
        </div>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex sm:flex-col gap-2 mt-3 sm:mt-0 sm:ml-4">
      <Button
        size="sm"
        variant="outline"
        className="flex-1 sm:flex-none bg-transparent w-full sm:ml-[-2px] mt-[2px]"
        onClick={() => handleProductDetail(product)}
      >
        詳細
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white w-full sm:ml-[-2px] mt-[2px]"
        onClick={() => handleCompetitorAnalysis(product)}
      >
        競合分析
      </Button>
    </div>
  </motion.div>
))}

        {/* Modals */}
        <ProductDetailModal
          product={selectedProduct}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
        />

        <CompetitorAnalysisModal
          product={selectedProduct}
          isOpen={showAnalysisModal}
          onClose={() => setShowAnalysisModal(false)}
        />
      </div>
      {/* Mobile sheet for account menu */}
      <Sheet open={accountSheetOpen} onOpenChange={setAccountSheetOpen}>
        <SheetContent side="bottom" className="sm:hidden p-0 rounded-t-2xl max-h-[90vh] overflow-y-auto">
          <SheetHeader className="border-b p-4">
            <SheetTitle>アカウント</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="absolute right-2 top-2" aria-label="閉じる">
                ×
              </Button>
            </SheetClose>
          </SheetHeader>
          <div className="flex items-center justify-start p-4 border-b">
            <Image src={logo} alt="Logo" width={32} height={32} />
            <div className="flex flex-col space-y-1 ml-3">
              <p className="text-base font-medium leading-none">{user?.name || 'ユーザー'}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email || ''}</p>
            </div>
          </div>
          <div className="flex flex-col divide-y">
            <Button variant="ghost" className="justify-start w-full rounded-none py-4 text-left" onClick={() => { window.location.href = "/account/plan"; setAccountSheetOpen(false) }}>
              <Crown className="mr-2 h-5 w-5" />プラン更新
            </Button>
            <Button variant="ghost" className="justify-start w-full rounded-none py-4 text-left" onClick={() => { window.location.href = "/account/settings"; setAccountSheetOpen(false) }}>
              <Settings className="mr-2 h-5 w-5" />設定
            </Button>
            <Button variant="ghost" className="justify-start w-full rounded-none py-4 text-left text-red-600" onClick={() => { localStorage.removeItem('auth-session'); window.location.href = '/'; setAccountSheetOpen(false) }}>
              <LogOut className="mr-2 h-5 w-5" />ログアウト
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
