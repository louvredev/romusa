import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { AlertTimer } from "./alert-timer-edit"
import { ChartKeruh } from "./chart-kekeruhan"
import { ChartSuhu } from "./chart-suhu"

export function CarouselBawah() {
  const slides = [
    { id: "timer", component: <AlertTimer /> },
    { id: "keruh", component: <ChartKeruh /> },
    { id: "suhu", component: <ChartSuhu /> },
  ]

  return (
    <div className="flex justify-center w-full px-4">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        orientation="vertical"
        className="w-full max-w-sm h-[380px]"
      >
        <CarouselContent className="-mt-1 h-[380px]">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="pt-1 basis-full h-[380px]">
              <div className="p-1 h-full">{slide.component}</div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}