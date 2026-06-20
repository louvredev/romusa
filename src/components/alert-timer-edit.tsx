import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useJadwal } from "@/hooks/useJadwal"

type Schedule = { id: number; time: string }

export function AlertTimer() {
  const { jadwal, loading, simpanJadwal } = useJadwal()

  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [newTime, setNewTime] = useState({ hour: "08", minute: "00" })
  const [editTimes, setEditTimes] = useState<Record<number, { hour: string; minute: string }>>({})
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Sync dari Firebase ke state lokal
  useEffect(() => {
    if (!loading) {
      setSchedules(
        jadwal.map((time, idx) => ({ id: idx + 1, time }))
      )
    }
  }, [jadwal, loading])

  const getEditTime = (schedule: Schedule) => {
    return editTimes[schedule.id] ?? {
      hour: schedule.time.split(":")[0],
      minute: schedule.time.split(":")[1],
    }
  }

  const handleAddSchedule = () => {
    if (!newTime.hour || !newTime.minute) return

    const timeStr = `${newTime.hour.padStart(2, "0")}:${newTime.minute.padStart(2, "0")}`
    const updated = [...schedules.map(s => s.time), timeStr]

    simpanJadwal(updated)
    setNewTime({ hour: "08", minute: "00" })
    setIsAddDialogOpen(false)
  }

  const handleSaveSchedule = (id: number) => {
    const t = editTimes[id]
    if (!t) return
    const timeStr = `${t.hour.padStart(2, "0")}:${t.minute.padStart(2, "0")}`
    const updated = schedules
      .map(s => s.id === id ? timeStr : s.time)

    simpanJadwal(updated)
  }

  const handleDeleteSchedule = (id: number) => {
    const updated = schedules
      .filter(s => s.id !== id)
      .map(s => s.time)

    simpanJadwal(updated)
  }

  if (loading) return (
    <Card className="mx-auto w-full max-w-sm h-full flex flex-col pt-4 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pt-0 pb-2 space-y-0">
        <div className="w-8 h-8 shrink-0" />
        <CardTitle className="text-center m-0 leading-none">Jadwal Pakan</CardTitle>
        <div className="w-8 h-8 shrink-0" />
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <div className="h-6 w-32 bg-muted animate-pulse rounded" />
      </CardContent>
    </Card>
  )

  return (
    <Card className="mx-auto w-full max-w-sm h-full flex flex-col pt-4 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pt-0 pb-2 space-y-0">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="-ml-2 shrink-0">
              <Plus className="h-5 w-5" />
              <span className="sr-only">Tambah Jadwal</span>
            </Button>
          </DialogTrigger>
          <DialogContent showCloseButton={false} className="max-w-xs sm:max-w-md">
            <DialogHeader className="text-center sm:text-left">
              <DialogTitle>Tambah Jadwal Pakan</DialogTitle>
              <DialogDescription>Atur waktu pakan baru.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Waktu</label>
                <div className="flex items-center justify-center gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={2}
                    value={newTime.hour}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 2)
                      setNewTime({ ...newTime, hour: digits })
                    }}
                    className="flex h-9 w-16 rounded-md border border-input bg-transparent px-3 py-1 text-sm text-center shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  <span className="font-bold text-lg">:</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={2}
                    value={newTime.minute}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 2)
                      setNewTime({ ...newTime, minute: digits })
                    }}
                    className="flex h-9 w-16 rounded-md border border-input bg-transparent px-3 py-1 text-sm text-center shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddSchedule}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <CardTitle className="text-center m-0 leading-none">Jadwal Pakan</CardTitle>
        <div className="w-8 h-8 shrink-0" />
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        {schedules.length > 0 ? (
          <div className="flex flex-col gap-3 h-full overflow-y-auto overscroll-contain [touch-action:pan-y]">
            {schedules.map((schedule) => (
              <Dialog key={schedule.id}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg" className="w-full flex justify-center px-4">
                    <span className="font-bold">{schedule.time}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent showCloseButton={false} className="max-w-xs sm:max-w-md">
                  <DialogHeader className="text-center sm:text-left">
                    <DialogTitle>Edit Jadwal Pakan</DialogTitle>
                    <DialogDescription>Sesuaikan waktu pakan.</DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-4 py-2">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">Waktu</label>
                      <div className="flex items-center justify-center gap-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={2}
                          value={getEditTime(schedule).hour}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "").slice(0, 2)
                            setEditTimes({
                              ...editTimes,
                              [schedule.id]: {
                                ...getEditTime(schedule),
                                hour: digits,
                              },
                            })
                          }}
                          className="flex h-9 w-16 rounded-md border border-input bg-transparent px-3 py-1 text-sm text-center shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                        <span className="font-bold text-lg">:</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={2}
                          value={getEditTime(schedule).minute}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "").slice(0, 2)
                            setEditTimes({
                              ...editTimes,
                              [schedule.id]: {
                                ...getEditTime(schedule),
                                minute: digits,
                              },
                            })
                          }}
                          className="flex h-9 w-16 rounded-md border border-input bg-transparent px-3 py-1 text-sm text-center shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-between">
                    <DialogClose asChild>
                      <Button variant="destructive" onClick={() => handleDeleteSchedule(schedule.id)}>
                        Hapus
                      </Button>
                    </DialogClose>
                    <div className="flex flex-col-reverse sm:flex-row gap-2">
                      <DialogClose asChild>
                        <Button variant="outline">Batal</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button onClick={() => handleSaveSchedule(schedule.id)}>Simpan</Button>
                      </DialogClose>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="italic text-muted-foreground">tidak ada jadwal</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}