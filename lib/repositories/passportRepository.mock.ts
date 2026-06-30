import { mockPassportMembers, mockPassportRewards, mockPassportStamps } from "@/data/passport";
import type { PassportMember, PassportReward, PassportStamp, PassportStats } from "@/types/Passport";

export type PassportStampInput = Omit<PassportStamp, "id" | "earnedAt"> & { earnedAt?: string };

const memberStore: PassportMember[] = mockPassportMembers.map((member) => ({ ...member }));
let stampStore: PassportStamp[] = mockPassportStamps.map((stamp) => ({ ...stamp }));
const rewardStore: PassportReward[] = mockPassportRewards.map((reward) => ({ ...reward }));

function cloneMember(member: PassportMember): PassportMember {
  return { ...member };
}

function cloneStamp(stamp: PassportStamp): PassportStamp {
  return { ...stamp };
}

function cloneReward(reward: PassportReward): PassportReward {
  return { ...reward };
}

function createStampId() {
  return `stamp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function getMembers(): Promise<PassportMember[]> {
  return memberStore.map(cloneMember);
}

export async function getMemberById(id: string): Promise<PassportMember | null> {
  const member = memberStore.find((item) => item.id === id);
  return member ? cloneMember(member) : null;
}

export async function getStampsByMemberId(memberId: string): Promise<PassportStamp[]> {
  return stampStore.filter((stamp) => stamp.memberId === memberId).sort((a, b) => b.earnedAt.localeCompare(a.earnedAt)).map(cloneStamp);
}

export async function getRewards(): Promise<PassportReward[]> {
  return rewardStore.map(cloneReward);
}

export async function getEligibleRewardsForMember(memberId: string): Promise<PassportReward[]> {
  const [rewards, stamps] = await Promise.all([getRewards(), getStampsByMemberId(memberId)]);
  return rewards.filter((reward) => reward.status === "active" && stamps.length >= reward.requiredStamps);
}

export async function createStamp(input: PassportStampInput): Promise<PassportStamp> {
  const created: PassportStamp = {
    ...input,
    id: createStampId(),
    earnedAt: input.earnedAt ?? new Date().toISOString(),
  };

  stampStore = [created, ...stampStore];
  return cloneStamp(created);
}

export async function getPassportStats(): Promise<PassportStats> {
  const totalMembers = memberStore.length;
  const totalStamps = stampStore.length;
  const activeRewards = rewardStore.filter((reward) => reward.status === "active").length;

  const placeCounts = stampStore.reduce<Record<string, { placeName: string; stamps: number }>>((acc, stamp) => {
    const existing = acc[stamp.placeId] ?? { placeName: stamp.placeName, stamps: 0 };
    acc[stamp.placeId] = { placeName: stamp.placeName, stamps: existing.stamps + 1 };
    return acc;
  }, {});

  const topCheckInPlaces = Object.entries(placeCounts)
    .map(([placeId, value]) => ({ placeId, placeName: value.placeName, stamps: value.stamps }))
    .sort((a, b) => b.stamps - a.stamps)
    .slice(0, 5);

  const recentStamps = [...stampStore].sort((a, b) => b.earnedAt.localeCompare(a.earnedAt)).slice(0, 8).map(cloneStamp);

  return {
    totalMembers,
    totalStamps,
    activeRewards,
    topCheckInPlaces,
    recentStamps,
  };
}

export const mockPassportRepository = {
  getMembers,
  getMemberById,
  getStampsByMemberId,
  getRewards,
  getEligibleRewardsForMember,
  createStamp,
  getPassportStats,
};
