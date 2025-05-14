"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Level {
  id: string
  title: string
  description: string
}

interface ChapterLevelsProps {
  levels: Level[]
  chapterId: string
}

export function ChapterLevels({ levels, chapterId }: ChapterLevelsProps) {
  const router = useRouter()

  const handleLevelClick = (levelId: string) => {
    router.push(`/chapter/${chapterId}/level/${levelId}`)
  }

  return (
    <ScrollArea className="w-full h-[500px] pr-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {levels.map((level) => (
          <Card
            key={level.id}
            className="level-card cursor-pointer hover:shadow-lg"
            onClick={() => handleLevelClick(level.id)}
          >
            <CardHeader>
              <CardTitle>{level.title}</CardTitle>
              <CardDescription>{level.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${Math.floor(Math.random() * 100)}%` }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}
