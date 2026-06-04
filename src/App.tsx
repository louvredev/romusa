import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CarouselBawah } from "./components/carousel-bawah"
import { CarouselAtas } from "./components/carousel-atas" 
import { MapPin } from 'lucide-react';

export function App() {
  return (
    <div className="flex min-h-svh md:justify-center">
      <div className="flex flex-col w-full max-w-md p-6 gap-4">
        <div className="flex justify-end mt-20 w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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

export default App