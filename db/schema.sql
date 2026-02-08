-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Campaign Configuration
CREATE TABLE IF NOT EXISTS campaign_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

INSERT INTO campaign_config (key, value) 
VALUES ('campaign_start_date', CURRENT_DATE::text) 
ON CONFLICT (key) DO NOTHING;

-- 2. Leads Tables (Split by Source)
-- Drop old users table if it exists (Data Migration: None assumed, fresh import)
DROP TABLE IF EXISTS users CASCADE;

-- Table A: Kickstarter Superbackers
CREATE TABLE IF NOT EXISTS leads_kickstarter (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Segmentation
    user_testing_version TEXT, -- 'A', 'B', 'C'

    -- Email Status
    email_1_sent_at TIMESTAMP WITH TIME ZONE,
    email_2_sent_at TIMESTAMP WITH TIME ZONE,
    email_3_sent_at TIMESTAMP WITH TIME ZONE
);

-- Table B: Instagram Contacts
CREATE TABLE IF NOT EXISTS leads_instagram (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Segmentation
    user_testing_version TEXT, -- 'A', 'B', 'C'

    -- Email Status
    email_1_sent_at TIMESTAMP WITH TIME ZONE,
    email_2_sent_at TIMESTAMP WITH TIME ZONE,
    email_3_sent_at TIMESTAMP WITH TIME ZONE
);

-- 3. Email Logs (Tracking)
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- Logical FK, but no constraint to allow multi-table support
    email_address TEXT NOT NULL,
    sender_email TEXT, -- The specific 'fabriN@...' address that sent this
    
    -- Source Tracking
    lead_source TEXT NOT NULL, -- 'kickstarter' OR 'instagram'
    
    -- Metadata
    email_type TEXT NOT NULL, -- e.g. 'Email_1_Superbacker'
    email_version TEXT, -- 'A', 'B', 'C'
    
    -- Provider Info
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resend_id TEXT,

    -- Engagement
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    click_destination TEXT
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_leads_ks_email ON leads_kickstarter(email);
CREATE INDEX IF NOT EXISTS idx_leads_ig_email ON leads_instagram(email);
CREATE INDEX IF NOT EXISTS idx_logs_sent_at ON email_logs(sent_at);
