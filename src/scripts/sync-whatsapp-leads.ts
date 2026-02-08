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
interface Lead {
  id: string;
  first_name: string | null;
  phone: string | null;
  is_vip: boolean;
  source: 'kickstarter' | 'instagram';
}

// ============================================
// Helper Functions
// ============================================

/**
 * Format phone number to raw digits only
 */
function formatPhone(phone: string | null): string {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
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
async function appendToSheet(spreadsheetId: string, values: string[][]): Promise<void> {
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Sheet1!A:B', // Append to columns A and B
    valueInputOption: 'RAW',
    requestBody: { values }
  });
}

/**
 * Mark a lead as sent in the database
 */
async function markAsSent(id: string, source: 'kickstarter' | 'instagram'): Promise<void> {
  const table = source === 'kickstarter' ? 'leads_kickstarter' : 'leads_instagram';
  await pool.query(`UPDATE ${table} SET wa_message_sent = TRUE WHERE id = $1`, [id]);
}

// ============================================
// Main Sync Logic
// ============================================
async function syncLeads(): Promise<void> {
  console.log('Starting WhatsApp lead sync...');
  
  // Query leads from both tables
  const query = `
    SELECT id, first_name, phone, is_vip, 'kickstarter' as source
    FROM leads_kickstarter
    WHERE wa_message_sent = FALSE
      AND created_at < NOW() - INTERVAL '15 minutes'
      AND phone IS NOT NULL
      AND phone != ''
    UNION ALL
    SELECT id, first_name, phone, is_vip, 'instagram' as source
    FROM leads_instagram
    WHERE wa_message_sent = FALSE
      AND created_at < NOW() - INTERVAL '15 minutes'
      AND phone IS NOT NULL
      AND phone != ''
  `;
  
  const result = await pool.query(query);
  const leads: Lead[] = result.rows;
  
  console.log(`Found ${leads.length} leads to sync`);
  
  if (leads.length === 0) {
    console.log('No leads to sync. Exiting.');
    return;
  }
  
  // Separate VIP and Non-VIP leads
  const vipLeads: Lead[] = [];
  const nonVipLeads: Lead[] = [];
  
  for (const lead of leads) {
    if (lead.is_vip) {
      vipLeads.push(lead);
    } else {
      nonVipLeads.push(lead);
    }
  }
  
  console.log(`VIP leads: ${vipLeads.length}, Non-VIP leads: ${nonVipLeads.length}`);
  
  // Process VIP leads
  if (vipLeads.length > 0) {
    const vipRows = vipLeads.map(lead => [
      extractFirstName(lead.first_name),
      formatPhone(lead.phone)
    ]);
    
    console.log('Appending VIP leads to sheet...');
    await appendToSheet(SHEET_ID_VIP!, vipRows);
    
    // Mark as sent
    for (const lead of vipLeads) {
      await markAsSent(lead.id, lead.source);
    }
    console.log(`Marked ${vipLeads.length} VIP leads as sent`);
  }
  
  // Process Non-VIP leads
  if (nonVipLeads.length > 0) {
    const nonVipRows = nonVipLeads.map(lead => [
      extractFirstName(lead.first_name),
      formatPhone(lead.phone)
    ]);
    
    console.log('Appending Non-VIP leads to sheet...');
    await appendToSheet(SHEET_ID_NON_VIP!, nonVipRows);
    
    // Mark as sent
    for (const lead of nonVipLeads) {
      await markAsSent(lead.id, lead.source);
    }
    console.log(`Marked ${nonVipLeads.length} Non-VIP leads as sent`);
  }
  
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
