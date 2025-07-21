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

    const query: any = {
      Price: { $gte: price_min, $lte: price_max },
    }

    if (keyword) {
      const keywordRegex = { $regex: keyword, $options: "i" }
      query.$or = [
        { Title: keywordRegex },
        { Subcategory: keywordRegex },
        { Category: keywordRegex },
      ]
    }

    if (category) {
      query.Subcategory = category
    }

    const items = await collection.find().limit(600).toArray()

    res.status(200).json({ items })
  } catch (err) {
    console.error("API Error:", err)
    res.status(500).json({ error: "Failed to fetch products" })
  } finally {
    await client.close()
  }
}

