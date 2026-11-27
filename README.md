# ChumaMart Hardware Website v2

Mobile-first Next.js 14 PWA for ChumaMart Hardware, Nakuru Industrial Area.

## Stack
- **Framework**: Next.js 14 (App Router)
- **Database / Auth / Storage**: Supabase
- **Styling**: Tailwind CSS
- **State**: Zustand (Quote List, localStorage-persisted)
- **Payments**: Safaricom Daraja (M-Pesa STK Push)
- **SMS**: Africa's Talking
- **Email**: Resend
- **Hosting**: Vercel

## Local development

```bash
cp .env.local.example .env.local
# Fill in keys (see .env.local.example)

npm install
npm run dev        # http://localhost:3000

# Apply Supabase migrations
npx supabase db push
```

## Environment variables

See `.env.local.example` for the full list.

## Supabase

Migrations are in `supabase/migrations/`. Run with `npx supabase db push` or via the Supabase dashboard.
