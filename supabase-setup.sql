-- Script SQL per creare la tabella smoking in Supabase
-- Esegui questo script nell'editor SQL della dashboard di Supabase

CREATE TABLE IF NOT EXISTS smoking (
  id BIGSERIAL PRIMARY KEY,
  data_inserimento TIMESTAMPTZ NOT NULL,
  data_chiusura TIMESTAMPTZ NULL,
  tiri INTEGER NOT NULL,
  luogo VARCHAR(255) NOT NULL
);

ALTER TABLE smoking ENABLE ROW LEVEL SECURITY;

-- Policy aperta solo per sviluppo e test.
DROP POLICY IF EXISTS "Allow all operations" ON smoking;
CREATE POLICY "Allow all operations" ON smoking
  FOR ALL
  USING (true)
  WITH CHECK (true);

