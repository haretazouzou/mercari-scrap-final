import type { NextApiRequest, NextApiResponse } from "next"
import { getDb } from "@/lib/mongodb"
import jwt from "jsonwebtoken"
import { OAuth2Client } from "google-auth-library"
import { WithId, Document } from "mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "changeme"
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ""
const client = new OAuth2Client(GOOGLE_CLIENT_ID)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const { idToken, plan } = req.body
  if (!idToken) return res.status(400).json({ error: "Missing Google token" })

  let ticket
  try {
    ticket = await client.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID })
  } catch {
    return res.status(401).json({ error: "Invalid Google token" })
  }

  const payload = ticket.getPayload()
  if (!payload || !payload.email) return res.status(400).json({ error: "Missing email in Google profile" })

  const db = await getDb()
  let user = await db.collection("users").findOne({ email: payload.email }) as WithId<Document> | null

  if (user) {
    if (plan && user.plan !== plan) {
      await db.collection("users").updateOne({ email: payload.email }, { $set: { plan } })
      user.plan = plan
    }
  } else {
    const newUser = {
      name: payload.name || payload.email,
      email: payload.email,
      googleId: payload.sub,
      plan: plan || "free",
      createdAt: new Date(),
    }
    const result = await db.collection("users").insertOne(newUser)
    user = {
      _id: result.insertedId,
      ...newUser,
    }
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email, plan: user.plan },
    JWT_SECRET,
    { expiresIn: "7d" }
  )

  return res.status(200).json({
    token,
    user: {
      name: user.name,
      email: user.email,
      plan: user.plan,
    },
  })
}
