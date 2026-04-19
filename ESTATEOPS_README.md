# EstateOps AI — Agent 1 setup (Codespace)

## 1 · Env vars (nextjs/.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://fkpxolnsqjfgcbkiqbld.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from Supabase Dashboard>
PRIVATE_SUPABASE_SERVICE_KEY=<service_role key>
ANTHROPIC_API_KEY=<your key>
```

Get Supabase keys: https://supabase.com/dashboard/project/fkpxolnsqjfgcbkiqbld/settings/api

## 2 · Install + run
```
cd nextjs
npm install
npm run dev
```

## 3 · Test
Open `http://localhost:3000/tickets/new`. Click a Sample, press Run Estimator. Expect ~2-4s latency.

Verify persistence:
```sql
select id, category, priority, estimated_cost_usd, responsibility, created_at
from estateops.tickets
order by created_at desc limit 5;
```

## Files added
- `src/lib/agents/estimator.ts` — Claude Sonnet 4.6 tool-use call, typed output
- `src/app/api/agents/estimator/route.ts` — POST /api/agents/estimator, persists to estateops.tickets
- `src/app/(estateops)/layout.tsx` — sticky header for /tickets/*
- `src/app/(estateops)/tickets/new/page.tsx` — form + result card

## Schema
Schema `estateops` inside Cafepedia project. Tables: properties, units, vendors (20 seeded), tickets, comms_log.
