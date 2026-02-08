import { Pool } from 'pg';
import { validateEmail } from '../utils/email-validator';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import * as dotenv from 'dotenv';
import { DateTime } from 'luxon';
import { isWithinSendingWindow } from '../utils/timezone';
import { generateSenderList, calculateDailySenderQuota } from '../utils/sender-logic';
import SuperbackerEmailA from '../templates/SuperbackerA';
import SuperbackerEmailB from '../templates/SuperbackerB';
import SuperbackerEmailC from '../templates/SuperbackerC';
import InstagramEmailA from '../templates/InstagramA';
import InstagramEmailB from '../templates/InstagramB';
import InstagramEmailC from '../templates/InstagramC';
import * as cheerio from 'cheerio';

dotenv.config();

// Configuration Check
if (!process.env.DATABASE_URL || !process.env.RESEND_API_KEY || !process.env.TRACKING_DOMAIN) {
    console.error('Missing required environment variables.');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const resend = new Resend(process.env.RESEND_API_KEY);
const TRACKING_DOMAIN = process.env.TRACKING_DOMAIN;

// --- CONFIGURATION ---
// 1. Instagram
const INSTA_DOMAIN = 'launch.clura.dev';
const INSTA_SENDERS_COUNT = 100;
const INSTA_RAMP = { startQuota: 25, endQuota: 100, rampDays: 6 };

// 2. Kickstarter
const KS_DOMAIN = 'ks.clura.dev';
const KS_SENDERS_COUNT = 40;
const KS_RAMP = { startQuota: 25, endQuota: 40, rampDays: 6 };

async function processBatch(
    campaignStart: string,
    senders: string[],
    rampConfig: any,
    sourceTable: string,
    sourceType: 'kickstarter' | 'instagram'
) {
    console.log(`\n--- Processing ${sourceType.toUpperCase()} Batch ---`);
    console.log(`Load: ${senders.length} senders. Domain: ${sourceType === 'instagram' ? INSTA_DOMAIN : KS_DOMAIN}`);

    const quotaPerSender = calculateDailySenderQuota(campaignStart, rampConfig);
    console.log(`Today's Quota per Sender: ${quotaPerSender}`);

    if (quotaPerSender <= 0) {
        console.log('Quota is 0. Skipping.');
        return;
    }

    const today = DateTime.now().toISODate();

    // Hourly Pacing Logic
    // We want to spread the quota over the remaining hours of the day (until 24:00).
    const centralTime = DateTime.now().setZone('America/Chicago');
    const currentHour = centralTime.hour;
    const sendingWindowEnd = 24;
    let hoursLeft = sendingWindowEnd - currentHour;
    if (hoursLeft < 1) hoursLeft = 1; // Safety net, though loop usually runs in window

    console.log(`Current Hour (CST): ${currentHour}. Hours Left: ${hoursLeft}`);

    for (const senderEmail of senders) {
        // 1. Check how many this specific sender has sent today
        const countRes = await pool.query(
            'SELECT COUNT(*) FROM email_logs WHERE sender_email = $1 AND sent_at::date = $2',
            [senderEmail, today]
        );
        const sentToday = parseInt(countRes.rows[0].count);
        const remainingDaily = quotaPerSender - sentToday;

        if (remainingDaily <= 0) {
            // console.log(`Sender ${senderEmail} exhausted quota (${sentToday}/${quotaPerSender}).`);
            continue;
        }

        // Calculate limit for THIS specific run to ensure spread
        // Example: Quota 25. Hours left 10. Limit = ceil(25/10) = 3.
        const batchLimit = Math.ceil(remainingDaily / hoursLeft);

        // console.log(`Sender ${senderEmail}: Daily Left ${remainingDaily}. Batch Limit ${batchLimit}.`);

        // 2. Fetch Leads
        const query = `
            SELECT id, email, name, user_testing_version 
            FROM ${sourceTable} 
            WHERE email_1_sent_at IS NULL 
            LIMIT $1
        `;
        const { rows: leads } = await pool.query(query, [batchLimit]);

        if (leads.length === 0) {
            console.log(`No more leads remaining in ${sourceTable}.`);
            break; // No point checking other senders if no leads left
        }

        // 3. Send
        for (const lead of leads) {
            try {
                // INLINE VALIDATION
                const validation = await validateEmail(lead.email, senderEmail);

                if (!validation.isValid) {
                    console.log(`❌ Skipped invalid email: ${lead.email} (${validation.reason}). Deleting...`);
                    // Delete from DB
                    await pool.query(`DELETE FROM ${sourceTable} WHERE id = $1`, [lead.id]);
                    continue; // Skip sending
                }

                await sendEmail(lead, senderEmail, sourceType);

                // Small delay between sends to be polite
                // Rate Limit: Max 2 emails/second (Resend limit). 600ms + processing time > 500ms.
                await new Promise(resolve => setTimeout(resolve, 600));
            } catch (err) {
                console.error(`Error sending from ${senderEmail} to ${lead.email}:`, err);
            }
        }
    }
}

async function sendEmail(user: any, senderEmail: string, sourceType: 'kickstarter' | 'instagram') {
    // 1. Assign Group if missing
    let version = user.user_testing_version;
    if (!version) {
        const versions = ['A', 'B', 'C'];
        version = versions[Math.floor(Math.random() * versions.length)];
        const table = sourceType === 'instagram' ? 'leads_instagram' : 'leads_kickstarter'; // Safe interpolation
        await pool.query(`UPDATE ${table} SET user_testing_version = $1 WHERE id = $2`, [version, user.id]);
    }

    // 2. Select Template
    let emailComponent;
    let subject = '';

    if (sourceType === 'kickstarter') {
        if (version === 'A') {
            emailComponent = SuperbackerEmailA({ name: user.name });
            subject = 'Open Source hardware + 3D printer enclosure = better and safer printing';
        } else if (version === 'B') {
            emailComponent = SuperbackerEmailB({ name: user.name });
            subject = 'Open source hardware + Aerospace eng. student = Awesome 3D printer enclosure';
        } else {
            emailComponent = SuperbackerEmailC({ name: user.name });
            subject = 'The 3D printer enclosure I wished someone built (Open Source & Affordable)';
        }
    } else {
        // Instagram Logic
        if (version === 'A') {
            emailComponent = InstagramEmailA({ name: user.name });
            subject = 'Open Source hardware + 3D printer enclosure = better and safer printing';
        } else if (version === 'B') {
            emailComponent = InstagramEmailB({ name: user.name });
            subject = 'The Ultimate 3D printer enclosure for your Prusa MK3/4 & Prusa Mini';
        } else {
            emailComponent = InstagramEmailC({ name: user.name });
            subject = "I don't care if you buy this.";
        }
    }

    // 3. Render & Inject Tracking
    let html = render(emailComponent);
    const $ = cheerio.load(html);

    // Log Entry to get ID
    const logRes = await pool.query(
        'INSERT INTO email_logs (user_id, email_address, lead_source, sender_email, email_type, email_version) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [user.id, user.email, sourceType, senderEmail, `Email_1_${sourceType}`, version]
    );
    const logId = logRes.rows[0].id;

    // Inject Open Pixel - REMOVED per user request
    // $('body').append(`<img src="${TRACKING_DOMAIN}/api/track/open?log_id=${logId}" alt="" width="1" height="1" style="display:none;" />`);

    // Inject Click Tracking & UTMs
    $('a').each(function (this: any) {
        let href = $(this).attr('href');
        if (href) {
            // UTM Injection for clura.dev links
            if (href.includes('clura.dev') && !href.includes('utm_source')) {
                const separator = href.includes('?') ? '&' : '?';
                const utmParams = `utm_source=${sourceType}&utm_medium=email&utm_campaign=cold_outreach_v1&utm_content=version_${version}`;
                href = `${href}${separator}${utmParams}`;
            }

            // Wrap in Tracking
            const trackedUrl = `${TRACKING_DOMAIN}/api/track/click?log_id=${logId}&dest=${encodeURIComponent(href)}`;
            $(this).attr('href', trackedUrl);
        }
    });

    const finalHtml = $.html();

    // 4. Send Email
    // Note: senderEmail must be "Name <email>" format or just email. 
    // We construct it here.
    const fromAddress = `Fabrizio <${senderEmail}>`;

    const data = await resend.emails.send({
        from: fromAddress,
        to: user.email,
        subject: subject,
        html: finalHtml,
    });

    if (data.error) {
        console.error(`Failed to send to ${user.email} from ${senderEmail}:`, data.error);
        return;
    }

    // 5. Update DB
    const table = sourceType === 'instagram' ? 'leads_instagram' : 'leads_kickstarter';
    await pool.query(
        `UPDATE ${table} SET email_1_sent_at = NOW() WHERE id = $1`,
        [user.id]
    );
    await pool.query(
        'UPDATE email_logs SET resend_id = $1 WHERE id = $2',
        [data.data?.id, logId]
    );

    console.log(`[${sourceType}] Sent to ${user.email} from ${senderEmail} (Vs: ${version})`);
}

async function main() {
    console.log('Starting Multi-Sender Batch Job...');

    // 0. Safety Switch
    if (process.env.ENABLE_SENDING !== 'true') {
        console.log('🛑 Sending is DISABLED. Set ENABLE_SENDING=true in .env to enable.');
        process.exit(0);
    }

    // 1. Timezone Guard
    if (!isWithinSendingWindow()) {
        console.log('Outside of sending window (07:00 - 23:00 CST). Exiting.');
        process.exit(0);
    }

    // 2. Fetch Campaign Start Date
    const configRes = await pool.query("SELECT value FROM campaign_config WHERE key = 'campaign_start_date'");
    const startDate = configRes.rows[0]?.value || DateTime.now().toISODate();
    console.log(`Campaign Start Date: ${startDate}`);

    // 3. Process Kickstarter Batch
    const ksSenders = generateSenderList(KS_SENDERS_COUNT, KS_DOMAIN);
    await processBatch(startDate, ksSenders, KS_RAMP, 'leads_kickstarter', 'kickstarter');

    // 4. Process Instagram Batch
    const instaSenders = generateSenderList(INSTA_SENDERS_COUNT, INSTA_DOMAIN);
    await processBatch(startDate, instaSenders, INSTA_RAMP, 'leads_instagram', 'instagram');

    console.log('Batch completed.');
    await pool.end(); // Important to close pool
    process.exit(0);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
