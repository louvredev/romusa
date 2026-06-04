import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function StatusPakan() {
  return (
    <Card className="mx-auto w-full max-w-sm overflow-hidden">
      <CardContent className=" flex justify-between items-start">
        <div className="space-y-1">
            <div className="flex items-baseline gap-2">
                <h2 className="text-4xl font-bold tracking-tighter">100</h2>
                <span className="text-xl font-semibold uppercase opacity-90">%</span>
            </div>
            <Badge className="px-4">Pakan Penuh</Badge>
        </div>
      </CardContent>
    </Card>
  )
}