import { useEffect, useRef } from "react"

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const audio = new Audio("/sounds/boba-date-song.mp3")
    audio.loop = true
    audio.volume = 0.8
    audioRef.current = audio

    // Browser memblokir autoplay sebelum ada interaksi user.
    // Begitu user klik/tap/sentuh di mana saja, baru kita play.
    const tryStart = () => {
      if (startedRef.current) return
      audio
        .play()
        .then(() => {
          startedRef.current = true
          // Sudah berhasil mulai, tidak perlu dengar event lagi
          removeListeners()
        })
        .catch(() => {
          // Masih diblokir (jarang terjadi setelah ada gesture),
          // biarkan listener tetap aktif untuk coba lagi di interaksi berikutnya.
        })
    }

    const events: (keyof WindowEventMap)[] = ["click", "touchstart", "keydown"]
    const removeListeners = () => {
      events.forEach((evt) => window.removeEventListener(evt, tryStart))
    }
    events.forEach((evt) => window.addEventListener(evt, tryStart))

    return () => {
      removeListeners()
      audio.pause()
      audioRef.current = null
    }
  }, [])

  return null
}