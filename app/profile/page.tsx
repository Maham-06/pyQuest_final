import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Profile</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>User Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Username:</span>
                    <span className="font-medium">pythonLearner42</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Email:</span>
                    <span className="font-medium">user@example.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Joined:</span>
                    <span className="font-medium">Jan 15, 2023</span>
                  </div>

                  <Button variant="outline" size="sm" className="mt-4">
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Beginner</span>
                      <span className="text-sm font-medium">80%</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Intermediate</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Advanced</span>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">XP Points:</span>
                    <span className="font-medium">1,245</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Levels Completed:</span>
                    <span className="font-medium">12/25</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Streak:</span>
                    <span className="font-medium">5 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Badges:</span>
                    <span className="font-medium">7</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="achievements">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="history">Learning History</TabsTrigger>
            </TabsList>

            <TabsContent value="achievements">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Your Achievements</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="flex flex-col items-center p-3 bg-secondary/30 rounded-lg">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                          {i % 2 === 0 ? "🏆" : "🌟"}
                        </div>
                        <span className="text-sm font-medium text-center">Achievement {i + 1}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Account Settings</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Email Notifications</span>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Change Password</span>
                        <Button variant="outline" size="sm">
                          Update
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Preferences</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Dark Mode</span>
                        <Button variant="outline" size="sm">
                          Toggle
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Sound Effects</span>
                        <Button variant="outline" size="sm">
                          On
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Learning History</h3>
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-start gap-4 p-3 bg-secondary/30 rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          {i % 3 === 0 ? "📝" : i % 3 === 1 ? "🧪" : "🏁"}
                        </div>
                        <div>
                          <h4 className="font-medium">Completed Level {5 - i}</h4>
                          <p className="text-sm text-muted-foreground">
                            {i % 2 === 0 ? "Beginner" : "Intermediate"} -{" "}
                            {i % 3 === 0 ? "Variables" : i % 3 === 1 ? "Functions" : "Classes"}
                          </p>
                          <p className="text-xs mt-1">
                            {i} day{i !== 1 ? "s" : ""} ago
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
