import "server-only";
import { basicBusinessListings } from "@/data/basicBusinessListings";
import type { BusinessListing } from "@/types/BusinessListing";
import type { BusinessClaim, BusinessClaimInput, ClaimReviewInput, ClaimStatus } from "@/types/Claim";

type ListingClaimState = "pending" | "claimed";
type ClaimStatusMap = Map<string, ListingClaimState>;

type BusinessClaimRow = {
  id: string;
  business_listing_id: string;
  business_slug: string;
  business_name: string;
  claimant_name: string;
  claimant_email: string;
  claimant_phone: string;
  role_at_business: string;
  proof_message: string;
  status: ClaimStatus;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  review_notes: string | null;
};

type BusinessOwnerRow = {
  business_listing_id: string;
};

type SupabaseAdminUsersResponse = {
  users: Array<{ id: string; email?: string }>;
};

function requireSupabaseAdminEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url || !serviceRoleKey) {
    throw new Error("Supabase service role credentials are required.");
  }
  return { url, serviceRoleKey };
}

export function hasSupabaseServiceRoleEnv() {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL);
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const payload = text ? (JSON.parse(text) as unknown) : null;

  if (!response.ok) {
    const errorMessage =
      typeof payload === "object" && payload !== null && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Supabase request failed.";
    throw new Error(errorMessage);
  }

  return payload as T;
}

function restHeaders(serviceRoleKey: string, extra: Record<string, string> = {}) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

function mapClaimRowToBusinessClaim(row: BusinessClaimRow): BusinessClaim {
  return {
    id: row.id,
    businessListingId: row.business_listing_id,
    businessSlug: row.business_slug,
    businessName: row.business_name,
    claimantName: row.claimant_name,
    claimantEmail: row.claimant_email,
    claimantPhone: row.claimant_phone,
    roleAtBusiness: row.role_at_business,
    proofMessage: row.proof_message,
    status: row.status,
    submittedAt: row.submitted_at,
    reviewedAt: row.reviewed_at ?? undefined,
    reviewedBy: row.reviewed_by ?? undefined,
    reviewNotes: row.review_notes ?? undefined,
  };
}

async function findAuthUserIdByEmail(email: string): Promise<string | null> {
  const { url, serviceRoleKey } = requireSupabaseAdminEnv();
  const normalized = email.trim().toLowerCase();

  for (let page = 1; page <= 10; page += 1) {
    const response = await fetch(`${url}/auth/v1/admin/users?page=${page}&per_page=200`, {
      method: "GET",
      headers: restHeaders(serviceRoleKey),
      cache: "no-store",
    });

    const payload = await parseJsonResponse<SupabaseAdminUsersResponse>(response);
    const match = payload.users.find((user) => (user.email ?? "").toLowerCase() === normalized);
    if (match) {
      return match.id;
    }
    if (payload.users.length < 200) {
      return null;
    }
  }

  return null;
}

export async function createBusinessClaim(input: BusinessClaimInput): Promise<BusinessClaim> {
  const { url, serviceRoleKey } = requireSupabaseAdminEnv();
  const response = await fetch(`${url}/rest/v1/business_claims`, {
    method: "POST",
    headers: restHeaders(serviceRoleKey, { Prefer: "return=representation" }),
    body: JSON.stringify([
      {
        business_listing_id: input.businessListingId,
        business_slug: input.businessSlug,
        business_name: input.businessName,
        claimant_name: input.claimantName,
        claimant_email: input.claimantEmail,
        claimant_phone: input.claimantPhone,
        role_at_business: input.roleAtBusiness,
        proof_message: input.proofMessage,
        status: "pending",
        submitted_at: new Date().toISOString(),
      },
    ]),
    cache: "no-store",
  });

  const rows = await parseJsonResponse<BusinessClaimRow[]>(response);
  const row = rows[0];
  if (!row) {
    throw new Error("Unable to save claim.");
  }

  return mapClaimRowToBusinessClaim(row);
}

export async function getBusinessClaims(): Promise<BusinessClaim[]> {
  if (!hasSupabaseServiceRoleEnv()) {
    return [];
  }

  const { url, serviceRoleKey } = requireSupabaseAdminEnv();
  const query = new URLSearchParams({
    select:
      "id,business_listing_id,business_slug,business_name,claimant_name,claimant_email,claimant_phone,role_at_business,proof_message,status,submitted_at,reviewed_at,reviewed_by,review_notes",
    order: "submitted_at.desc",
  });

  const response = await fetch(`${url}/rest/v1/business_claims?${query.toString()}`, {
    method: "GET",
    headers: restHeaders(serviceRoleKey),
    cache: "no-store",
  });

  const rows = await parseJsonResponse<BusinessClaimRow[]>(response);
  return rows.map(mapClaimRowToBusinessClaim);
}

