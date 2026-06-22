create table if not exists public.votes (
  id bigint generated always as identity primary key,
  candidate_id text not null,
  issue text not null,
  dusun text not null,
  age_group text not null,
  satisfaction text not null,
  session_id text not null,
  fingerprint_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists votes_created_at_idx on public.votes (created_at desc);
create unique index if not exists votes_session_id_uidx on public.votes (session_id);
create index if not exists votes_fingerprint_hash_idx on public.votes (fingerprint_hash);
