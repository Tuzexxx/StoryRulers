-- Supabase SQL Schema for StoryRulers
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)

-- Game saves table
CREATE TABLE IF NOT EXISTS game_saves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  language TEXT,
  theme TEXT,
  youngest_age INTEGER DEFAULT 6,
  players_context TEXT,
  world_memory JSONB DEFAULT '[]'::jsonb,
  public_chronicle JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE game_saves ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own saves
CREATE POLICY "Users can read their own saves"
  ON game_saves FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saves"
  ON game_saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saves"
  ON game_saves FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saves"
  ON game_saves FOR DELETE
  USING (auth.uid() = user_id);

-- Index for fast lookups by user
CREATE INDEX IF NOT EXISTS idx_game_saves_user_id ON game_saves(user_id);
