import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { DateTime } from 'luxon';

dotenv.config();

if (!process.env.DATABASE_URL) {
    console.error('Missing DATABASE_URL');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function main() {
    console.log('--- Email Campaign Metrics ---');
    console.log(`Generated at: ${DateTime.now().toLocaleString(DateTime.DATETIME_MED)}`);

    const query = `
    SELECT 
      'kickstarter' as source,
      user_testing_version as version,
      COUNT(id) as sent
    FROM leads_kickstarter
    WHERE email_1_sent_at IS NOT NULL
    GROUP BY user_testing_version
    
    UNION ALL
    
    SELECT 
      'instagram' as source,
      user_testing_version as version,
      COUNT(id) as sent
    FROM leads_instagram
    WHERE email_1_sent_at IS NOT NULL
    GROUP BY user_testing_version
    
    ORDER BY source, version;
  `;

    try {
        const { rows } = await pool.query(query);

        console.table(rows);

    } catch (error) {
        console.error('Error fetching metrics:', error);
    } finally {
        await pool.end();
    }
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
