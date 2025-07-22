// pages/api/account/update.ts
import { NextApiRequest, NextApiResponse } from "next"
import { MongoClient, ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

const uri = process.env.MONGODB_URI as string
const client = new MongoClient(uri)
const dbName = "test"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  try {
    const { userId, name, email, phone, currentPassword, newPassword, confirmPassword } = req.body

    await client.connect()
    const db = client.db(dbName)
    const users = db.collection("users")

    const user = await users.findOne({ _id: new ObjectId(userId) })
    if (!user) return res.status(404).json({ message: "ユーザーが見つかりません" })

    // Validate current password
    if (currentPassword) {
      const isValid = await bcrypt.compare(currentPassword, user.password || "")
      if (!isValid) {
        return res.status(401).json({ message: "現在のパスワードが正しくありません" })
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "新しいパスワードが一致しません" })
      }

      const hashed = await bcrypt.hash(newPassword, 10)
      await users.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { name, email, phone, password: hashed } }
      )
    } else {
      await users.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { name, email, phone } }
      )
    }

    res.status(200).json({ message: "設定が正常に更新されました" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "サーバーエラーが発生しました" })
  }
}
