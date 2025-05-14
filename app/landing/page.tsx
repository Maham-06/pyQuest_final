import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full p-4 flex items-center justify-between bg-secondary/50 backdrop-blur-sm">
        <div className="flex items-center">
          <Link href="/landing">
            <div className="text-primary font-bold text-2xl flex items-center">
              <span className="mr-2">👑</span> PyQuest
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="ghost">Log In</Button>
          </Link>
          <Link href="/auth/register">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Learn Python Through Adventure</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Embark on a coding journey through interactive islands, challenges, and quests. Master Python while having
            fun!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8">
                Get Started
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-4 bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose PyQuest?</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="text-4xl mb-4">🎮</div>
                <h3 className="text-xl font-bold mb-2">Game-Based Learning</h3>
                <p>Learn Python concepts through an engaging adventure game with islands, quests, and challenges.</p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="text-4xl mb-4">💻</div>
                <h3 className="text-xl font-bold mb-2">Interactive Coding</h3>
                <p>Practice Python in our built-in code editor with real-time feedback and automated testing.</p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-bold mb-2">Track Your Progress</h3>
                <p>Monitor your learning journey with detailed progress tracking, achievements, and statistics.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-md">
                <p className="italic mb-4">
                  "PyQuest made learning Python fun and engaging. The game-like approach kept me motivated throughout my
                  learning journey."
                </p>
                <div className="font-bold">- Alex K.</div>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-md">
                <p className="italic mb-4">
                  "As a teacher, I've seen my students' engagement skyrocket since introducing PyQuest in my classroom.
                  Highly recommended!"
                </p>
                <div className="font-bold">- Jamie T., Computer Science Teacher</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-primary/20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Your Python Adventure?</h2>
            <p className="text-xl mb-8">Join thousands of learners who have mastered Python through PyQuest.</p>
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8">
                Sign Up Now - It's Free!
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
