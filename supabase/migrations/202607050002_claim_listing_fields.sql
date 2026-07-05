alter table if exists public.business_claims
  add column if not exists listing_url text not null default '',
  add column if not exists claimant_website text not null default '',
  add column if not exists requested_updates text not null default '',
  add column if not exists verification_notes text not null default '';

create index if not exists idx_business_claims_status_submitted_at
  on public.business_claims (status, submitted_at desc);
