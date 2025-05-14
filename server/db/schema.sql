-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  avatar VARCHAR(255),
  google_id VARCHAR(255),
  github_id VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  music_enabled BOOLEAN DEFAULT TRUE,
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reset_password_token VARCHAR(255),
  reset_password_expires TIMESTAMP WITH TIME ZONE,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chapters Table
CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  difficulty VARCHAR(50) NOT NULL,
  display_order INTEGER NOT NULL, -- Using display_order instead of reserved keyword "order"
  image_path VARCHAR(255) DEFAULT '/placeholder.svg',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Levels Table
CREATE TABLE IF NOT EXISTS levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL, -- Using display_order instead of reserved keyword "order"
  content JSONB NOT NULL,
  initial_code TEXT DEFAULT '# Write your code here\n\n',
  instructions TEXT NOT NULL,
  test_cases JSONB,
  xp_reward INTEGER DEFAULT 50,
  is_active BOOLEAN DEFAULT TRUE,
  prerequisites JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Progress Table
CREATE TABLE IF NOT EXISTS progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  level_id UUID REFERENCES levels(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  stars INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  last_attempt_date TIMESTAMP WITH TIME ZONE,
  completion_date TIMESTAMP WITH TIME ZONE,
  time_spent INTEGER DEFAULT 0, -- Time spent in seconds
  code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, level_id)
);

-- Badges Table
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon VARCHAR(255) NOT NULL,
  criteria_type VARCHAR(50) NOT NULL,
  criteria_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Badges Table
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  seen BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  related_id UUID,
  on_model VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_github_id ON users(github_id);
CREATE INDEX IF NOT EXISTS idx_chapters_display_order ON chapters(display_order);
CREATE INDEX IF NOT EXISTS idx_levels_chapter_id ON levels(chapter_id);
CREATE INDEX IF NOT EXISTS idx_levels_display_order ON levels(display_order);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_level_id ON progress(level_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Create RLS policies for security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for users (only see own data)
CREATE POLICY users_policy ON users
  FOR ALL
  USING (auth.uid() = id);

-- Create policy for chapters (all users can read)
CREATE POLICY chapters_read_policy ON chapters
  FOR SELECT
  USING (true);

-- Create policy for levels (all users can read)
CREATE POLICY levels_read_policy ON levels
  FOR SELECT
  USING (true);

-- Create policy for progress (only see own progress)
CREATE POLICY progress_policy ON progress
  FOR ALL
  USING (auth.uid() = user_id);

-- Create policy for badges (all users can read)
CREATE POLICY badges_read_policy ON badges
  FOR SELECT
  USING (true);

-- Create policy for user_badges (only see own badges)
CREATE POLICY user_badges_policy ON user_badges
  FOR ALL
  USING (auth.uid() = user_id);

-- Create policy for notifications (only see own notifications)
CREATE POLICY notifications_policy ON notifications
  FOR ALL
  USING (auth.uid() = user_id);
