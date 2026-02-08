-- Migration: Add WhatsApp tracking columns
-- Run this migration to enable WhatsApp lead sync functionality

-- Add wa_message_sent and is_vip columns to leads_kickstarter
ALTER TABLE leads_kickstarter ADD COLUMN IF NOT EXISTS wa_message_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE leads_kickstarter ADD COLUMN IF NOT EXISTS is_vip BOOLEAN DEFAULT FALSE;
ALTER TABLE leads_kickstarter ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add wa_message_sent and is_vip columns to leads_instagram
ALTER TABLE leads_instagram ADD COLUMN IF NOT EXISTS wa_message_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE leads_instagram ADD COLUMN IF NOT EXISTS is_vip BOOLEAN DEFAULT FALSE;
ALTER TABLE leads_instagram ADD COLUMN IF NOT EXISTS phone TEXT;

-- Back-fill existing rows to wa_message_sent = TRUE (so only new leads are processed)
UPDATE leads_kickstarter SET wa_message_sent = TRUE WHERE wa_message_sent IS NULL OR wa_message_sent = FALSE;
UPDATE leads_instagram SET wa_message_sent = TRUE WHERE wa_message_sent IS NULL OR wa_message_sent = FALSE;

-- Performance indexes for the sync query
CREATE INDEX IF NOT EXISTS idx_ks_wa_pending ON leads_kickstarter(wa_message_sent) WHERE wa_message_sent = FALSE;
CREATE INDEX IF NOT EXISTS idx_ig_wa_pending ON leads_instagram(wa_message_sent) WHERE wa_message_sent = FALSE;
