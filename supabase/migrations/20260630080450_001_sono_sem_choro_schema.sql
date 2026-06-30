/*
# Sono Sem Choro - Complete Schema

1. New Tables
- `user_profiles` - Stores user/mother profile linked to auth
- `baby_profiles` - Stores baby information
- `video_progress` - Tracks video viewing progress per user
- `day_progress` - Tracks daily method progress
- `diary_entries` - User's reflection diary entries
- `wakeup_entries` - Night wake-up tracking
- `achievements` - User achievement badges
- `audio_library` - Audio files metadata

2. Security
- RLS enabled on all tables
- Owner-scoped policies for authenticated users
- user_id defaults to auth.uid()

3. Notes
- Uses Portuguese (Moçambique) naming conventions
- Supports the 7-day method structure
- Video progress tracks % watched and resumption point
*/

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  mother_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Baby profiles table
CREATE TABLE IF NOT EXISTS baby_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  baby_name text NOT NULL,
  baby_age_range text NOT NULL CHECK (baby_age_range IN ('0-6m', '7-12m', '13-24m', '2+')),
  wakeups_per_night text NOT NULL CHECK (wakeups_per_night IN ('1-2', '3-4', '5+', 'unknown')),
  sleep_association text NOT NULL CHECK (sleep_association IN ('mama', 'arms', 'pacifier', 'stroller')),
  method_start_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Video progress tracking
CREATE TABLE IF NOT EXISTS video_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id text NOT NULL,
  day_number int NOT NULL CHECK (day_number BETWEEN 1 AND 7),
  segundos_assistidos int NOT NULL DEFAULT 0,
  total_segundos int NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  last_watched_at timestamptz DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Daily method progress (7 days)
CREATE TABLE IF NOT EXISTS day_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number int NOT NULL UNIQUE CHECK (day_number BETWEEN 1 AND 7),
  opened_at timestamptz,
  completed_at timestamptz,
  textos_lidos text[] DEFAULT '{}',
  videos_vistos text[] DEFAULT '{}',
  checklist_marcada text[] DEFAULT '{}',
  audio_ouvido boolean DEFAULT false,
  pilula_vista boolean DEFAULT false,
  UNIQUE(user_id, day_number)
);

-- Diary entries (user reflections)
CREATE TABLE IF NOT EXISTS diary_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number int NOT NULL CHECK (day_number BETWEEN 1 AND 7),
  question text NOT NULL,
  answer text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Night wake-up tracking
CREATE TABLE IF NOT EXISTS wakeup_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number int NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  resolved_step int NOT NULL CHECK (resolved_step BETWEEN 1 AND 5),
  duration_seconds int NOT NULL DEFAULT 0,
  date date NOT NULL DEFAULT CURRENT_DATE
);

-- Achievements/Badges
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id text NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Audio library metadata
CREATE TABLE IF NOT EXISTS audio_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  duration_seconds int NOT NULL,
  category text NOT NULL,
  is_method_audio boolean DEFAULT false,
  day_number int CHECK (day_number BETWEEN 1 AND 7 OR day_number IS NULL),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE baby_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE day_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE wakeup_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_library ENABLE ROW LEVEL SECURITY;

-- User profiles policies
DROP POLICY IF EXISTS "select_own_profile" ON user_profiles;
CREATE POLICY "select_own_profile" ON user_profiles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_profile" ON user_profiles;
CREATE POLICY "insert_own_profile" ON user_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_profile" ON user_profiles;
CREATE POLICY "update_own_profile" ON user_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Baby profiles policies
DROP POLICY IF EXISTS "select_own_baby" ON baby_profiles;
CREATE POLICY "select_own_baby" ON baby_profiles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_baby" ON baby_profiles;
CREATE POLICY "insert_own_baby" ON baby_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_baby" ON baby_profiles;
CREATE POLICY "update_own_baby" ON baby_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Video progress policies
DROP POLICY IF EXISTS "select_own_video_progress" ON video_progress;
CREATE POLICY "select_own_video_progress" ON video_progress FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_video_progress" ON video_progress;
CREATE POLICY "insert_own_video_progress" ON video_progress FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_video_progress" ON video_progress;
CREATE POLICY "update_own_video_progress" ON video_progress FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Day progress policies
DROP POLICY IF EXISTS "select_own_day_progress" ON day_progress;
CREATE POLICY "select_own_day_progress" ON day_progress FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_day_progress" ON day_progress;
CREATE POLICY "insert_own_day_progress" ON day_progress FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_day_progress" ON day_progress;
CREATE POLICY "update_own_day_progress" ON day_progress FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Diary entries policies
DROP POLICY IF EXISTS "select_own_diary" ON diary_entries;
CREATE POLICY "select_own_diary" ON diary_entries FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_diary" ON diary_entries;
CREATE POLICY "insert_own_diary" ON diary_entries FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Wakeup entries policies
DROP POLICY IF EXISTS "select_own_wakeups" ON wakeup_entries;
CREATE POLICY "select_own_wakeups" ON wakeup_entries FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_wakeups" ON wakeup_entries;
CREATE POLICY "insert_own_wakeups" ON wakeup_entries FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Achievements policies
DROP POLICY IF EXISTS "select_own_achievements" ON user_achievements;
CREATE POLICY "select_own_achievements" ON user_achievements FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_achievements" ON user_achievements;
CREATE POLICY "insert_own_achievements" ON user_achievements FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Audio library is read-only for all authenticated users
DROP POLICY IF EXISTS "select_audio_library" ON audio_library;
CREATE POLICY "select_audio_library" ON audio_library FOR SELECT
  TO authenticated USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_video_progress_user ON video_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_day_progress_user ON day_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_diary_entries_user ON diary_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_wakeup_entries_user ON wakeup_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_wakeup_entries_date ON wakeup_entries(date);

-- Function to mark video as completed when 90% watched
CREATE OR REPLACE FUNCTION check_video_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.segundos_assistidos >= (NEW.total_segundos * 0.9) AND NEW.completed = false THEN
    NEW.completed := true;
    NEW.completed_at := now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_video_completion ON video_progress;
CREATE TRIGGER trigger_video_completion
  BEFORE UPDATE ON video_progress
  FOR EACH ROW
  EXECUTE FUNCTION check_video_completion();