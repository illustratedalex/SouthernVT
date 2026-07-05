# Business Claiming (Live Workflow)

SouthernVT now supports a real business owner claim workflow backed by Supabase.

## Claim process

1. A business owner opens `/claim-listing?listing=<listing-slug>`.
2. They submit:
   - business name
   - listing URL
   - contact name
   - role
   - email
   - phone
   - website
   - requested updates
   - verification notes
3. SouthernVT stores the request in `business_claims` with `status = pending`.
4. SouthernVT sends:
   - admin notification email to the site owner
   - confirmation email to the submitter
5. A hidden honeypot field is validated server-side to reduce bot spam.
6. The owner sees:
   - **“Your claim request has been submitted. SouthernVT will review it before granting access.”**

Claims are never auto-approved.
Claiming is currently free.

## Basecamp admin review

`/basecamp/claims` reads real claim records from Supabase and supports:

- Approve
- Reject
- Review notes

On approval:

- claim status is updated to `approved`
- a `business_listing_owners` row is created for the matching authenticated user
- public listing claim state resolves to **Claimed by Owner**

On rejection:

- claim status is updated to `rejected`
- listing remains unclaimed

## Owner access

Routes:

- `/login`
- `/signup`
- `/logout`
- `/partner-portal`

`/partner-portal` behavior:

- Not logged in: login/signup prompt
- Logged in with no approved ownership: **“No approved business listings yet.”**
- Logged in with approved ownership: owned listings and edit-request form

## What owners can edit

Owners submit draft edit requests for:

- description
- website
- phone
- photos placeholder
- events placeholder
- deals placeholder
- owner message

Edits are stored in `business_listing_edit_requests` and reviewed before public changes.

## What owners cannot edit

Owners cannot directly edit:

- Verified by SouthernVT
- SouthernVT Recommended
- editorial review status
- coverage region
- editorial ranking

## Verification policy

Verification cannot be bought. Payments, subscriptions, and premium gates are not part of this workflow.

## Required email environment variables

- `RESEND_API_KEY`
- `CLAIMS_EMAIL_FROM`
- `CLAIMS_ADMIN_EMAIL`
