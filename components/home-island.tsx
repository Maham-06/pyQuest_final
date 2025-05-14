"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"

interface HomeIslandProps {
  title: string
  imagePath: string
  description: string
  chapterId: string
}

export function HomeIsland({ title, imagePath, description, chapterId }: HomeIslandProps) {
  const router = useRouter()
  const [isZooming, setIsZooming] = useState(false)

  const handleIslandClick = () => {
    setIsZooming(true)
    // Navigate after zoom animation starts
    setTimeout(() => {
      router.push(`/chapter/${chapterId}`)
    }, 500)
  }

  return (
    <div className="relative flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2 text-center">{title}</h2>

      <div
        className={`island cursor-pointer ${isZooming ? "zoom-transition scale-150" : ""}`}
        onClick={handleIslandClick}
      >
        <Image
          src={imagePath || "/placeholder.svg"}
          alt={`${title} island`}
          width={300}
          height={300}
          className="rounded-lg"
        />
      </div>

      <div className="chapter-preview absolute top-full mt-2 z-10">
        <Card className="w-64">
          <CardContent className="p-4">
            <p className="text-sm">{description}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
