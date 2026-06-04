import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTurbidity } from "@/hooks/useTurbidity"

function getBadgeStatus(ntu: number) {
  if (ntu <= 25)   return { label: "Jernih" }
  if (ntu <= 100)  return { label: "Baik",    className: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" }
  if (ntu <= 500)  return { label: "Keruh",   variant: "destructive" as const }
  return               { label: "Berbahaya", variant: "destructive" as const }
}

export function StatusKeruh() {
  const { turbidity, loading } = useTurbidity()

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

  const status = getBadgeStatus(turbidity ?? 0)

  return (
    <Card className="mx-auto w-full max-w-sm overflow-hidden">
      <CardContent className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold tracking-tighter">
              {turbidity?.toFixed(0) ?? "--"}
            </h2>
            <span className="text-xl font-semibold uppercase opacity-90">NTU</span>
          </div>
          <Badge variant={status.variant} className={`px-4 ${status.className ?? ""}`}>
            {status.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}