create extension if not exists pgcrypto;

create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  recipient_name text not null,
  sender_name text default '',
  message text not null,
  birthday_date date,
  extra_data jsonb default '{}'::jsonb,
  theme text default 'glass',
  photo_url text,
  music_url text,
  created_at timestamptz not null default now(),
  expires_at timestamptz default (now() + interval '30 days')
);

create index if not exists cards_created_at_idx
on public.cards(created_at desc);

alter table public.cards enable row level security;

create policy "Anyone can create cards"
on public.cards
for insert
to anon, authenticated
with check (true);

create policy "Anyone can view cards"
on public.cards
for select
to anon, authenticated
using (
  expires_at is null
  or expires_at > now()
);
