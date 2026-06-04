import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSuhu } from "@/hooks/useSuhu"

function getBadgeStatus(suhu: number) {
  if (suhu >= 26 && suhu <= 30) return { label: "Sangat Baik" }
  if (suhu >= 24 && suhu < 26)  return { label: "Baik", className: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" }
  if (suhu > 30 && suhu <= 32)  return { label: "Hangat", variant: "destructive" }
  return { label: "Waspada", variant: "destructive" }
}

export function StatusSuhu() {
  const { suhu, loading } = useSuhu()

  if (loading) return (
    <Card className="mx-auto w-full max-w-sm overflow-hidden">
      <CardContent className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="h-10 w-24 bg-muted animate-pulse rounded" />
          <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
        </div>
      </CardContent>
    </Card>
  )

  const status = getBadgeStatus(suhu ?? 0)

  return (
    <Card className="mx-auto w-full max-w-sm overflow-hidden">
      <CardContent className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold tracking-tighter">
              {suhu?.toFixed(1) ?? "--"}
            </h2>
            <span className="text-xl font-semibold uppercase opacity-90">°C</span>
          </div>
          <Badge variant={status.variant as any} className="px-4">
            {status.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}