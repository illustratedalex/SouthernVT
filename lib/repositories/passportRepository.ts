import { isFeatureEnabled } from "@/lib/featureFlags";
import { resolveRepositoryMode } from "@/lib/repositories/mode";
import { hasSupabaseEnv } from "@/lib/supabase/client";
import type { PassportMember, PassportReward, PassportStamp, PassportStats } from "@/types/Passport";
import type { PassportStampInput } from "@/lib/repositories/passportRepository.mock";
import * as mockRepository from "@/lib/repositories/passportRepository.mock";
import * as supabaseRepository from "@/lib/repositories/passportRepository.supabase";

type PassportRepositoryModule = {
  getMembers: () => Promise<PassportMember[]>;
  getMemberById: (id: string) => Promise<PassportMember | null>;
  getStampsByMemberId: (memberId: string) => Promise<PassportStamp[]>;
  getRewards: () => Promise<PassportReward[]>;
  getEligibleRewardsForMember: (memberId: string) => Promise<PassportReward[]>;
  createStamp: (input: PassportStampInput) => Promise<PassportStamp>;
  getPassportStats: () => Promise<PassportStats>;
};

let stagedMembers: PassportMember[] = [];

async function getActivePassportRepository(): Promise<PassportRepositoryModule> {
  const supabaseEnabled = await isFeatureEnabled("supabase");
  const mode = resolveRepositoryMode({ supabaseEnv: hasSupabaseEnv(), featureFlagSupabaseEnabled: supabaseEnabled });
  if (mode === "supabase") {
    return supabaseRepository;
  }
  return mockRepository;
}

export async function getMembers(): Promise<PassportMember[]> {
  const repository = await getActivePassportRepository();
  try {
    const members = await repository.getMembers();
    const merged = [...stagedMembers, ...members.filter((member) => !stagedMembers.some((staged) => staged.id === member.id))];
    return merged;
  } catch {
    const members = await mockRepository.getMembers();
    const merged = [...stagedMembers, ...members.filter((member) => !stagedMembers.some((staged) => staged.id === member.id))];
    return merged;
  }
}

export async function getMemberById(id: string): Promise<PassportMember | null> {
  const stagedMatch = stagedMembers.find((member) => member.id === id);
  if (stagedMatch) {
    return stagedMatch;
  }

  const repository = await getActivePassportRepository();
  try {
    return await repository.getMemberById(id);
  } catch {
    return mockRepository.getMemberById(id);
  }
}

export async function getStampsByMemberId(memberId: string): Promise<PassportStamp[]> {
  const repository = await getActivePassportRepository();
  try {
    return await repository.getStampsByMemberId(memberId);
  } catch {
    return mockRepository.getStampsByMemberId(memberId);
  }
}

export async function getRewards(): Promise<PassportReward[]> {
  const repository = await getActivePassportRepository();
  try {
    return await repository.getRewards();
  } catch {
    return mockRepository.getRewards();
  }
}

export async function getEligibleRewardsForMember(memberId: string): Promise<PassportReward[]> {
  const repository = await getActivePassportRepository();
  try {
    return await repository.getEligibleRewardsForMember(memberId);
  } catch {
    return mockRepository.getEligibleRewardsForMember(memberId);
  }
}

export async function createStamp(input: PassportStampInput): Promise<PassportStamp> {
  const repository = await getActivePassportRepository();
  try {
    return await repository.createStamp(input);
  } catch {
    return mockRepository.createStamp(input);
  }
}

export async function createPassportMember(input: Omit<PassportMember, "id" | "createdAt">): Promise<PassportMember> {
  const now = new Date().toISOString();
  const created: PassportMember = {
    id: `member-${Date.now().toString(36)}`,
    createdAt: now,
    ...input,
  };

  stagedMembers = [created, ...stagedMembers.filter((member) => member.id !== created.id)];
  return created;
}

export async function updatePassportMember(id: string, updates: Partial<PassportMember>): Promise<PassportMember | null> {
  const stagedIndex = stagedMembers.findIndex((member) => member.id === id);
  if (stagedIndex >= 0) {
    const updated: PassportMember = {
      ...stagedMembers[stagedIndex],
      ...updates,
    };
    stagedMembers[stagedIndex] = updated;
    return updated;
  }

  const existing = await getMemberById(id);
  if (!existing) {
    return null;
  }

  return {
    ...existing,
    ...updates,
  };
}

export async function archivePassportMember(id: string): Promise<PassportMember | null> {
  const stagedIndex = stagedMembers.findIndex((member) => member.id === id);
  if (stagedIndex >= 0) {
    const archived: PassportMember = {
      ...stagedMembers[stagedIndex],
    };
    stagedMembers[stagedIndex] = archived;
    return archived;
  }

  const existing = await getMemberById(id);
  if (!existing) {
    return null;
  }

  return {
    ...existing,
  };
}

export async function getPassportStats(): Promise<PassportStats> {
  const repository = await getActivePassportRepository();
  try {
    return await repository.getPassportStats();
  } catch {
    return mockRepository.getPassportStats();
  }
}

export const passportRepository = {
  getAll: getMembers,
  getById: getMemberById,
  create: createPassportMember,
  update: updatePassportMember,
  archive: archivePassportMember,
  getMembers,
  getMemberById,
  getStampsByMemberId,
  getRewards,
  getEligibleRewardsForMember,
  createStamp,
  createPassportMember,
  updatePassportMember,
  archivePassportMember,
  getPassportStats,
};
