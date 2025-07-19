import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { AuthProvider } from "@/hooks/useAuth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "セラーナビ - 輸入商品分析ツール",
  description: "中国輸入商品の市場分析を、直感的で美しいインターフェースで",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        {/* Add Google Identity Services script here */}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
