import type { PassportMember, PassportReward, PassportStamp, PassportStats } from "@/types/Passport";
import type { PassportStampInput } from "@/lib/repositories/passportRepository.mock";

function notReady(functionName: string): never {
  throw new Error(`${functionName} is not implemented for Supabase yet.`);
}

export async function getMembers(): Promise<PassportMember[]> {
  return notReady("getMembers");
}

export async function getMemberById(_id: string): Promise<PassportMember | null> {
  return notReady("getMemberById");
}

export async function getStampsByMemberId(_memberId: string): Promise<PassportStamp[]> {
  return notReady("getStampsByMemberId");
}

export async function getRewards(): Promise<PassportReward[]> {
  return notReady("getRewards");
}

export async function getEligibleRewardsForMember(_memberId: string): Promise<PassportReward[]> {
  return notReady("getEligibleRewardsForMember");
}

export async function createStamp(_input: PassportStampInput): Promise<PassportStamp> {
  return notReady("createStamp");
}

export async function getPassportStats(): Promise<PassportStats> {
  return notReady("getPassportStats");
}

export const supabasePassportRepository = {
  getMembers,
  getMemberById,
  getStampsByMemberId,
  getRewards,
  getEligibleRewardsForMember,
  createStamp,
  getPassportStats,
};
