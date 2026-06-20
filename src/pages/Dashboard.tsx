import { Profile } from "@/components/profile"
import { CarouselBawah } from "@/components/carousel-bawah"
import { CarouselAtas } from "@/components/carousel-atas"
import { MapPin } from "lucide-react"

export function Dashboard() {
  return (
    <div className="flex min-h-svh md:justify-center">
      <div className="flex flex-col w-full max-w-md p-6 gap-4">
        <Profile />
        <h1 className="flex items-center gap-2 ml-4 text-xs">
          <MapPin className="text-red-400" /> SMKN 4 Kota Bogor
        </h1>
        <div className="w-full">
          <CarouselAtas />
        </div>
        <div className="w-full">
          <CarouselBawah />
        </div>
      </div>
    </div>
  )
}