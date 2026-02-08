# System Architecture

```mermaid
graph TD
    subgraph "Development (Your PC)"
        Local[.env file] -->|Config| LocalScript[npm run send-batch]
        LocalScript -->|Sends via| Resend[Resend API]
    end

    subgraph "Production (GitHub Actions)"
        Secrets[GitHub Repository Secrets] -->|Config| GHAction[Scheduled Workflow]
        GHAction -->|Runs hourly| Script[src/scripts/send-batch.ts]
        Script -->|Sends via| Resend
    end

    subgraph "Tracking (Vercel)"
        User[Email Recipient] -->|Opens/Clicks| VercelAPI[api/track/*]
        VercelAPI -->|Updates| DB[(Neon Database)]
    end

    Script -->|Reads| DB
    LocalScript -->|Reads| DB
```

## Key Concept: Two Separate Worlds
1.  **Your Computer (Local)**: Uses `.env` file. You run scripts manually here.
2.  **GitHub Actions (Cloud)**: Does **NOT** have your `.env` file. It uses **GitHub Secrets**.
    *   This is where the *automatic* hourly emails happen.

## Vercel's Role
Vercel **only** hosts the "Tracking Pixels" and "Link Redirects". It does **not** send the emails.
*   When a user opens an email, they are technically visiting your Vercel site (`clura.dev/api/track/open`).
