import type { BusinessClaim, BusinessClaimInput, ClaimReviewInput } from "@/types/Claim";

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error((payload as { error?: string }).error ?? "Claim request failed.");
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

export async function submitClaim(input: BusinessClaimInput): Promise<BusinessClaim> {
  const response = await fetch("/api/claims", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const payload = await parseJsonResponse<{ claim: BusinessClaim }>(response);
  return payload.claim;
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
