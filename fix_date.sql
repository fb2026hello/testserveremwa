-- Fix Campaign Start Date
-- The current date in DB is likely 2026-08-02 (August). 
-- Run this to set it to February 1st, 2026 (or your desired start date).

UPDATE campaign_config 
SET value = '2026-02-01' 
WHERE key = 'campaign_start_date';
