-- Southern VT CMS schema foundation for Supabase
-- Production hardening pass before real data entry.
-- Auth policies are placeholders only and remain commented out.

create extension if not exists "pgcrypto";

-- shared helper trigger for updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- places
create table if not exists public.places (
  id text primary key,
  slug text not null unique,
  name text not null,
  description text not null,
  place_type text not null,
  categories jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  address text not null,
  city text not null,
  state text not null default 'VT',
  zip text not null,
  latitude double precision not null,
  longitude double precision not null,
  phone text,
  email text,
  website text,
  hours text,
  featured_image text not null,
  gallery jsonb not null default '[]'::jsonb,
  amenities jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  status text not null default 'draft',
  metadata jsonb not null default '{}'::jsonb,
  -- NOTE: polymorphic logical references to public.places(id).
  related_places jsonb not null default '[]'::jsonb,
  seo_title text,
  seo_description text,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- collections
create table if not exists public.collections (
  id text primary key,
  slug text not null unique,
  title text not null,
  subtitle text not null,
  description text not null,
  featured_image text not null,
  gallery jsonb not null default '[]'::jsonb,
  -- NOTE: logical references to public.places(id), stored as an ordered list.
  place_ids jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  season text not null default 'Year-Round',
  audience text not null default 'Local Explorers',
  status text not null default 'draft',
  featured boolean not null default false,
  seo_title text,
  seo_description text,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- media assets
create table if not exists public.media_assets (
  id text primary key,
  title text not null,
  alt_text text not null,
  asset_type text not null,
  url text not null,
  thumbnail_url text not null,
  tags jsonb not null default '[]'::jsonb,
  -- NOTE: polymorphic typed references like "place:place-hamilton-falls".
  attached_to jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- relationships
create table if not exists public.relationships (
  id text primary key,
  source_type text not null,
  source_id text not null,
  target_type text not null,
  target_id text not null,
  relationship_type text not null,
  label text not null,
  sort_order integer not null default 0,
  status text not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- NOTE: true FKs are not practical here because the model is polymorphic.
-- source_id / target_id resolve to places, collections, or media_assets by source_type/target_type.

-- workflow events
create table if not exists public.workflow_events (
  id text primary key,
  content_type text not null,
  content_id text not null,
  from_status text,
  to_status text not null,
  actor text not null,
  note text not null,
  status text not null default 'completed',
  metadata jsonb not null default '{}'::jsonb,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- NOTE: content_id is a logical reference resolved by content_type.

-- content versions
create table if not exists public.content_versions (
  id text primary key,
  content_type text not null,
  content_id text not null,
  version_number integer not null,
  actor text not null,
  summary text not null,
  status text not null default 'saved',
  snapshot jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(content_type, content_id, version_number)
);
-- NOTE: content_id is a logical reference resolved by content_type.

-- editorial comments
create table if not exists public.editorial_comments (
  id text primary key,
  content_type text not null,
  content_id text not null,
  body text not null,
  author text not null,
  resolved boolean not null default false,
  status text not null default 'open',
  metadata jsonb not null default '{}'::jsonb,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- NOTE: content_id is a logical reference resolved by content_type.

-- activities
create table if not exists public.activities (
  id text primary key,
  type text not null,
  content_type text not null,
  content_id text not null,
  title text not null,
  description text not null,
  actor text not null,
  status text not null default 'logged',
  metadata jsonb not null default '{}'::jsonb,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- NOTE: content_id is a logical reference resolved by content_type.

-- feature flags
create table if not exists public.feature_flags (
  key text primary key,
  label text not null,
  description text not null,
  enabled boolean not null default false,
  environment text not null default 'development',
  status text not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- indexes: slug and status
create index if not exists idx_places_slug on public.places(slug);
create index if not exists idx_places_status on public.places(status);
create index if not exists idx_collections_slug on public.collections(slug);
create index if not exists idx_collections_status on public.collections(status);
create index if not exists idx_media_assets_status on public.media_assets(status);
create index if not exists idx_relationships_status on public.relationships(status);
create index if not exists idx_workflow_events_status on public.workflow_events(status);
create index if not exists idx_content_versions_status on public.content_versions(status);
create index if not exists idx_editorial_comments_status on public.editorial_comments(status);
create index if not exists idx_activities_status on public.activities(status);
create index if not exists idx_feature_flags_status on public.feature_flags(status);

-- indexes: content and relationship lookups
create index if not exists idx_relationships_source on public.relationships(source_type, source_id);
create index if not exists idx_relationships_target on public.relationships(target_type, target_id);
create index if not exists idx_workflow_events_content on public.workflow_events(content_type, content_id);
create index if not exists idx_content_versions_content on public.content_versions(content_type, content_id);
create index if not exists idx_editorial_comments_content on public.editorial_comments(content_type, content_id);
create index if not exists idx_activities_content on public.activities(content_type, content_id);

-- indexes: timeline and feature lookups
create index if not exists idx_activities_created_at on public.activities(created_at desc);
create index if not exists idx_feature_flags_environment on public.feature_flags(environment);

-- optional JSONB search indexes
create index if not exists idx_places_metadata_gin on public.places using gin(metadata);
create index if not exists idx_collections_metadata_gin on public.collections using gin(metadata);
create index if not exists idx_media_assets_metadata_gin on public.media_assets using gin(metadata);

-- apply updated_at triggers
create or replace trigger trg_places_set_updated_at
before update on public.places
for each row
execute function public.set_updated_at();

create or replace trigger trg_collections_set_updated_at
before update on public.collections
for each row
execute function public.set_updated_at();

create or replace trigger trg_media_assets_set_updated_at
before update on public.media_assets
for each row
execute function public.set_updated_at();

create or replace trigger trg_relationships_set_updated_at
before update on public.relationships
for each row
execute function public.set_updated_at();

create or replace trigger trg_workflow_events_set_updated_at
before update on public.workflow_events
for each row
execute function public.set_updated_at();

create or replace trigger trg_content_versions_set_updated_at
before update on public.content_versions
for each row
execute function public.set_updated_at();

create or replace trigger trg_editorial_comments_set_updated_at
before update on public.editorial_comments
for each row
execute function public.set_updated_at();

create or replace trigger trg_activities_set_updated_at
before update on public.activities
for each row
execute function public.set_updated_at();

create or replace trigger trg_feature_flags_set_updated_at
before update on public.feature_flags
for each row
execute function public.set_updated_at();

-- Row Level Security placeholders
alter table public.places enable row level security;
-- create policy places_public_read_published on public.places for select using (status = 'published' and archived_at is null);
-- create policy places_admin_full_access on public.places for all using (auth.jwt() ->> 'role' = 'admin') with check (auth.jwt() ->> 'role' = 'admin');
-- create policy places_editor_create_update on public.places for insert, update using (auth.jwt() ->> 'role' in ('admin','editor')) with check (auth.jwt() ->> 'role' in ('admin','editor'));
-- create policy places_business_owner_limited_update on public.places for update using (auth.jwt() ->> 'role' = 'business_owner') with check (auth.jwt() ->> 'role' = 'business_owner');

alter table public.collections enable row level security;
-- create policy collections_public_read_published on public.collections for select using (status = 'published' and archived_at is null);
-- create policy collections_admin_full_access on public.collections for all using (auth.jwt() ->> 'role' = 'admin') with check (auth.jwt() ->> 'role' = 'admin');
-- create policy collections_editor_create_update on public.collections for insert, update using (auth.jwt() ->> 'role' in ('admin','editor')) with check (auth.jwt() ->> 'role' in ('admin','editor'));
-- create policy collections_business_owner_limited_update on public.collections for update using (auth.jwt() ->> 'role' = 'business_owner') with check (auth.jwt() ->> 'role' = 'business_owner');

alter table public.media_assets enable row level security;
-- create policy media_assets_public_read_published on public.media_assets for select using (status in ('active','published') and archived_at is null);
-- create policy media_assets_admin_full_access on public.media_assets for all using (auth.jwt() ->> 'role' = 'admin') with check (auth.jwt() ->> 'role' = 'admin');
-- create policy media_assets_editor_create_update on public.media_assets for insert, update using (auth.jwt() ->> 'role' in ('admin','editor')) with check (auth.jwt() ->> 'role' in ('admin','editor'));
-- create policy media_assets_business_owner_limited_update on public.media_assets for update using (auth.jwt() ->> 'role' = 'business_owner') with check (auth.jwt() ->> 'role' = 'business_owner');

alter table public.relationships enable row level security;
-- create policy relationships_public_read_published on public.relationships for select using (status = 'active' and archived_at is null);
-- create policy relationships_admin_full_access on public.relationships for all using (auth.jwt() ->> 'role' = 'admin') with check (auth.jwt() ->> 'role' = 'admin');
-- create policy relationships_editor_create_update on public.relationships for insert, update using (auth.jwt() ->> 'role' in ('admin','editor')) with check (auth.jwt() ->> 'role' in ('admin','editor'));
-- create policy relationships_business_owner_limited_update on public.relationships for update using (auth.jwt() ->> 'role' = 'business_owner') with check (auth.jwt() ->> 'role' = 'business_owner');

alter table public.workflow_events enable row level security;
-- create policy workflow_events_public_read_published on public.workflow_events for select using (status = 'completed' and archived_at is null);
-- create policy workflow_events_admin_full_access on public.workflow_events for all using (auth.jwt() ->> 'role' = 'admin') with check (auth.jwt() ->> 'role' = 'admin');
-- create policy workflow_events_editor_create_update on public.workflow_events for insert, update using (auth.jwt() ->> 'role' in ('admin','editor')) with check (auth.jwt() ->> 'role' in ('admin','editor'));
-- create policy workflow_events_business_owner_limited_update on public.workflow_events for update using (auth.jwt() ->> 'role' = 'business_owner') with check (auth.jwt() ->> 'role' = 'business_owner');

alter table public.content_versions enable row level security;
-- create policy content_versions_public_read_published on public.content_versions for select using (status in ('saved','published') and archived_at is null);
-- create policy content_versions_admin_full_access on public.content_versions for all using (auth.jwt() ->> 'role' = 'admin') with check (auth.jwt() ->> 'role' = 'admin');
-- create policy content_versions_editor_create_update on public.content_versions for insert, update using (auth.jwt() ->> 'role' in ('admin','editor')) with check (auth.jwt() ->> 'role' in ('admin','editor'));
-- create policy content_versions_business_owner_limited_update on public.content_versions for update using (auth.jwt() ->> 'role' = 'business_owner') with check (auth.jwt() ->> 'role' = 'business_owner');

alter table public.editorial_comments enable row level security;
-- create policy editorial_comments_public_read_published on public.editorial_comments for select using (status in ('open','resolved') and archived_at is null);
-- create policy editorial_comments_admin_full_access on public.editorial_comments for all using (auth.jwt() ->> 'role' = 'admin') with check (auth.jwt() ->> 'role' = 'admin');
-- create policy editorial_comments_editor_create_update on public.editorial_comments for insert, update using (auth.jwt() ->> 'role' in ('admin','editor')) with check (auth.jwt() ->> 'role' in ('admin','editor'));
-- create policy editorial_comments_business_owner_limited_update on public.editorial_comments for update using (auth.jwt() ->> 'role' = 'business_owner') with check (auth.jwt() ->> 'role' = 'business_owner');

alter table public.activities enable row level security;
-- create policy activities_public_read_published on public.activities for select using (status = 'logged' and archived_at is null);
-- create policy activities_admin_full_access on public.activities for all using (auth.jwt() ->> 'role' = 'admin') with check (auth.jwt() ->> 'role' = 'admin');
-- create policy activities_editor_create_update on public.activities for insert, update using (auth.jwt() ->> 'role' in ('admin','editor')) with check (auth.jwt() ->> 'role' in ('admin','editor'));
-- create policy activities_business_owner_limited_update on public.activities for update using (auth.jwt() ->> 'role' = 'business_owner') with check (auth.jwt() ->> 'role' = 'business_owner');

alter table public.feature_flags enable row level security;
-- create policy feature_flags_public_read_published on public.feature_flags for select using (status = 'active' and archived_at is null);
-- create policy feature_flags_admin_full_access on public.feature_flags for all using (auth.jwt() ->> 'role' = 'admin') with check (auth.jwt() ->> 'role' = 'admin');
-- create policy feature_flags_editor_create_update on public.feature_flags for insert, update using (auth.jwt() ->> 'role' in ('admin','editor')) with check (auth.jwt() ->> 'role' in ('admin','editor'));
-- create policy feature_flags_business_owner_limited_update on public.feature_flags for update using (auth.jwt() ->> 'role' = 'business_owner') with check (auth.jwt() ->> 'role' = 'business_owner');
