import type { NextApiRequest, NextApiResponse } from "next"
import { getDb } from "@/lib/mongodb"

const PLAN_LIMITS = {
  free: { max: 0, cooldown: 0 },
  standard: { max: 10, cooldown: 5 * 60 },
  premium: { max: Infinity, cooldown: 60 },
}

// Set your A/B test start date here
const AB_TEST_START = new Date("2024-07-01T00:00:00Z");

function getCurrentWeek(startDate: Date): number {
  const now = new Date();
  const diff = now.getTime() - startDate.getTime();
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
}

function getPatternForGroup(group: "A" | "B", week: number): "AND" | "OR" {
  if (week % 2 === 1) {
    return group === "A" ? "AND" : "OR";
  } else {
    return group === "A" ? "OR" : "AND";
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()
  const { user_id, plan, query, category, period, use_case } = req.body
  const db = await getDb()
  const now = Date.now()
  const userLog = await db.collection("scrape_logs").find({ user_id }).sort({ timestamp: -1 }).toArray()
  const planInfo = PLAN_LIMITS[plan] || PLAN_LIMITS["free"]

  // Plan limit
  if (planInfo.max !== Infinity) {
    const thisMonth = new Date().getMonth()
    const countThisMonth = userLog.filter(log => new Date(log.timestamp).getMonth() === thisMonth).length
    if (countThisMonth >= planInfo.max) {
      return res.status(429).json({ error: "今月の実行回数上限に達しました" })
    }
  }
  // Cooldown
  if (userLog.length > 0) {
    const last = new Date(userLog[0].timestamp).getTime()
    if (now - last < planInfo.cooldown * 1000) {
      return res.status(429).json({ error: `次の実行まで${Math.ceil((planInfo.cooldown * 1000 - (now - last))/1000)}秒お待ちください` })
    }
  }

  // --- A/B Test Logic ---
  const ab_group = req.cookies?.ab_group || "A";
  const ab_group_assigned = req.cookies?.ab_group_assigned
    ? new Date(Number(req.cookies.ab_group_assigned))
    : AB_TEST_START;
  const week = getCurrentWeek(ab_group_assigned);
  const pattern = getPatternForGroup(ab_group, week);

  try {
    const scraperRes = await fetch("http://localhost:8000/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id, plan, query, category, period, use_case, pattern
      }),
    })
    const { products, log } = await scraperRes.json()
    if (products.length > 0) {
      await db.collection("products").insertMany(products)
    }
    await db.collection("scrape_logs").insertOne({
      ...log,
      ab_group,
      week,
      pattern,
      use_case,
    })
    res.status(200).json({ products })
  } catch (err) {
    res.status(500).json({ error: "Scraping failed" })
  }
} 