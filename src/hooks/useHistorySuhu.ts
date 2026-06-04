import { useEffect, useState } from "react"
import { ref, query, orderByKey, limitToLast, onValue } from "firebase/database"
import { db } from "@/lib/firebase"

export type DataPoint = {
  time: string      // label sumbu X, misal "14.30"
  timestamp: number // unix timestamp asli
  suhu: number
}

// Bulatkan timestamp ke slot 30 menit terdekat
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

// Ambil semua slot 30 menit dalam window 24 jam terakhir
function generate30MinSlots(endTs: number): number[] {
  const slots: number[] = []
  // mulai dari 24 jam lalu, bulatkan ke 30 menit
  let cursor = roundTo30Min(endTs - 24 * 60 * 60)
  while (cursor <= endTs) {
    slots.push(cursor)
    cursor += 30 * 60
  }
  return slots
}

// Rata-rata data mentah per slot 30 menit
function aggregateTo30Min(
  raw: { timestamp: number; suhu: number }[]
): DataPoint[] {
  const now = Math.floor(Date.now() / 1000)
  const slots = generate30MinSlots(now)

  return slots.map((slotTs) => {
    const nextSlot = slotTs + 30 * 60
    const inSlot = raw.filter(
      (d) => d.timestamp >= slotTs && d.timestamp < nextSlot
    )
    const avg =
      inSlot.length > 0
        ? inSlot.reduce((s, d) => s + d.suhu, 0) / inSlot.length
        : null

    return {
      time: formatWIB(slotTs),
      timestamp: slotTs,
      suhu: avg !== null ? parseFloat(avg.toFixed(2)) : null,
    } as DataPoint
  })
}

export function useHistorySuhu() {
  const [data, setData] = useState<DataPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Ambil 10000 entry terakhir (cukup untuk 24 jam @ 5 detik interval)
    const historyRef = query(
      ref(db, "/history"),
      orderByKey(),
      limitToLast(10000)
    )

    const unsubscribe = onValue(historyRef, (snapshot) => {
      const raw: { timestamp: number; suhu: number }[] = []

      snapshot.forEach((child) => {
        const ts = parseInt(child.key ?? "0")
        const val = child.val()

        if (isNaN(ts)) return

        // Format baru: { suhu: 31, turbidity: 2532 }
        if (typeof val === "object" && val !== null && typeof val.suhu === "number") {
          raw.push({ timestamp: ts, suhu: val.suhu })
        }
        // Format lama: 25.75 (angka langsung)
        else if (typeof val === "number") {
          raw.push({ timestamp: ts, suhu: val })
        }
      })

      setData(aggregateTo30Min(raw))
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Refresh slot setiap 30 menit agar sumbu X selalu update
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => [...prev]) // trigger re-aggregate via onValue
    }, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return { data, loading }
}