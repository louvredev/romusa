export function playNotificationSound() {
  const audio = new Audio("/sounds/notification.mp3")
  audio.volume = 0.7
  // play() return Promise; kalau gagal (misal belum ada interaksi user
  // sama sekali), diamkan saja, jangan sampai melempar unhandled error.
  audio.play().catch(() => {})
}