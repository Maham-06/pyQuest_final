import { Link } from "react-router-dom"
import Footer from "../components/Footer"
import FeatureShowcase from "../components/FeatureShowcase"
import { ArrowRight, Code, Award, Map } from "lucide-react"

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full p-4 flex items-center justify-between bg-secondary/50 backdrop-blur-sm">
        <div className="flex items-center">
          <Link to="/">
            <div className="text-primary font-bold text-2xl flex items-center">
              <span className="mr-2">👑</span> PyQuest
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/auth/login">
            <button className="px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">Log In</button>
          </Link>
          <Link to="/auth/register">
            <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md">Sign Up</button>
          </Link>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-4 text-center bg-gradient-to-b from-secondary/30 to-transparent">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-pixel">Embark on Your Python Adventure</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Journey through magical islands of code, conquer programming challenges, and become a Python wizard!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register">
              <button className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-md text-lg font-semibold flex items-center gap-2">
                Begin Your Quest <ArrowRight size={18} />
              </button>
            </Link>
            <a href="#features">
              <button className="px-8 py-3 border border-gray-300 dark:border-gray-600 rounded-md text-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                Discover the Realm
              </button>
            </a>
          </div>
        </section>

        {/* Interactive Code Demo Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 font-pixel">Master Python Through Adventure</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">Interactive Python Compiler</h3>
                <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md font-mono text-sm mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">python_quest.py</span>
                  </div>
                  <pre className="text-gray-800 dark:text-gray-200">
                    <code>{`# Your first Python quest
def greet_adventurer(name):
    return f"Welcome, {name}, to the realm of Python!"

# Call the function
message = greet_adventurer("Brave Coder")
print(message)

# Output: Welcome, Brave Coder, to the realm of Python!`}</code>
                  </pre>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Write, test, and run Python code directly in your browser. Get instant feedback and level up your
                  skills!
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-3 rounded-full">
                    <Code size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Interactive Learning</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Practice Python with real-time feedback. Our built-in compiler lets you write and test code
                      instantly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-3 rounded-full">
                    <Map size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Adventure-Based Journey</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Navigate through themed islands, each representing different Python concepts. Unlock new areas as
                      you progress.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-3 rounded-full">
                    <Award size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Achievements & Rewards</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Earn badges, unlock achievements, and collect rewards as you master Python concepts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-4 bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 font-pixel">Your Quest Awaits</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform transition-transform hover:scale-105">
                <div className="text-4xl mb-4">🎮</div>
                <h3 className="text-xl font-bold mb-2">Game-Based Learning</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Learn Python concepts through an engaging adventure game with islands, quests, and challenges.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform transition-transform hover:scale-105">
                <div className="text-4xl mb-4">💻</div>
                <h3 className="text-xl font-bold mb-2">Interactive Coding</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Practice Python in our built-in code editor with real-time feedback and automated testing.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform transition-transform hover:scale-105">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-bold mb-2">Track Your Progress</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Monitor your learning journey with detailed progress tracking, achievements, and statistics.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Path Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 font-pixel">Your Learning Adventure</h2>

            <div className="relative">
              {/* Path line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary/50 transform -translate-x-1/2 hidden md:block"></div>

              <div className="space-y-12 relative">
                <FeatureShowcase
                  title="Chapter 1: The Beginner's Valley"
                  description="Start your journey in the peaceful valley where Python basics await. Learn variables, data types, and simple operations."
                  image="/placeholder.svg?height=300&width=500"
                  imageAlt="Beginner's Valley"
                  icon="🏕️"
                  reverse={false}
                />

                <FeatureShowcase
                  title="Chapter 2: The Forest of Functions"
                  description="Venture into the mysterious forest where you'll master functions, loops, and conditional statements."
                  image="/placeholder.svg?height=300&width=500"
                  imageAlt="Forest of Functions"
                  icon="🌲"
                  reverse={true}
                />

                <FeatureShowcase
                  title="Chapter 3: The Mountains of Objects"
                  description="Climb the challenging mountains to learn object-oriented programming, classes, and inheritance."
                  image="/placeholder.svg?height=300&width=500"
                  imageAlt="Mountains of Objects"
                  icon="⛰️"
                  reverse={false}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-transparent to-secondary/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 font-pixel">Tales from Fellow Adventurers</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <img
                    src="https://api.dicebear.com/6.x/adventurer/svg?seed=Felix"
                    alt="Avatar"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold">Alex K.</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Python Apprentice</p>
                  </div>
                </div>
                <p className="italic mb-4 text-gray-600 dark:text-gray-300">
                  "PyQuest made learning Python fun and engaging. The game-like approach kept me motivated throughout my
                  learning journey. I've tried other platforms before, but none made coding feel like an adventure!"
                </p>
                <div className="text-yellow-500">★★★★★</div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <img
                    src="https://api.dicebear.com/6.x/adventurer/svg?seed=Jamie"
                    alt="Avatar"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold">Jamie T.</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Computer Science Teacher</p>
                  </div>
                </div>
                <p className="italic mb-4 text-gray-600 dark:text-gray-300">
                  "As a teacher, I've seen my students' engagement skyrocket since introducing PyQuest in my classroom.
                  The adventure theme makes learning programming concepts feel like a game rather than a chore."
                </p>
                <div className="text-yellow-500">★★★★★</div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <img
                    src="https://api.dicebear.com/6.x/adventurer/svg?seed=Morgan"
                    alt="Avatar"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold">Morgan L.</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Career Changer</p>
                  </div>
                </div>
                <p className="italic mb-4 text-gray-600 dark:text-gray-300">
                  "I was intimidated by programming until I found PyQuest. The step-by-step quests and instant feedback
                  helped me build confidence. Now I'm using Python daily in my new data analyst role!"
                </p>
                <div className="text-yellow-500">★★★★★</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-primary/20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 font-pixel">Ready to Begin Your Python Adventure?</h2>
            <p className="text-xl mb-8">Join thousands of adventurers who have mastered Python through PyQuest.</p>
            <Link to="/auth/register">
              <button className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-md text-lg font-semibold flex items-center gap-2 mx-auto">
                Embark on Your Journey <ArrowRight size={20} />
              </button>
            </Link>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">No credit card required. Start for free.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default LandingPage
