// /pages/api/user/me.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { getDb } from "@/lib/mongodb"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "changeme"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end()

  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return res.status(401).json({ error: "Token required" })

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string }
    const db = await getDb()
    const user = await db.collection("users").findOne({ email: decoded.email })
    if (!user) return res.status(404).json({ error: "User not found" })

    res.status(200).json({ user })
  } catch {
    return res.status(401).json({ error: "Invalid token" })
  }
}
