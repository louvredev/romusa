import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { StatusKeruh } from "./status-kekeruhan"
import { StatusSuhu } from "./status-suhu"

export function CarouselAtas() {
  const slides = [
    { id: "status-keruh", component: <StatusKeruh /> },
    { id: "status-suhu", component: <StatusSuhu /> },
  ]

  return (
    <div className="flex justify-center w-full px-4">
      <Carousel 
        opts={{ 
          align: "start",
          loop: true, // Membuat carousel bisa terus berputar
        }} 
        orientation="vertical" 
        className="w-full max-w-sm h-[130px]" 
      >
        <CarouselContent className="-mt-1 h-[130px]">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="pt-1 basis-full">
              <div className="p-1">
                {slide.component}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}