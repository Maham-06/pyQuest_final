import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LevelContent } from "@/components/level-content"
import { PythonCompiler } from "@/components/python-compiler"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface LevelPageProps {
  params: {
    id: string
    levelId: string
  }
}

export default function LevelPage({ params }: LevelPageProps) {
  const { id: chapterId, levelId } = params

  // This would come from your database in a real app
  const levelData = {
    variables: {
      title: "Variables & Data Types",
      content: `
# Variables & Data Types

In Python, variables are used to store data values. Unlike other programming languages, Python has no command for declaring a variable. A variable is created the moment you first assign a value to it.

## Examples:

\`\`\`python
# Integer
x = 5

# String
name = "PyQuest"

# Boolean
is_active = True

# Float
price = 9.99
\`\`\`

Try creating your own variables in the editor!
      `,
      exercise: {
        instructions: "Create a variable called 'message' with the value 'Hello, Python!' and print it.",
        initialCode: "# Write your code here\n\n",
        testCases: [
          {
            input: "",
            expectedOutput: "Hello, Python!",
            description: "Check if the message is printed correctly",
          },
        ],
      },
    },
    // Other level data would be defined here
  }

  const level = levelData[levelId as keyof typeof levelData]

  if (!level) {
    return <div>Level not found</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-4">
        <div className="mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/chapter/${chapterId}`}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Chapter
            </Link>
          </Button>
        </div>

        <h1 className="text-2xl font-bold mb-4">{level.title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg shadow-md p-4">
            <LevelContent content={level.content} />
          </div>

          <div className="bg-card rounded-lg shadow-md p-4">
            <PythonCompiler
              initialCode={level.exercise.initialCode}
              instructions={level.exercise.instructions}
              testCases={level.exercise.testCases}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
