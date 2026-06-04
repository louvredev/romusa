import { Card, CardContent } from "@/components/ui/card"

export function StatusTimer() {
  return (
    <Card className="mx-auto w-full max-w-sm relative overflow-hidden">
      <CardContent className="flex justify-between items-center">
        <p className="text-sm md:text-base text-gray">
          Jadwal Pakan Selanjutnya
        </p>
        <span className="font-bold tracking-wider">
          12:30
        </span>
      </CardContent>
    </Card>
  )
}