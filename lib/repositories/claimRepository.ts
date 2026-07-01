import { mockClaims } from "@/data/claims";
import type { BusinessClaim, BusinessClaimInput, ClaimStatus } from "@/types/Claim";

const STORAGE_KEY = "basecamp_business_claims";

function buildId() {
  return `claim-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function readStoredClaims(): BusinessClaim[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as BusinessClaim[]) : [];
  } catch {
    return [];
  }
}

function writeStoredClaims(claims: BusinessClaim[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
}

function mergeClaims(source: BusinessClaim[]) {
  const merged = new Map<string, BusinessClaim>();

  for (const claim of mockClaims) {
    merged.set(claim.id, claim);
  }

  for (const claim of source) {
    merged.set(claim.id, claim);
  }

  return Array.from(merged.values()).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export async function getClaims(): Promise<BusinessClaim[]> {
  const local = readStoredClaims();
  return mergeClaims(local);
}

export async function submitClaim(input: BusinessClaimInput): Promise<BusinessClaim> {
  const created: BusinessClaim = {
    ...input,
    id: buildId(),
    status: "pending",
    submittedAt: new Date().toISOString(),
  };

  const next = [created, ...readStoredClaims()];
  writeStoredClaims(next);
  return created;
}

export async function updateClaimStatus(id: string, status: ClaimStatus): Promise<BusinessClaim | null> {
  const all = await getClaims();
  const target = all.find((claim) => claim.id === id);

  if (!target) {
    return null;
  }

  const updated: BusinessClaim = {
    ...target,
    status,
    reviewedAt: new Date().toISOString(),
  };

  const replaced = all.map((claim) => (claim.id === id ? updated : claim));
  writeStoredClaims(replaced);

  return updated;
}
