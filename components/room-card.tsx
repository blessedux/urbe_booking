"use client"

import type { Room } from "@/types/booking"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface RoomCardProps {
  room: Room
  onSelect: (roomId: string) => void
}

export function RoomCard({ room, onSelect }: RoomCardProps) {
  return (
    <Card className="w-full overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[4/3] relative bg-gray-100">
        {room.image ? (
          <Image
            src={room.image}
            alt={room.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
            <span className="text-gray-500 text-sm">No image available</span>
          </div>
        )}
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{room.name}</CardTitle>
        {room.capacity && (
          <p className="text-sm text-muted-foreground">Up to {room.capacity} seats</p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {room.description}
        </p>
        <Button onClick={() => onSelect(room.id)} className="w-full">
          Select Room
        </Button>
      </CardContent>
    </Card>
  )
}
