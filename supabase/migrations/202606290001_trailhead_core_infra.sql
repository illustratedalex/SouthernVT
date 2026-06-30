-- Trailhead Core infrastructure migration
-- Adds missing CMS tables, indexes, timestamps, and RLS placeholders.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.articles (
  id text primary key,
  slug text not null unique,
  title text not null,
  subtitle text not null default '',
  excerpt text not null default '',
  body text not null default '',
  article_type text not null default 'guide',
  status text not null default 'draft',
  author text not null default '',
  featured_image text not null default '',
  gallery text[] not null default '{}',
  related_places text[] not null default '{}',
  related_collections text[] not null default '{}',
  related_events text[] not null default '{}',
  categories text[] not null default '{}',
  tags text[] not null default '{}',
  featured boolean not null default false,
  seo_title text not null default '',
  seo_description text not null default '',
  published_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id text primary key,
  slug text not null unique,
  title text not null,
  description text not null default '',
  event_type text not null default 'community',
  status text not null default 'draft',
  start_date timestamptz not null default now(),
  end_date timestamptz,
  start_time text not null default '',
  end_time text not null default '',
  venue_place_id text not null default '',
  address text not null default '',
  city text not null default '',
  state text not null default 'VT',
  zip text not null default '',
  latitude double precision not null default 0,
  longitude double precision not null default 0,
  featured_image text not null default '',
  gallery text[] not null default '{}',
  organizer_name text not null default '',
  organizer_email text not null default '',
  organizer_website text not null default '',
  cost text not null default '',
  ticket_url text not null default '',
  categories text[] not null default '{}',
  tags text[] not null default '{}',
  featured boolean not null default false,
  seo_title text not null default '',
  seo_description text not null default '',
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.deals (
  id text primary key,
  slug text not null unique,
  title text not null,
  description text not null default '',
  short_description text not null default '',
  status text not null default 'draft',
  deal_type text not null default 'discount',
  place_id text not null default '',
  collection_id text,
  code text,
  terms text not null default '',
  start_date timestamptz,
  end_date timestamptz,
  redemption_method text not null default 'show_phone',
  redemption_url text,
  featured_image text not null default '',
  featured boolean not null default false,
  categories text[] not null default '{}',
  tags text[] not null default '{}',
  seo_title text not null default '',
  seo_description text not null default '',
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id text primary key,
  place_id text not null,
  reviewer_name text not null,
  rating integer not null default 5,
  title text not null,
  body text not null,
  status text not null default 'pending',
  visit_date date,
  tags text[] not null default '{}',
  helpful_count integer not null default 0,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.passport_members (
  id text primary key,
  display_name text not null,
  email text not null,
  home_town text,
  status text not null default 'active',
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.passport_stamps (
  id text primary key,
  member_id text not null,
  place_id text not null,
  place_name text not null,
  stamp_type text not null default 'visit',
  earned_at timestamptz not null default now(),
  notes text,
  status text not null default 'active',
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.passport_rewards (
  id text primary key,
  title text not null,
  description text not null,
  required_stamps integer not null default 0,
  reward_type text not null default 'badge',
  status text not null default 'active',
  expires_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.users (
  id text primary key,
  email text not null unique,
  full_name text not null default '',
  role text not null default 'editor',
  status text not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_articles_slug on public.articles(slug);
create index if not exists idx_articles_status on public.articles(status) where archived_at is null;
create index if not exists idx_events_slug on public.events(slug);
create index if not exists idx_events_status on public.events(status) where archived_at is null;
create index if not exists idx_events_start_date on public.events(start_date);
create index if not exists idx_deals_slug on public.deals(slug);
create index if not exists idx_deals_status on public.deals(status) where archived_at is null;
create index if not exists idx_reviews_place_status on public.reviews(place_id, status) where archived_at is null;
create index if not exists idx_passport_members_email on public.passport_members(email);
create index if not exists idx_passport_stamps_member on public.passport_stamps(member_id, earned_at desc) where archived_at is null;
create index if not exists idx_passport_rewards_status on public.passport_rewards(status) where archived_at is null;
create index if not exists idx_users_role_status on public.users(role, status) where archived_at is null;

create or replace trigger trg_articles_set_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

create or replace trigger trg_events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

create or replace trigger trg_deals_set_updated_at
before update on public.deals
for each row execute function public.set_updated_at();

create or replace trigger trg_reviews_set_updated_at
before update on public.reviews
for each row execute function public.set_updated_at();

create or replace trigger trg_passport_members_set_updated_at
before update on public.passport_members
for each row execute function public.set_updated_at();

create or replace trigger trg_passport_stamps_set_updated_at
before update on public.passport_stamps
for each row execute function public.set_updated_at();

create or replace trigger trg_passport_rewards_set_updated_at
before update on public.passport_rewards
for each row execute function public.set_updated_at();

create or replace trigger trg_users_set_updated_at
before update on public.users
for each row execute function public.set_updated_at();

alter table public.places enable row level security;
alter table public.collections enable row level security;
alter table public.articles enable row level security;
alter table public.events enable row level security;
alter table public.deals enable row level security;
alter table public.media enable row level security;
alter table public.media_assets enable row level security;
alter table public.relationships enable row level security;
alter table public.workflow_events enable row level security;
alter table public.versions enable row level security;
alter table public.content_versions enable row level security;
alter table public.comments enable row level security;
alter table public.editorial_comments enable row level security;
alter table public.activities enable row level security;
alter table public.reviews enable row level security;
alter table public.passport_members enable row level security;
alter table public.passport_stamps enable row level security;
alter table public.passport_rewards enable row level security;
alter table public.users enable row level security;
alter table public.feature_flags enable row level security;

-- RLS placeholder policies for later hardening.
-- create policy "read_public_data" on public.places for select using (true);
-- create policy "service_role_all" on public.places using (auth.role() = 'service_role');