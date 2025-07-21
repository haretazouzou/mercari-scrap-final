// pages/api/products.ts

import { NextApiRequest, NextApiResponse } from "next"
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI!
const client = new MongoClient(uri)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const { keyword, category, price_min, price_max } = req.body

  try {
    await client.connect()
    const db = client.db("mercari")
    const collection = db.collection("products")

    // Fetch all items first (since Price is stored as a string)
    const rawItems = await collection.find().limit(1000).toArray()

    // Filter in memory
    const keywordRegex = keyword ? new RegExp(keyword, "i") : null

    const items = rawItems.filter((item) => {
      // Clean "1,500円" → 1500
      const numericPrice = typeof item.Price === "string"
        ? parseInt(item.Price.replace(/[^\d]/g, ""))
        : item.Price

      const priceValid =
        typeof price_min === "number" &&
        typeof price_max === "number"
          ? numericPrice >= price_min && numericPrice <= price_max
          : true

      const keywordValid = keywordRegex
        ? keywordRegex.test(item.Title || "") ||
          keywordRegex.test(item.Category || "") ||
          keywordRegex.test(item.Subcategory || "")
        : true

      const categoryValid = category ? item.Subcategory === category : true

      return priceValid && keywordValid && categoryValid
    })

    res.status(200).json({ items })
  } catch (err) {
    console.error("API Error:", err)
    res.status(500).json({ error: "Failed to fetch products" })
  } finally {
    await client.close()
  }
}
