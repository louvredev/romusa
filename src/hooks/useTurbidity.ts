import { useEffect, useState } from "react"
import { ref, onValue } from "firebase/database"
import { db } from "@/lib/firebase"

export function useTurbidity() {
  const [turbidity, setTurbidity] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const turbidityRef = ref(db, "/turbidity")

    const unsubscribe = onValue(turbidityRef, (snapshot) => {
      setTurbidity(snapshot.val())
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { turbidity, loading }
}