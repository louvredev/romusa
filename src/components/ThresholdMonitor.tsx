import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { useSuhu } from "@/hooks/useSuhu"
import { useTurbidity } from "@/hooks/useTurbidity"
import { playNotificationSound } from "@/lib/playNotificationSound"

const SUHU_THRESHOLD = 32
const TURBIDITY_THRESHOLD = 100

// Dipasang sekali di Dashboard, hanya aktif efeknya kalau dipanggil
// dari context yang isAdmin true (lihat penggunaan di Dashboard.tsx).
export function ThresholdMonitor() {
  const { suhu } = useSuhu()
  const { turbidity } = useTurbidity()

  // Lacak apakah metrik ini sedang dalam kondisi "di atas threshold",
  // supaya toast cuma muncul sekali saat transisi naik melewati batas,
  // bukan tiap kali data baru masuk selama masih di atas threshold.
  const suhuAlerted = useRef(false)
  const turbidityAlerted = useRef(false)

  useEffect(() => {
    if (suhu === null) return

    if (suhu >= SUHU_THRESHOLD && !suhuAlerted.current) {
      suhuAlerted.current = true
      playNotificationSound()
      toast.warning(`Suhu ${suhu}°C, segera cek kolam anda`, {
        duration: Infinity,
      })
    } else if (suhu < SUHU_THRESHOLD && suhuAlerted.current) {
      // Reset begitu nilai kembali normal, supaya kalau naik lagi
      // nanti, toast warning bisa muncul lagi.
      suhuAlerted.current = false
    }
  }, [suhu])

  useEffect(() => {
    if (turbidity === null) return

    if (turbidity >= TURBIDITY_THRESHOLD && !turbidityAlerted.current) {
      turbidityAlerted.current = true
      playNotificationSound()
      toast.warning(`Kekeruhan ${turbidity}, segera cek kolam anda`, {
        duration: Infinity,
      })
    } else if (turbidity < TURBIDITY_THRESHOLD && turbidityAlerted.current) {
      turbidityAlerted.current = false
    }
  }, [turbidity])

  return null
}