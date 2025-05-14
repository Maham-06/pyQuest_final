import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Progress Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">48%</div>
                <Progress value={48} className="h-2 mb-4" />
                <p className="text-sm text-muted-foreground">You've completed 12 out of 25 levels</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Current Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">5 days</div>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className={`h-2 flex-1 rounded-full ${i < 5 ? "bg-primary" : "bg-secondary"}`} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Keep going! Your best streak was 12 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>XP Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">1,245 XP</div>
                <Progress value={65} className="h-2 mb-4" />
                <p className="text-sm text-muted-foreground">155 XP until next level</p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-bold mb-4">Chapter Progress</h2>

          <div className="grid grid-cols-1 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Beginner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-2">
                  <span>Progress: 80%</span>
                  <span>4/5 levels completed</span>
                </div>
                <Progress value={80} className="h-2 mb-4" />

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
                  {["Variables", "Operators", "Conditionals", "Loops", "Lists"].map((level, i) => (
                    <Card key={i} className={`${i < 4 ? "bg-primary/20" : "bg-secondary/30"}`}>
                      <CardContent className="p-4 text-center">
                        <div className="text-sm font-medium">{level}</div>
                        <div className="text-xs mt-1">{i < 4 ? "Completed" : "In Progress"}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-4 text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/chapter/beginner">
                      Continue Learning
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Intermediate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-2">
                  <span>Progress: 45%</span>
                  <span>2/5 levels completed</span>
                </div>
                <Progress value={45} className="h-2 mb-4" />

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
                  {["Functions", "Dictionaries", "Classes", "Modules", "Error Handling"].map((level, i) => (
                    <Card
                      key={i}
                      className={`${i < 2 ? "bg-primary/20" : i === 2 ? "bg-secondary/30" : "bg-muted/30"}`}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-sm font-medium">{level}</div>
                        <div className="text-xs mt-1">{i < 2 ? "Completed" : i === 2 ? "In Progress" : "Locked"}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-4 text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/chapter/intermediate">
                      Continue Learning
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Advanced</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-2">
                  <span>Progress: 10%</span>
                  <span>0/5 levels completed</span>
                </div>
                <Progress value={10} className="h-2 mb-4" />

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
                  {["Decorators", "Generators", "Async", "Testing", "Advanced OOP"].map((level, i) => (
                    <Card key={i} className={`${i === 0 ? "bg-secondary/30" : "bg-muted/30"}`}>
                      <CardContent className="p-4 text-center">
                        <div className="text-sm font-medium">{level}</div>
                        <div className="text-xs mt-1">{i === 0 ? "In Progress" : "Locked"}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-4 text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/chapter/advanced">
                      Continue Learning
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
