import { useRef, useState, useMemo } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useHistorySuhu } from "@/hooks/useHistorySuhu"

const chartConfig = {
  suhu: {
    label: "Suhu",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

// ✅ Ubah jadi 4 titik = 2 jam
const SLOTS_PER_PAGE = 4

export function ChartSuhu() {
  const { data, loading } = useHistorySuhu()
  const [offset, setOffset] = useState(0)
  const dragStartX = useRef<number | null>(null)
  const dragStartOffset = useRef<number>(0)

  const totalSlots = data.length
  const maxOffset = Math.max(0, totalSlots - SLOTS_PER_PAGE)

  const visibleData = useMemo(() => {
    const end = totalSlots - offset
    const start = Math.max(0, end - SLOTS_PER_PAGE)
    return data.slice(start, end)
  }, [data, offset, totalSlots])

  function onDragStart(clientX: number) {
    dragStartX.current = clientX
    dragStartOffset.current = offset
  }

  function onDragMove(clientX: number) {
    if (dragStartX.current === null) return
    const delta = dragStartX.current - clientX
    const slotDelta = Math.round(delta / 40)
    const newOffset = Math.min(
      maxOffset,
      Math.max(0, dragStartOffset.current + slotDelta)
    )
    setOffset(newOffset)
  }

  function onDragEnd() {
    dragStartX.current = null
  }

  if (loading)
    return (
      <Card className="mx-auto w-full max-w-sm h-full">
        <CardHeader>
          <CardTitle>Suhu</CardTitle>
          <CardDescription>Memuat data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[160px] bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    )

  return (
    <Card className="mx-auto w-full max-w-sm h-full overflow-hidden flex flex-col">
      <CardHeader>
        <CardTitle className="text-center">Suhu</CardTitle>
      </CardHeader>
      <CardContent
        onMouseDown={(e) => onDragStart(e.clientX)}
        onMouseMove={(e) => e.buttons === 1 && onDragMove(e.clientX)}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
        onTouchEnd={onDragEnd}
        className="cursor-grab active:cursor-grabbing select-none flex-1"
      >
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart
            accessibilityLayer
            data={visibleData}
            margin={{
              top: 4,
              left: -20,
              right: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              domain={[0, 40]}
              ticks={[0, 10, 20, 30, 40]}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
            />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              padding={{ left: 20, right: 20 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="suhu"
              type="natural"
              stroke="var(--color-suhu)"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}