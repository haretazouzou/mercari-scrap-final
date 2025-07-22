// /pages/api/user/update.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { getDb } from "@/lib/mongodb"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "changeme"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return res.status(401).json({ error: "Token required" })

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string }
    const db = await getDb()

    const { name, email, phone } = req.body
    await db.collection("users").updateOne(
      { email: decoded.email },
      { $set: { name, email, phone } }
    )

    res.status(200).json({ message: "更新成功" })
  } catch {
    return res.status(401).json({ error: "更新に失敗しました" })
  }
}
