-- Supabase Foundation migration for SouthernVT CMS

create extension if not exists "pgcrypto";

create table if not exists public.places (
  id text primary key,
  slug text not null unique,
  name text not null,
  description text not null default '',
  place_type text not null default 'Trail',
  categories text[] not null default '{}',
  tags text[] not null default '{}',
  address text not null default '',
  city text not null default '',
  state text not null default 'VT',
  zip text not null default '',
  latitude double precision not null default 0,
  longitude double precision not null default 0,
  phone text not null default '',
  email text not null default '',
  website text not null default '',
  hours text not null default '',
  featured_image text not null default '',
  gallery text[] not null default '{}',
  amenities text[] not null default '{}',
  featured boolean not null default false,
  status text not null default 'draft',
  metadata jsonb not null default '{}'::jsonb,
  related_places text[] not null default '{}',
  seo_title text not null default '',
  seo_description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.collections (
  id text primary key,
  slug text not null unique,
  title text not null,
  subtitle text not null default '',
  description text not null default '',
  featured_image text not null default '',
  gallery text[] not null default '{}',
  places text[] not null default '{}',
  tags text[] not null default '{}',
  season text not null default 'Year-Round',
  audience text not null default 'Local Explorers',
  status text not null default 'draft',
  featured boolean not null default false,
  seo_title text not null default '',
  seo_description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.media (
  id text primary key,
  title text not null,
  alt_text text not null default '',
  type text not null default 'image',
  url text not null,
  thumbnail_url text not null default '',
  tags text[] not null default '{}',
  attached_to text[] not null default '{}',
  status text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.relationships (
  id text primary key,
  from_type text not null,
  from_id text not null,
  to_type text not null,
  to_id text not null,
  relationship_type text not null,
  label text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.workflow_events (
  id text primary key,
  content_type text not null,
  content_id text not null,
  from_status text not null,
  to_status text not null,
  note text not null default '',
  created_by text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.versions (
  id text primary key,
  content_type text not null,
  content_id text not null,
  version_number integer not null,
  title text not null,
  snapshot text not null default '',
  created_by text not null default '',
  created_at timestamptz not null default now(),
  published boolean not null default false,
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.comments (
  id text primary key,
  content_type text not null,
  content_id text not null,
  body text not null,
  author text not null,
  resolved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create index if not exists idx_places_status on public.places(status) where archived_at is null;
create index if not exists idx_places_slug on public.places(slug);
create index if not exists idx_collections_status on public.collections(status) where archived_at is null;
create index if not exists idx_collections_slug on public.collections(slug);
create index if not exists idx_relationships_from on public.relationships(from_type, from_id) where archived_at is null;
create index if not exists idx_relationships_to on public.relationships(to_type, to_id) where archived_at is null;
create index if not exists idx_relationships_type on public.relationships(relationship_type) where archived_at is null;
create index if not exists idx_workflow_events_content on public.workflow_events(content_type, content_id) where archived_at is null;
create index if not exists idx_versions_content on public.versions(content_type, content_id) where archived_at is null;
create index if not exists idx_comments_content on public.comments(content_type, content_id) where archived_at is null;
