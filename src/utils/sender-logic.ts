import { DateTime } from 'luxon';

/**
 * Generates a list of sender emails following the pattern:
 * fabri@domain, fabri1@domain, fabri2@domain ... fabri(N-1)@domain
 */
export function generateSenderList(count: number, domain: string): string[] {
    const senders: string[] = [];
    senders.push(`fabri@${domain}`); // The 0-th one is just "fabri"

    for (let i = 1; i < count; i++) {
        senders.push(`fabri${i}@${domain}`);
    }
    return senders;
}

interface RampConfig {
    startQuota: number;
    endQuota: number;
    rampDays: number;
}

/**
 * Calculates how many emails a sender is allowed to send today based on campaign age.
 * Uses a linear ramp-up.
 */
export function calculateDailySenderQuota(
    campaignStartDate: string, // YYYY-MM-DD
    config: RampConfig
): number {
    const start = DateTime.fromISO(campaignStartDate);
    const now = DateTime.now();

    // Days elapsed (0-indexed. Day 0 = Start Date)
    const daysElapsed = Math.floor(now.diff(start, 'days').days);

    if (daysElapsed < 0) return 0; // Not started yet

    if (daysElapsed >= config.rampDays) {
        return config.endQuota;
    }

    // Linear interpolation
    // Day 0: StartQuota
    // Day N: EndQuota
    const progress = daysElapsed / config.rampDays;
    const currentQuota = config.startQuota + (progress * (config.endQuota - config.startQuota));

    return Math.floor(currentQuota);
}
