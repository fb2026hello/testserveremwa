import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { log_id, dest } = req.query;

    if (!log_id || !dest) {
        return res.status(400).send('Missing parameters');
    }

    const destination = decodeURIComponent(dest as string);

    try {
        // Async Logging
        // Async Logging
        const logRes = await pool.query(
            `UPDATE email_logs 
             SET has_clicked = TRUE, clicked_at = NOW() 
             WHERE id = $1 
             RETURNING user_id, lead_source`,
            [log_id]
        );

        if (logRes.rows.length > 0) {
            const { user_id, lead_source } = logRes.rows[0];
            const table = lead_source === 'instagram' ? 'leads_instagram' : 'leads_kickstarter';

            if (table === 'leads_instagram' || table === 'leads_kickstarter') {
                await pool.query(
                    `UPDATE ${table} SET email_1_clicked_at = NOW() WHERE id = $1`,
                    [user_id]
                );
            }
        }

        // Redirect
        res.redirect(302, destination);

    } catch (error) {
        console.error('Track Click Error:', error);
        // Fallback redirect even if DB fails
        res.redirect(302, destination);
    }
}
