# IEP Prep

IEP Prep is a pastel themed web app for special education professionals to prepare for IEP meetings, capture structured minutes, create follow up tasks, and export meeting packages.

## Tech stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, Storage, and Row Level Security
- PDF export with pdf-lib
- DOCX export with docx
- Stripe subscription scaffolding behind a feature flag

## Local setup

1. Copy `.env.local` and fill in Supabase credentials.
2. Install dependencies with `npm install`.
3. Apply `supabase/schema.sql` in the Supabase SQL editor.
4. Run `npm run dev` and visit `http://localhost:3000`.

## Notes

- The attachments bucket is private and accessed through signed URLs.
- Enable billing by setting `ENABLE_BILLING=true` and configuring Stripe keys.
