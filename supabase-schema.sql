create table if not exists site_state (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists bookings (
  id uuid primary key,
  name text not null,
  phone text not null,
  booking_date text not null,
  guests integer not null,
  status text not null default 'new',
  note text not null default '',
  created_at timestamptz not null default now()
);

insert into storage.buckets (id, name, public)
values ('nauat-assets', 'nauat-assets', true)
on conflict (id) do update set public = true;

create policy "Public read nauat assets"
on storage.objects for select
using (bucket_id = 'nauat-assets');
