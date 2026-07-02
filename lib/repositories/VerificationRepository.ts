import { mockVerifications } from "@/data/verifications";
import type { VerificationRecord, VerificationStatus } from "@/types/Verification";

let verificationStore: VerificationRecord[] = mockVerifications.map(cloneVerificationRecord);

function cloneVerificationRecord(record: VerificationRecord): VerificationRecord {
  return {
    ...record,
    levels: [...record.levels],
    history: record.history.map((entry) => ({ ...entry })),
  };
}

function resolveStatus(record: VerificationRecord): VerificationStatus {
  const now = Date.now();
  if (record.expiresAt && new Date(record.expiresAt).getTime() < now) {
    return "expired";
  }
  return record.status;
}

export async function getVerificationByPlaceId(placeId: string): Promise<VerificationRecord | null> {
  const record = verificationStore.find((entry) => entry.placeId === placeId);
  if (!record) {
    return null;
  }

  return {
    ...cloneVerificationRecord(record),
    status: resolveStatus(record),
  };
}

export async function getVerifiedPlaces(): Promise<VerificationRecord[]> {
  return verificationStore
    .filter((record) => resolveStatus(record) === "verified")
    .map((record) => ({ ...cloneVerificationRecord(record), status: resolveStatus(record) }));
}

export async function getRecommendedPlaces(): Promise<VerificationRecord[]> {
  return verificationStore
    .filter((record) => record.levels.includes("southernvt_recommended"))
    .map((record) => ({ ...cloneVerificationRecord(record), status: resolveStatus(record) }));
}

export async function getPlacesNeedingReview(): Promise<VerificationRecord[]> {
  return verificationStore
    .filter((record) => {
      const resolved = resolveStatus(record);
      if (resolved === "review_needed" || resolved === "expired") {
        return true;
      }

      if (record.nextReviewAt) {
        return new Date(record.nextReviewAt).getTime() <= Date.now();
      }

      return false;
    })
    .map((record) => ({ ...cloneVerificationRecord(record), status: resolveStatus(record) }));
}

export async function updateVerification(record: VerificationRecord): Promise<VerificationRecord> {
  const updated = cloneVerificationRecord(record);
  const index = verificationStore.findIndex((entry) => entry.placeId === updated.placeId);

  if (index >= 0) {
    verificationStore[index] = updated;
  } else {
    verificationStore = [updated, ...verificationStore];
  }

  return {
    ...cloneVerificationRecord(updated),
    status: resolveStatus(updated),
  };
}

