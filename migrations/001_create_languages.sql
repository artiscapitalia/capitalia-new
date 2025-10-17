-- Create languages table
CREATE TABLE IF NOT EXISTS languages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(10) NOT NULL UNIQUE,
  native_name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_languages_code ON languages(code);
CREATE INDEX IF NOT EXISTS idx_languages_active ON languages(is_active);
CREATE INDEX IF NOT EXISTS idx_languages_sort_order ON languages(sort_order);

-- Enable Row Level Security
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow all operations for authenticated users (you can restrict this further based on your needs)
CREATE POLICY "Allow all operations for authenticated users" ON languages
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert some default languages
INSERT INTO languages (name, code, native_name, sort_order) VALUES
  ('English', 'en', 'English', 1),
  ('Spanish', 'es', 'Español', 2),
  ('French', 'fr', 'Français', 3),
  ('German', 'de', 'Deutsch', 4),
  ('Italian', 'it', 'Italiano', 5),
  ('Portuguese', 'pt', 'Português', 6),
  ('Russian', 'ru', 'Русский', 7),
  ('Chinese (Simplified)', 'zh-cn', '中文 (简体)', 8),
  ('Japanese', 'ja', '日本語', 9),
  ('Korean', 'ko', '한국어', 10)
ON CONFLICT (code) DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_languages_updated_at
  BEFORE UPDATE ON languages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
