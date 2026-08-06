CREATE TABLE IF NOT EXISTS livestock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_type TEXT NOT NULL,
  breed TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  health_status TEXT NOT NULL DEFAULT 'Healthy',
  vaccination_status TEXT NOT NULL DEFAULT 'Up to Date',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE livestock ENABLE ROW LEVEL SECURITY;

-- Allow anon read
CREATE POLICY "anon_select" ON livestock FOR SELECT TO anon USING (true);
-- Allow anon insert
CREATE POLICY "anon_insert" ON livestock FOR INSERT TO anon WITH CHECK (true);
-- Allow anon update
CREATE POLICY "anon_update" ON livestock FOR UPDATE TO anon USING (true) WITH CHECK (true);
-- Allow anon delete
CREATE POLICY "anon_delete" ON livestock FOR DELETE TO anon USING (true);

-- Allow authenticated read
CREATE POLICY "auth_select" ON livestock FOR SELECT TO authenticated USING (true);
-- Allow authenticated insert
CREATE POLICY "auth_insert" ON livestock FOR INSERT TO authenticated WITH CHECK (true);
-- Allow authenticated update
CREATE POLICY "auth_update" ON livestock FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
-- Allow authenticated delete
CREATE POLICY "auth_delete" ON livestock FOR DELETE TO authenticated USING (true);