import { Navbar } from "@/components/navbar"
import { HomeIsland } from "@/components/home-island"
import { Footer } from "@/components/footer"
import { MusicToggle } from "@/components/music-toggle"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center p-4 relative">
        <div className="absolute top-4 right-4">
          <MusicToggle />
        </div>

        <h1 className="text-4xl font-bold text-primary mb-8">PyQuest</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          <HomeIsland
            title="Beginner"
            imagePath="/placeholder.svg?height=300&width=300"
            description="Start your Python journey with the basics. Learn syntax, variables, and simple data structures."
            chapterId="beginner"
          />

          <HomeIsland
            title="Intermediate"
            imagePath="/placeholder.svg?height=300&width=300"
            description="Deepen your Python knowledge with functions, classes, and more advanced concepts."
            chapterId="intermediate"
          />

          <HomeIsland
            title="Advanced"
            imagePath="/placeholder.svg?height=300&width=300"
            description="Master Python with advanced topics like decorators, generators, and complex applications."
            chapterId="advanced"
          />
        </div>
      </div>
      <Footer />
    </main>
  )
}
