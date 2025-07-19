import type { NextApiRequest, NextApiResponse } from "next"
import { getDb } from "@/lib/mongodb"
import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "changeme"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" })
  const token = auth.replace("Bearer ", "")
  let payload
  try {
    payload = jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return res.status(401).json({ error: "Invalid token" })
  }
  const db = await getDb()
  const user = await db.collection("users").findOne({ _id: new ObjectId(payload.userId) })
  if (!user) return res.status(404).json({ error: "User not found" })
  res.status(200).json({ user: { name: user.name, email: user.email, plan: user.plan } })
} 