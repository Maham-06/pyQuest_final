"use client"
import ReactMarkdown from "react-markdown"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LevelContentProps {
  content: string
}

export function LevelContent({ content }: LevelContentProps) {
  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </ScrollArea>
  )
}
