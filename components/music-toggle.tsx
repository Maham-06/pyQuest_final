"use client"

import { useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MusicToggle() {
  const [isMusicOn, setIsMusicOn] = useState(false)

  // This would be connected to actual audio in a real implementation
  const toggleMusic = () => {
    setIsMusicOn(!isMusicOn)
    // Logic to play/pause background music would go here
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleMusic} className="bg-secondary/70 hover:bg-secondary">
      {isMusicOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      <span className="sr-only">Toggle music</span>
    </Button>
  )
}
