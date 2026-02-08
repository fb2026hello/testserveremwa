import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import validate from 'deep-email-validator';

dotenv.config();

// Initialize DB Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const INVALID_CSV_PATH = path.join(process.cwd(), 'CsvsUpload', 'Invalid_emails.csv');

// Helper to write to Invalid CSV
function logInvalidEmail(email: string, reason: string) {
    const header = 'email,reason\n';
    const line = `${email},${reason}\n`;

    if (!fs.existsSync(INVALID_CSV_PATH)) {
        fs.writeFileSync(INVALID_CSV_PATH, header);
    }
    fs.appendFileSync(INVALID_CSV_PATH, line);
}

async function validateAndClean(email: string) {
    if (!email || !email.includes('@')) return;

    try {
        console.log(`Checking: ${email}...`);
        const res = await validate({
            email: email,
            sender: 'fabri@launch.clura.dev', // Good to look legitimate logic
            validateRegex: true,
            validateMx: true,
            validateTypo: true,
            validateDisposable: true,
            validateSMTP: true,
        });

        if (!res.valid) {
            const reason = res.reason || 'unknown';
            console.log(`❌ Invalid (${reason}): ${email}`);

            // 1. Log to CSV
            logInvalidEmail(email, reason);

            // 2. Delete from DB (Both tables to be sure)
            await pool.query('DELETE FROM leads_kickstarter WHERE email = $1', [email]);
            await pool.query('DELETE FROM leads_instagram WHERE email = $1', [email]);
        } else {
            console.log(`✅ Valid: ${email}`);
        }
    } catch (err) {
        console.error(`Error checking ${email}:`, err);
    }
}

async function processCsv(filePath: string) {
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return;
    }

    const parser = fs.createReadStream(filePath).pipe(
        parse({
            columns: true,
            skip_empty_lines: true,
            trim: true,
        })
    );

    for await (const record of parser) {
        const email = record['email'] || record['Email'] || record['EMAIL'];
        if (email) {
            await validateAndClean(email);
            // Throttle slightly to avoid aggressive rate limiting
            await new Promise((r) => setTimeout(r, 1000));
        }
    }
}

async function main() {
    console.log('Starting Email Verification...');
    console.log('NOTE: This process takes time due to SMTP checks.');

    // Clear previous invalid log? Optional. User implied "add to", so appending is safer, 
    // but maybe we want a fresh start. Let's append as implemented.

    // 1. Check Kickstarter CSV
    console.log('\n--- Processing Kickstarter CSV ---');
    await processCsv(path.join(process.cwd(), 'CsvsUpload', 'technology_design_backers_cleaned.csv'));

    // 2. Check Instagram CSV
    console.log('\n--- Processing Instagram CSV ---');
    await processCsv(path.join(process.cwd(), 'CsvsUpload', 'names_and_emails_insta.csv'));

    console.log('\nVerification Complete. Invalid emails logged to CsvsUpload/Invalid_emails.csv');
    await pool.end();
}

main().catch(console.error);
