import type { NextApiRequest, NextApiResponse } from "next"
import { getDb } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "changeme"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: "Missing fields" })
  const db = await getDb()
  const user = await db.collection("users").findOne({ email })
  if (!user) return res.status(401).json({ error: "Invalid credentials" })
  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return res.status(401).json({ error: "Invalid credentials" })
  const token = jwt.sign({ userId: user._id, email: user.email, plan: user.plan }, JWT_SECRET, { expiresIn: "7d" })
  res.status(200).json({ token, user: { name: user.name, email: user.email, plan: user.plan } })
} 