export async function reviewBusinessClaim(claimId: string, input: ClaimReviewInput, reviewedBy: string): Promise<BusinessClaim> {
  const { url, serviceRoleKey } = requireSupabaseAdminEnv();
  const encodedId = encodeURIComponent(claimId);
  const selectQuery = new URLSearchParams({
    select:
      "id,business_listing_id,business_slug,business_name,claimant_name,claimant_email,claimant_phone,role_at_business,proof_message,status,submitted_at,reviewed_at,reviewed_by,review_notes",
  });

  const claimResponse = await fetch(`${url}/rest/v1/business_claims?id=eq.${encodedId}&${selectQuery.toString()}`, {
    method: "GET",
    headers: restHeaders(serviceRoleKey),
    cache: "no-store",
  });

  const claimRows = await parseJsonResponse<BusinessClaimRow[]>(claimResponse);
  const claimRow = claimRows[0];
  if (!claimRow) {
    throw new Error("Claim not found.");
  }

  if (input.status === "approved") {
    const userId = await findAuthUserIdByEmail(claimRow.claimant_email);
    if (!userId) {
      throw new Error("Cannot approve claim because no authenticated owner account was found for claimant email.");
    }

    await fetch(`${url}/rest/v1/business_listing_owners?on_conflict=business_listing_id,user_id`, {
      method: "POST",
      headers: restHeaders(serviceRoleKey, { Prefer: "resolution=merge-duplicates,return=minimal" }),
      body: JSON.stringify([
        {
          business_listing_id: claimRow.business_listing_id,
          user_id: userId,
          role: claimRow.role_at_business === "editor" ? "editor" : claimRow.role_at_business === "manager" ? "manager" : "owner",
          status: "active",
        },
      ]),
      cache: "no-store",
    }).then(parseJsonResponse<null>);
  }

  const updateResponse = await fetch(`${url}/rest/v1/business_claims?id=eq.${encodedId}`, {
    method: "PATCH",
    headers: restHeaders(serviceRoleKey, { Prefer: "return=representation" }),
    body: JSON.stringify({
      status: input.status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewedBy,
      review_notes: input.reviewNotes ?? "",
    }),
    cache: "no-store",
  });

  const updatedRows = await parseJsonResponse<BusinessClaimRow[]>(updateResponse);
  const updatedRow = updatedRows[0];
  if (!updatedRow) {
    throw new Error("Unable to review claim.");
  }

  return mapClaimRowToBusinessClaim(updatedRow);
}

export async function createBusinessListingEditRequest(input: {
  businessListingId: string;
  userId: string;
  proposedChanges: Record<string, string>;
}) {
  const { url, serviceRoleKey } = requireSupabaseAdminEnv();

  const response = await fetch(`${url}/rest/v1/business_listing_edit_requests`, {
    method: "POST",
    headers: restHeaders(serviceRoleKey, { Prefer: "return=minimal" }),
    body: JSON.stringify([
      {
        business_listing_id: input.businessListingId,
        user_id: input.userId,
        proposed_changes: input.proposedChanges,
        status: "pending",
      },
    ]),
    cache: "no-store",
  });

  await parseJsonResponse<null>(response);
}

export async function getOwnedBusinessListings(userId: string): Promise<BusinessListing[]> {
  if (!hasSupabaseServiceRoleEnv()) {
    return [];
  }

  const { url, serviceRoleKey } = requireSupabaseAdminEnv();
  const query = new URLSearchParams({
    select: "business_listing_id",
    user_id: `eq.${userId}`,
    status: "eq.active",
  });
  const response = await fetch(`${url}/rest/v1/business_listing_owners?${query.toString()}`, {
    method: "GET",
    headers: restHeaders(serviceRoleKey),
    cache: "no-store",
  });

  const rows = await parseJsonResponse<BusinessOwnerRow[]>(response);
  const listingIds = new Set(rows.map((row) => row.business_listing_id));
  return basicBusinessListings.filter((listing) => listingIds.has(listing.id));
}

export async function isActiveBusinessOwner(userId: string, businessListingId: string): Promise<boolean> {
  if (!hasSupabaseServiceRoleEnv()) {
    return false;
  }

  const { url, serviceRoleKey } = requireSupabaseAdminEnv();
  const query = new URLSearchParams({
    select: "business_listing_id",
    user_id: `eq.${userId}`,
    business_listing_id: `eq.${businessListingId}`,
    status: "eq.active",
    limit: "1",
  });
  const response = await fetch(`${url}/rest/v1/business_listing_owners?${query.toString()}`, {
    method: "GET",
    headers: restHeaders(serviceRoleKey),
    cache: "no-store",
  });

  const rows = await parseJsonResponse<BusinessOwnerRow[]>(response);
  return rows.length > 0;
}

export async function getBusinessClaimStatusMap(): Promise<ClaimStatusMap> {
  const statusMap: ClaimStatusMap = new Map();

  if (!hasSupabaseServiceRoleEnv()) {
    return statusMap;
  }

  const { url, serviceRoleKey } = requireSupabaseAdminEnv();

  const ownersResponse = await fetch(
    `${url}/rest/v1/business_listing_owners?select=business_listing_id&status=eq.active`,
    { method: "GET", headers: restHeaders(serviceRoleKey), cache: "no-store" },
  );
  const owners = await parseJsonResponse<BusinessOwnerRow[]>(ownersResponse);

  const pendingResponse = await fetch(
    `${url}/rest/v1/business_claims?select=business_listing_id&status=eq.pending`,
    { method: "GET", headers: restHeaders(serviceRoleKey), cache: "no-store" },
  );
  const pending = await parseJsonResponse<BusinessOwnerRow[]>(pendingResponse);

  for (const owner of owners) {
    statusMap.set(owner.business_listing_id, "claimed");
  }

  for (const claim of pending) {
    if (!statusMap.has(claim.business_listing_id)) {
      statusMap.set(claim.business_listing_id, "pending");
    }
  }

  return statusMap;
}
