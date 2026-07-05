import type { BusinessClaim, BusinessClaimInput, ClaimReviewInput } from "@/types/Claim";

type ApiErrorPayload = { error?: string; notConfigured?: boolean; blocked?: boolean };

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T & ApiErrorPayload;
  if (!response.ok) {
    throw new Error((payload as ApiErrorPayload).error ?? "Claim request failed.");
  }
  return payload;
}

export async function getClaims(): Promise<BusinessClaim[]> {
  const response = await fetch("/api/basecamp/claims", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = await parseJsonResponse<{ claims: BusinessClaim[] }>(response);
  return payload.claims;
}

export async function submitClaim(input: BusinessClaimInput): Promise<BusinessClaim | null> {
  const response = await fetch("/api/claims", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  // Surface the 503 "not configured" message explicitly so the UI can render it clearly
  if (response.status === 503) {
    const payload = (await response.json()) as ApiErrorPayload;
    throw new Error(payload.error ?? "Claim submissions are not enabled yet. Please email partners@southernvt.com.");
  }

  const payload = await parseJsonResponse<{ claim?: BusinessClaim; blocked?: boolean }>(response);
  return payload.claim ?? null;
}

export async function updateClaimStatus(id: string, input: ClaimReviewInput & { reviewedBy?: string }): Promise<BusinessClaim> {
  const response = await fetch(`/api/basecamp/claims/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const payload = await parseJsonResponse<{ claim: BusinessClaim }>(response);
  return payload.claim;
}
