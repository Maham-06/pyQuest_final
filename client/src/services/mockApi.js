const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock user data
const mockUser = {
  _id: "mock123",
  name: "Demo User",
  email: "demo@example.com",
  avatar: null,
  xp: 350,
  streak: 5,
  musicEnabled: true,
  createdAt: new Date().toISOString(),
}

// Mock chapters
const mockChapters = [
  {
    _id: "chapter1",
    title: "Beginner",
    description: "Start your Python journey with the basics",
    difficulty: "beginner",
    order: 1,
    imagePath: "/placeholder.svg?height=300&width=300",
  },
  {
    _id: "chapter2",
    title: "Intermediate",
    description: "Deepen your Python knowledge",
    difficulty: "intermediate",
    order: 2,
    imagePath: "/placeholder.svg?height=300&width=300",
    isLocked: true,
  },
  {
    _id: "chapter3",
    title: "Advanced",
    description: "Master Python with advanced topics",
    difficulty: "advanced",
    order: 3,
    imagePath: "/placeholder.svg?height=300&width=300",
    isLocked: true,
  },
]

// Mock levels
const mockLevels = {
  chapter1: {
    id: "chapter1",
    title: "Beginner",
    description: "Start your Python journey with the basics",
    difficulty: "beginner",
    levels: [
      {
        id: "level1",
        title: "Variables & Data Types",
        description: "Learn about variables and basic data types in Python",
        progress: { completed: true, stars: 3, attempts: 2 },
        exercises: [
          { id: "ex1-1", title: "Basic Concepts", completed: true },
          { id: "ex1-2", title: "Practical Application", completed: true },
          { id: "ex1-3", title: "Advanced Challenge", completed: true },
        ],
      },
      {
        id: "level2",
        title: "Operators",
        description: "Understand arithmetic, comparison, and logical operators",
        progress: { completed: false, stars: 0, attempts: 1 },
        exercises: [
          { id: "ex2-1", title: "Basic Concepts", completed: true },
          { id: "ex2-2", title: "Practical Application", completed: false },
          { id: "ex2-3", title: "Advanced Challenge", completed: false },
        ],
      },
      {
        id: "level3",
        title: "Conditionals",
        description: "Master if, elif, and else statements",
        progress: { completed: false, attempts: 0 },
        isLocked: true,
        exercises: [
          { id: "ex3-1", title: "Basic Concepts", completed: false },
          { id: "ex3-2", title: "Practical Application", completed: false },
          { id: "ex3-3", title: "Advanced Challenge", completed: false },
        ],
      },
      {
        id: "level4",
        title: "Loops",
        description: "Learn about for and while loops",
        progress: { completed: false, attempts: 0 },
        isLocked: true,
        exercises: [
          { id: "ex4-1", title: "Basic Concepts", completed: false },
          { id: "ex4-2", title: "Practical Application", completed: false },
          { id: "ex4-3", title: "Advanced Challenge", completed: false },
        ],
      },
      {
        id: "level5",
        title: "Lists",
        description: "Work with Python lists and their methods",
        progress: { completed: false, attempts: 0 },
        isLocked: true,
        exercises: [
          { id: "ex5-1", title: "Basic Concepts", completed: false },
          { id: "ex5-2", title: "Practical Application", completed: false },
          { id: "ex5-3", title: "Advanced Challenge", completed: false },
        ],
      },
      {
        id: "level6",
        title: "Dictionaries",
        description: "Master Python dictionaries and key-value pairs",
        progress: { completed: false, attempts: 0 },
        isLocked: true,
        exercises: [
          { id: "ex6-1", title: "Basic Concepts", completed: false },
          { id: "ex6-2", title: "Practical Application", completed: false },
          { id: "ex6-3", title: "Advanced Challenge", completed: false },
        ],
      },
      {
        id: "level7",
        title: "Functions",
        description: "Create and use functions effectively",
        progress: { completed: false, attempts: 0 },
        isLocked: true,
        exercises: [
          { id: "ex7-1", title: "Basic Concepts", completed: false },
          { id: "ex7-2", title: "Practical Application", completed: false },
          { id: "ex7-3", title: "Advanced Challenge", completed: false },
        ],
      },
      {
        id: "level8",
        title: "Error Handling",
        description: "Handle exceptions and errors in Python",
        progress: { completed: false, attempts: 0 },
        isLocked: true,
        exercises: [
          { id: "ex8-1", title: "Basic Concepts", completed: false },
          { id: "ex8-2", title: "Practical Application", completed: false },
          { id: "ex8-3", title: "Advanced Challenge", completed: false },
        ],
      },
    ],
  },
}

