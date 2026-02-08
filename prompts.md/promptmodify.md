# Refactor Repository for WhatsApp Lead Sync

I need to completely refactor this repository. It currently functions as an email server, but I want to transform it into a **Google Sheets Sync System** for WhatsApp leads.

Please follow these steps to modify the codebase:

### 1. Cleanup (Delete Unused Files)
Remove all files related to sending emails, as they are no longer needed.
* **Delete:** `src/templates/*` (all email templates)
* **Delete:** `src/utils/sender-logic.ts`, `src/utils/email-validator.ts`
* **Delete:** `src/scripts/send-batch.ts`, `src/scripts/send-test.ts`
* **Keep:** `src/lib/db.ts` (or wherever the DB connection logic resides) and `src/utils/timezone.ts`.

### 2. Implement Sync Logic (`src/scripts/sync-whatsapp-leads.ts`)
Create a new script that performs the following logic:

**A. Database Query (Safe Backlog Processing)**
Fetch users who meet **ALL** of these criteria:
* `wa_message_sent` is `FALSE`.
* `created_at` is older than **15 minutes** (`created_at < NOW() - INTERVAL '15 minutes'`).
    * *Note: Do NOT put an upper limit (like "older than 15 but newer than 90"). If the system goes down for a day, we must catch up on everyone in the backlog.*
* Has a valid phone number.

**B. Formatting**
* Format the phone number to be raw digits only (remove all non-numeric characters like `+`, `-`, or spaces).
* Extract the First Name (split full name by space).

**C. Google Sheets Integration (Optimized)**
* Use the `googleapis` library.
* Authenticate using a Service Account (from environment variable `GOOGLE_SERVICE_ACCOUNT_JSON`).
* Define two target Spreadsheet IDs from env vars: `SHEET_ID_VIP` and `SHEET_ID_NON_VIP`.
* **Important Performance Rule:** Do **NOT** read the entire Google Sheet to check for duplicates. Rely entirely on the database state (`wa_message_sent`) as the source of truth. If the DB says they haven't been sent, append them.

**D. Appending**
* Append a row with columns: `[First Name, Formatted Phone Number]`.
* Add to the **VIP Sheet** if `is_vip` is true.
* Add to the **Non-VIP Sheet** if `is_vip` is false.

**E. Finalize**
* Immediately after appending, update the user record in the database:
  `UPDATE users SET wa_message_sent = TRUE WHERE id = ...`

### 4. GitHub Actions Workflow (`.github/workflows/sync-leads.yml`)
Create a workflow file that:
* Runs on a schedule: `cron: '*/15 * * * *'` (Run every 15 minutes to keep the list fresh).
* Allows manual trigger (`workflow_dispatch`).
* Sets up Node.js.
* Installs dependencies.
* Runs the script: `npx ts-node src/scripts/sync-whatsapp-leads.ts`.
* Passes the following secrets as environment variables:
    * `DATABASE_URL_NEW` (The new DB connection string)
    * `GOOGLE_SERVICE_ACCOUNT_JSON`
    * `SHEET_ID_VIP`
    * `SHEET_ID_NON_VIP`