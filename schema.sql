-- Complete Database Schema for Email Server
-- Run this in Neon SQL Editor to ensure all required tables/columns exist

-- ============================================
-- 1. CAMPAIGN CONFIG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS campaign_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Insert default campaign start date if not exists
INSERT INTO campaign_config (key, value) 
VALUES ('campaign_start_date', '2026-02-01')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 2. EMAIL LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS email_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    email_address TEXT,
    lead_source TEXT,
    sender_email TEXT,
    email_type TEXT,
    email_version TEXT,
    resend_id TEXT,
    sent_at TIMESTAMP DEFAULT NOW(),
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP
);

-- Add columns if they don't exist (for existing tables)
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS sender_email TEXT;
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS lead_source TEXT;
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS email_type TEXT;
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS email_version TEXT;
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS resend_id TEXT;
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS opened_at TIMESTAMP;
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS clicked_at TIMESTAMP;

-- ============================================
-- 3. LEADS KICKSTARTER TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS leads_kickstarter (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    user_testing_version TEXT,
    email_1_sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Add columns if they don't exist (for existing tables)
ALTER TABLE leads_kickstarter ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE leads_kickstarter ADD COLUMN IF NOT EXISTS user_testing_version TEXT;
ALTER TABLE leads_kickstarter ADD COLUMN IF NOT EXISTS email_1_sent_at TIMESTAMP;

-- ============================================
-- 4. LEADS INSTAGRAM TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS leads_instagram (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    user_testing_version TEXT,
    email_1_sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Add columns if they don't exist (for existing tables)
ALTER TABLE leads_instagram ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE leads_instagram ADD COLUMN IF NOT EXISTS user_testing_version TEXT;
ALTER TABLE leads_instagram ADD COLUMN IF NOT EXISTS email_1_sent_at TIMESTAMP;

-- ============================================
-- 5. INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_email_logs_sender_date ON email_logs (sender_email, sent_at);
CREATE INDEX IF NOT EXISTS idx_leads_ks_email_sent ON leads_kickstarter (email_1_sent_at);
CREATE INDEX IF NOT EXISTS idx_leads_insta_email_sent ON leads_instagram (email_1_sent_at);
