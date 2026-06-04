import { useEffect, useState } from "react"
import { ref, query, orderByKey, limitToLast, onValue } from "firebase/database"
import { db } from "@/lib/firebase"

export type DataPointTurbidity = {
  time: string
  timestamp: number
  turbidity: number | null
}

function roundTo30Min(ts: number): number {
  const ms = ts * 1000
  const d = new Date(ms)
  const minutes = d.getMinutes() >= 30 ? 30 : 0
  d.setMinutes(minutes, 0, 0)
  return Math.floor(d.getTime() / 1000)
}

function formatWIB(ts: number): string {
  const d = new Date(ts * 1000)
  const h = d.getHours().toString().padStart(2, "0")
  const m = d.getMinutes().toString().padStart(2, "0")
  return `${h}.${m}`
}

function generate30MinSlots(endTs: number): number[] {
  const slots: number[] = []
  let cursor = roundTo30Min(endTs - 24 * 60 * 60)
  while (cursor <= endTs) {
    slots.push(cursor)
    cursor += 30 * 60
  }
  return slots
}

function aggregateTo30Min(
  raw: { timestamp: number; turbidity: number }[]
): DataPointTurbidity[] {
  const now = Math.floor(Date.now() / 1000)
  const slots = generate30MinSlots(now)

  return slots.map((slotTs) => {
    const nextSlot = slotTs + 30 * 60
    const inSlot = raw.filter(
      (d) => d.timestamp >= slotTs && d.timestamp < nextSlot
    )
    const avg =
      inSlot.length > 0
        ? inSlot.reduce((s, d) => s + d.turbidity, 0) / inSlot.length
        : null

    return {
      time: formatWIB(slotTs),
      timestamp: slotTs,
      turbidity: avg !== null ? parseFloat(avg.toFixed(1)) : null,
    }
  })
}

export function useHistoryTurbidity() {
  const [data, setData] = useState<DataPointTurbidity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const historyRef = query(
      ref(db, "/history"),
      orderByKey(),
      limitToLast(10000)
    )

    const unsubscribe = onValue(historyRef, (snapshot) => {
      const raw: { timestamp: number; turbidity: number }[] = []

      snapshot.forEach((child) => {
        const ts = parseInt(child.key ?? "0")
        const val = child.val()

        // Hanya ambil entry format baru yang punya turbidity
        if (
          !isNaN(ts) &&
          typeof val === "object" &&
          val !== null &&
          typeof val.turbidity === "number"
        ) {
          raw.push({ timestamp: ts, turbidity: val.turbidity })
        }
      })

      setData(aggregateTo30Min(raw))
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => [...prev])
    }, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return { data, loading }
}