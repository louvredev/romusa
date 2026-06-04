import { useEffect, useState } from "react"
import { ref, onValue, set } from "firebase/database"
import { db } from "@/lib/firebase"

export function useJadwal() {
  const [jadwal, setJadwal] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const jadwalRef = ref(db, "/jadwal")

    const unsubscribe = onValue(jadwalRef, (snapshot) => {
      const val = snapshot.val()
      if (Array.isArray(val)) {
        setJadwal(val.filter(Boolean))
      } else {
        setJadwal([])
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const simpanJadwal = async (jadwalBaru: string[]) => {
    await set(ref(db, "/jadwal"), jadwalBaru)
  }

  return { jadwal, loading, simpanJadwal }
}