import { useEffect, useState } from "react"
import { ref, onValue } from "firebase/database"
import { db } from "@/lib/firebase"

export function useSuhu() {
  const [suhu, setSuhu] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const suhuRef = ref(db, "/suhu")

    // onValue = realtime listener, otomatis update tiap ada perubahan
    const unsubscribe = onValue(suhuRef, (snapshot) => {
      setSuhu(snapshot.val())
      setLoading(false)
    })

    return () => unsubscribe() // cleanup saat komponen unmount
  }, [])

  return { suhu, loading }
}