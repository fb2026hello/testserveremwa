import { Pool } from 'pg';
import { DateTime } from 'luxon';

/**
 * Calculates the daily email limit based on the number of days since the campaign started.
 * Formula: 250 * (days_active ^ 1.5), capped at 1000.
 */
export async function getDailyLimit(pool: Pool): Promise<number> {
    const res = await pool.query("SELECT value FROM campaign_config WHERE key = 'campaign_start_date'");

    // Default to today if not set, meaning strict limit of 250
    const startDateStr = res.rows[0]?.value || DateTime.now().toISODate();
    const startDate = DateTime.fromISO(startDateStr);

    // Days elapsed (minimum 1)
    const daysActive = Math.max(1, Math.floor(DateTime.now().diff(startDate, 'days').days) + 1);

    // Ramp-up formula
    // Day 1: 250
    // Day 2: ~700
    // Day 3+: 1000 (Capped)
    const computedLimit = Math.floor(250 * Math.pow(daysActive, 1.5));

    return Math.min(computedLimit, 1000);
}
