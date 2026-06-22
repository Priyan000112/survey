# Deploy Notes

## Vercel

Untuk deploy ke Vercel, **jangan** andalkan file lokal `data/votes.json`.

Gunakan env ini di Vercel:

```bash
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_VOTES_TABLE=votes
ALLOW_FILE_VOTE_STORE=false
```

## Local

Untuk local development tanpa Supabase, pakai:

```bash
ALLOW_FILE_VOTE_STORE=true
```

Lalu votes akan disimpan ke `data/votes.json`.

## Schema

Jalankan SQL di [supabase-schema.sql](/home/infra/web-survey/supabase-schema.sql) sebelum deploy.
