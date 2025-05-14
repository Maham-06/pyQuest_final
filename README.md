# PyQuest - Python Learning Adventure

PyQuest is an interactive platform for learning Python through an adventure-themed narrative. Users progress through chapters and levels, earning XP, badges, and unlocking new content as they learn.

## Features

- 🔐 **Authentication & User Management**
  - JWT-based authentication
  - OAuth2.0 with Google and GitHub
  - Password reset and email verification

- 👤 **User Profile & Settings**
  - Customizable avatars
  - Progress tracking
  - Music toggle preference

- 🏆 **Progress & Gamification**
  - XP system
  - Badges and achievements
  - Streak tracking

- 📚 **Content System**
  - Structured chapters and levels
  - Interactive Python code execution
  - Auto-grading with test cases

- 🔔 **Notifications**
  - In-app notifications for achievements
  - Email notifications for important events

## Tech Stack

- **Frontend**: React.js with Next.js
- **Backend**: Express.js (Node.js)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT, Passport.js
- **Code Execution**: JDoodle API
- **Email**: Nodemailer

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Supabase account
- JDoodle API credentials

### Installation

1. Clone the repository:
   \`\`\`
   git clone https://github.com/yourusername/pyquest.git
   cd pyquest
   \`\`\`

2. Install dependencies:
   \`\`\`
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   \`\`\`

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both server and client directories
   - Fill in the required environment variables

4. Set up the database:
   - Run the SQL scripts in `server/db/schema.sql` and `server/db/seed.sql` in your Supabase SQL editor

5. Start the development servers:
   \`\`\`
   # Start server
   cd server
   npm run dev

   # Start client
   cd ../client
   npm run dev
   \`\`\`

6. Open your browser and navigate to `http://localhost:3000`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
