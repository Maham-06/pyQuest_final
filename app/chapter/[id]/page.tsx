import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ChapterLevels } from "@/components/chapter-levels"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface ChapterPageProps {
  params: {
    id: string
  }
}

export default function ChapterPage({ params }: ChapterPageProps) {
  const chapterId = params.id

  // This would come from your database in a real app
  const chapterData = {
    beginner: {
      title: "Beginner",
      description: "Start your Python journey with the basics",
      levels: [
        {
          id: "variables",
          title: "Variables & Data Types",
          description: "Learn about variables and basic data types in Python",
        },
        {
          id: "operators",
          title: "Operators",
          description: "Understand arithmetic, comparison, and logical operators",
        },
        { id: "conditionals", title: "Conditionals", description: "Master if, elif, and else statements" },
        { id: "loops", title: "Loops", description: "Learn about for and while loops" },
        { id: "lists", title: "Lists", description: "Work with Python lists and their methods" },
      ],
    },
    intermediate: {
      title: "Intermediate",
      description: "Deepen your Python knowledge",
      levels: [
        { id: "functions", title: "Functions", description: "Create and use functions effectively" },
        { id: "dictionaries", title: "Dictionaries", description: "Master Python dictionaries" },
        { id: "classes", title: "Classes & OOP", description: "Introduction to Object-Oriented Programming" },
        { id: "modules", title: "Modules & Packages", description: "Learn to organize code with modules" },
        { id: "error-handling", title: "Error Handling", description: "Handle exceptions and errors" },
      ],
    },
    advanced: {
      title: "Advanced",
      description: "Master Python with advanced topics",
      levels: [
        { id: "decorators", title: "Decorators", description: "Understand and create Python decorators" },
        { id: "generators", title: "Generators", description: "Work with generators and iterators" },
        { id: "async", title: "Async Programming", description: "Learn asynchronous programming" },
        { id: "testing", title: "Testing", description: "Write tests for your Python code" },
        { id: "advanced-oop", title: "Advanced OOP", description: "Dive deeper into object-oriented concepts" },
      ],
    },
  }

  const chapter = chapterData[chapterId as keyof typeof chapterData]

  if (!chapter) {
    return <div>Chapter not found</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Map
              </Link>
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold">{chapter.title}</h1>
            <p className="text-lg">{chapter.description}</p>
          </div>

          <ChapterLevels levels={chapter.levels} chapterId={chapterId} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
