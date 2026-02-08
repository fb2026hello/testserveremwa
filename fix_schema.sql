-- Fix user_id type in email_logs
-- Run this in Neon SQL Editor to change user_id from INTEGER to TEXT (or UUID)

-- 1. Drop the old integer column (safest way to change type if data exists, or use ALTER COLUMN with casting)
-- ALTER TABLE email_logs DROP COLUMN user_id;
-- ALTER TABLE email_logs ADD COLUMN user_id TEXT;

-- OR Better: Change type directly
ALTER TABLE email_logs ALTER COLUMN user_id TYPE TEXT;

-- Verify other columns are present (just in case)
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS sender_email TEXT;
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS lead_source TEXT;
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS email_type TEXT;
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS email_version TEXT;
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS resend_id TEXT;
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS opened_at TIMESTAMP;
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS clicked_at TIMESTAMP;