// Mock level content
const mockLevelContent = {
  level1: {
    id: "level1",
    title: "Variables & Data Types",
    description: "Learn about variables and basic data types in Python",
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
    initialCode: "# Write your code here\n\n",
    instructions: "Create a variable called 'message' with the value 'Hello, Python!' and print it.",
    chapter: {
      id: "chapter1",
      title: "Beginner",
      difficulty: "beginner",
    },
    xpReward: 50,
    exercises: [
      {
        id: "ex1-1",
        title: "Basic Concepts",
        description: "Learn the fundamental concepts of variables",
        content: `
# Variables & Data Types - Basic Concepts

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
        initialCode: "# Write your code here\n\n",
        instructions: "Create a variable called 'message' with the value 'Hello, Python!' and print it.",
        completed: true,
      },
      {
        id: "ex1-2",
        title: "Practical Application",
        description: "Apply what you've learned to solve a practical problem",
        content: `
# Variables & Data Types - Practical Application

Now that you understand the basic concepts of variables, let's apply them to a practical scenario.

Variables can be used to store and manipulate data in your programs. For example, you might use variables to track a player's score in a game:

\`\`\`python
player_name = "Adventurer"
score = 0

# Player completes a quest
score = score + 100

# Display the result
print(player_name + " scored " + str(score) + " points!")
\`\`\`

Notice how we had to convert the numeric score to a string using \`str()\` to concatenate it with other strings.
        `,
        initialCode:
          "# Create variables for a player's name and score\n# Then display a message showing the name and score\n\n",
        instructions: "Create variables for a player's name and score, then display a message showing both values.",
        completed: true,
      },
      {
        id: "ex1-3",
        title: "Advanced Challenge",
        description: "Test your mastery with a more complex challenge",
        content: `
# Variables & Data Types - Advanced Challenge

Ready to push your skills further? Let's explore more complex data manipulations.

Python allows you to work with different data types and convert between them:

\`\`\`python
# Type conversion
age = 25
age_text = str(age)  # Convert to string
age_float = float(age)  # Convert to float

# String formatting
message = f"I am {age} years old"  # f-strings (Python 3.6+)
message2 = "I am {} years old".format(age)  # .format() method
\`\`\`

F-strings are a powerful way to embed expressions inside string literals.
        `,
        initialCode:
          "# Create a program that calculates and displays the area of a rectangle\n# Use variables for length and width\n# Use f-strings to display the result\n\n",
        instructions:
          "Create a program that calculates and displays the area of a rectangle using variables and f-strings.",
        completed: true,
      },
    ],
  },
}

// Mock notifications
const mockNotifications = [
  {
    _id: "notif1",
    type: "badge_earned",
    title: "Badge Earned",
    message: "You earned the First Steps badge!",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "notif2",
    type: "level_completed",
    title: "Level Completed",
    message: "You completed Variables & Data Types and earned 50 XP!",
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
]

// Mock API functions
const mockApi = {
  // Auth endpoints
  login: async (credentials) => {
    await delay(1000) // Simulate network delay
    if (credentials.email === "demo@example.com" && credentials.password === "password") {
      // Make sure we're returning the expected format with token and user
      return {
        success: true,
        token: "mock-token",
        user: mockUser,
      }
    }
    throw { response: { data: { message: "Invalid credentials" } } }
  },

  register: async (userData) => {
    await delay(1500)
    return { success: true, token: "mock-token", user: { ...mockUser, ...userData } }
  },

  getCurrentUser: async () => {
    await delay(800)
    return { success: true, user: mockUser }
  },

  // Chapters endpoints
  getAllChapters: async () => {
    await delay(800)
    return { success: true, chapters: mockChapters }
  },

  getChapterById: async (id) => {
    await delay(1000)
    if (mockLevels[id]) {
      return { success: true, chapter: mockLevels[id] }
    }
    throw { response: { data: { message: "Chapter not found" } } }
  },

  // Levels endpoints
  getLevelById: async (id) => {
    await delay(1000)
    if (mockLevelContent[id]) {
      return { success: true, level: mockLevelContent[id], progress: { completed: false, attempts: 0 } }
    }
    throw { response: { data: { message: "Level not found" } } }
  },

  submitSolution: async (id, data) => {
    await delay(1500)
    return { success: true, message: "Solution submitted" }
  },

  completeLevel: async (id, data) => {
    await delay(2000)
    return {
      success: true,
      xpEarned: 50,
      currentXp: mockUser.xp + 50,
      earnedBadges: [
        {
          id: "badge1",
          name: "First Steps",
          description: "Complete your first Python level",
          icon: "🏆",
        },
      ],
      nextLevel: { id: "level2", title: "Operators" },
    }
  },

  // User endpoints
  getUserProgress: async () => {
    await delay(1000)
    return {
      success: true,
      progress: [],
      badges: [
        {
          _id: "userbadge1",
          badge: {
            _id: "badge1",
            name: "First Steps",
            description: "Complete your first Python level",
            icon: "🏆",
          },
        },
      ],
      user: { xp: mockUser.xp, streak: mockUser.streak },
    }
  },

  getDashboard: async () => {
    await delay(1200)
    return {
      success: true,
      user: { xp: mockUser.xp, streak: mockUser.streak, lastActive: new Date().toISOString() },
      progress: [
        {
          _id: "chapter1",
          chapterTitle: "Beginner",
          difficulty: "beginner",
          completedLevels: 2,
          totalLevels: 8,
          totalStars: 5,
        },
      ],
      recentBadges: [
        {
          _id: "userbadge1",
          badge: {
            _id: "badge1",
            name: "First Steps",
            description: "Complete your first Python level",
            icon: "🏆",
          },
        },
      ],
    }
  },

  // Notifications endpoint
  getNotifications: async () => {
    await delay(1000)
    return {
      success: true,
      notifications: mockNotifications,
    }
  },

  markNotificationAsRead: async (id) => {
    await delay(500)
    return {
      success: true,
      message: "Notification marked as read",
    }
  },

  // Compiler endpoints
  executeCode: async (data) => {
    await delay(1500)
    if (data.code.includes('print("Hello, Python!")')) {
      return { success: true, output: "Hello, Python!" }
    }
    return { success: true, output: "Output will appear here" }
  },

  testCode: async (data) => {
    await delay(2000)
    const passed = data.code.includes('print("Hello, Python!")')
    return {
      success: true,
      results: [
        {
          description: "Check if the message is printed correctly",
          input: "",
          expectedOutput: "Hello, Python!",
          actualOutput: passed ? "Hello, Python!" : "No output",
          passed: passed,
        },
      ],
      allPassed: passed,
      stars: passed ? 3 : 0,
    }
  },
}

export default mockApi
