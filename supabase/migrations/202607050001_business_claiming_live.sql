-- Real business claiming and owner access workflow

create extension if not exists "pgcrypto";

create table if not exists public.business_claims (
  id uuid primary key default gen_random_uuid(),
  business_listing_id text not null,
  business_slug text not null,
  business_name text not null,
  claimant_name text not null,
  claimant_email text not null,
  claimant_phone text not null default '',
  role_at_business text not null,
  proof_message text not null default '',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by text,
  review_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_listing_owners (
  id uuid primary key default gen_random_uuid(),
  business_listing_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'manager', 'editor')),
  status text not null default 'active' check (status in ('active', 'revoked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_listing_id, user_id)
);

create table if not exists public.business_listing_edit_requests (
  id uuid primary key default gen_random_uuid(),
  business_listing_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  proposed_changes jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists idx_business_claims_listing_status
  on public.business_claims (business_listing_id, status);
create index if not exists idx_business_claims_slug
  on public.business_claims (business_slug);
create index if not exists idx_business_claims_submitted_at
  on public.business_claims (submitted_at desc);

create index if not exists idx_business_listing_owners_user_status
  on public.business_listing_owners (user_id, status);
create index if not exists idx_business_listing_owners_listing_status
  on public.business_listing_owners (business_listing_id, status);

create index if not exists idx_business_listing_edit_requests_listing_status
  on public.business_listing_edit_requests (business_listing_id, status);
create index if not exists idx_business_listing_edit_requests_user_status
  on public.business_listing_edit_requests (user_id, status);

create or replace trigger trg_business_claims_set_updated_at
before update on public.business_claims
for each row execute function public.set_updated_at();

create or replace trigger trg_business_listing_owners_set_updated_at
before update on public.business_listing_owners
for each row execute function public.set_updated_at();

create or replace trigger trg_business_listing_edit_requests_set_updated_at
before update on public.business_listing_edit_requests
for each row execute function public.set_updated_at();

alter table public.business_claims enable row level security;
alter table public.business_listing_owners enable row level security;
alter table public.business_listing_edit_requests enable row level security;

drop policy if exists business_claims_public_insert on public.business_claims;
create policy business_claims_public_insert
on public.business_claims
for insert
to anon, authenticated
with check (true);

drop policy if exists business_claims_service_role_select on public.business_claims;
create policy business_claims_service_role_select
on public.business_claims
for select
to service_role
using (true);

drop policy if exists business_claims_service_role_update on public.business_claims;
create policy business_claims_service_role_update
on public.business_claims
for update
to service_role
using (true)
with check (true);

drop policy if exists business_listing_owners_service_role_select on public.business_listing_owners;
create policy business_listing_owners_service_role_select
on public.business_listing_owners
for select
to service_role
using (true);

drop policy if exists business_listing_owners_service_role_write on public.business_listing_owners;
create policy business_listing_owners_service_role_write
on public.business_listing_owners
for all
to service_role
using (true)
with check (true);

drop policy if exists business_listing_owners_user_select_own on public.business_listing_owners;
create policy business_listing_owners_user_select_own
on public.business_listing_owners
for select
to authenticated
using (auth.uid() = user_id and status = 'active');

drop policy if exists business_listing_edit_requests_user_insert on public.business_listing_edit_requests;
create policy business_listing_edit_requests_user_insert
on public.business_listing_edit_requests
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.business_listing_owners owner
    where owner.business_listing_id = business_listing_edit_requests.business_listing_id
      and owner.user_id = auth.uid()
      and owner.status = 'active'
  )
);

drop policy if exists business_listing_edit_requests_user_select_own on public.business_listing_edit_requests;
create policy business_listing_edit_requests_user_select_own
on public.business_listing_edit_requests
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists business_listing_edit_requests_service_role_all on public.business_listing_edit_requests;
create policy business_listing_edit_requests_service_role_all
on public.business_listing_edit_requests
for all
to service_role
using (true)
with check (true);
