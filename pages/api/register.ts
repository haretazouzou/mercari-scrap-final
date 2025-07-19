import type { NextApiRequest, NextApiResponse } from "next"
import { getDb } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "changeme"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()
  const { name, email, password, plan } = req.body
  if (!name || !email || !password || !plan) return res.status(400).json({ error: "Missing fields" })
  const db = await getDb()
  const existing = await db.collection("users").findOne({ email })
  if (existing) return res.status(409).json({ error: "User already exists" })
  const passwordHash = await bcrypt.hash(password, 10)
  const user = { name, email, passwordHash, plan, createdAt: new Date() }
  const result = await db.collection("users").insertOne(user)
  const token = jwt.sign({ userId: result.insertedId, email, plan }, JWT_SECRET, { expiresIn: "7d" })
  res.status(201).json({ token, user: { name, email, plan } })
} 