import { Pool } from 'pg';
import { google } from 'googleapis';
import * as dotenv from 'dotenv';

dotenv.config();

// ============================================
// Configuration
// ============================================
const DATABASE_URL = process.env.DATABASE_URL_NEW || process.env.DATABASE_URL;
const GOOGLE_SERVICE_ACCOUNT_JSON = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
const SHEET_ID_VIP = process.env.SHEET_ID_VIP;
const SHEET_ID_NON_VIP = process.env.SHEET_ID_NON_VIP;

// Validate required environment variables
if (!DATABASE_URL) throw new Error('DATABASE_URL_NEW or DATABASE_URL is required');
if (!GOOGLE_SERVICE_ACCOUNT_JSON) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is required');
if (!SHEET_ID_VIP) throw new Error('SHEET_ID_VIP is required');
if (!SHEET_ID_NON_VIP) throw new Error('SHEET_ID_NON_VIP is required');

// ============================================
// Database Connection
// ============================================
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ============================================
// Google Sheets Setup
// ============================================
interface ServiceAccountCredentials {
  client_email: string;
  private_key: string;
}

const credentials: ServiceAccountCredentials = JSON.parse(GOOGLE_SERVICE_ACCOUNT_JSON);

const auth = new google.auth.JWT(
  credentials.client_email,
  undefined,
  credentials.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({ version: 'v4', auth });

// ============================================
// Types
// ============================================
interface User {
  id: number;
  name: string | null;
  phone_number: string | null;
  is_vip: boolean;
}

// ============================================
// Helper Functions
// ============================================

/**
 * Format phone number to raw digits only, as a number
 */
function formatPhone(phone: string | null): number | string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  return digits ? Number(digits) : '';
}

/**
 * Extract first name from full name
 */
function extractFirstName(name: string | null): string {
  if (!name) return '';
  return name.split(' ')[0] || '';
}

/**
 * Append a row to a Google Sheet
 */
async function appendToSheet(spreadsheetId: string, values: (string | number)[][]): Promise<void> {
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Sheet1!A:B',
    valueInputOption: 'RAW',
    requestBody: { values }
  });
}

/**
 * Mark a user as sent in the database
 */
async function markAsSent(id: number): Promise<void> {
  await pool.query('UPDATE users SET wa_message_sent = TRUE WHERE id = $1', [id]);
}

// ============================================
// Main Sync Logic
// ============================================
async function syncLeads(): Promise<void> {
  console.log('Starting WhatsApp lead sync...');

  // Debug: Check total pending users (without time filter)
  const debugQuery = `
    SELECT COUNT(*) as total,
           COUNT(*) FILTER (WHERE created_at < NOW() - INTERVAL '15 minutes') as older_than_15min
    FROM users
    WHERE wa_message_sent = FALSE
      AND phone_number IS NOT NULL
      AND phone_number != ''
  `;
  const debugResult = await pool.query(debugQuery);
  console.log(`Debug: Total pending users with phone: ${debugResult.rows[0].total}`);
  console.log(`Debug: Users older than 15 min: ${debugResult.rows[0].older_than_15min}`);

  // Query users where wa_message_sent = FALSE and has a phone number
  // 15-minute delay to allow for data to settle
  const query = `
    SELECT id, name, phone_number, is_vip
    FROM users
    WHERE wa_message_sent = FALSE
      AND created_at < NOW() - INTERVAL '15 minutes'
      AND phone_number IS NOT NULL
      AND phone_number != ''
  `;

  const result = await pool.query(query);
  const users: User[] = result.rows;

  console.log(`Found ${users.length} users to sync`);

  if (users.length === 0) {
    console.log('No users to sync. Exiting.');
    await pool.end();
    return;
  }

  // Separate VIP and Non-VIP users
  const vipUsers: User[] = [];
  const nonVipUsers: User[] = [];

  for (const user of users) {
    if (user.is_vip) {
      vipUsers.push(user);
    } else {
      nonVipUsers.push(user);
    }
  }

  console.log(`VIP users: ${vipUsers.length}, Non-VIP users: ${nonVipUsers.length}`);

  // Process VIP users
  if (vipUsers.length > 0) {
    const vipRows = vipUsers.map(user => [
      extractFirstName(user.name),
      formatPhone(user.phone_number)
    ]);

    console.log('Appending VIP users to sheet...');
    await appendToSheet(SHEET_ID_VIP!, vipRows);

    // Mark as sent
    for (const user of vipUsers) {
      await markAsSent(user.id);
    }
    console.log(`Marked ${vipUsers.length} VIP users as sent`);
  }

  // Process Non-VIP users
  if (nonVipUsers.length > 0) {
    const nonVipRows = nonVipUsers.map(user => [
      extractFirstName(user.name),
      formatPhone(user.phone_number)
    ]);

    console.log('Appending Non-VIP users to sheet...');
    await appendToSheet(SHEET_ID_NON_VIP!, nonVipRows);

    // Mark as sent
    for (const user of nonVipUsers) {
      await markAsSent(user.id);
    }
    console.log(`Marked ${nonVipUsers.length} Non-VIP users as sent`);
  }

  await pool.end();
  console.log('Sync completed successfully!');
}

// ============================================
// Entry Point
// ============================================
syncLeads()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Sync failed:', error);
    process.exit(1);
  });
