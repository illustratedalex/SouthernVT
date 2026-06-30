export type PassportStampType = "visit" | "deal" | "event" | "collection";

export type PassportRewardType = "discount" | "giveaway" | "badge" | "experience";

export type PassportRewardStatus = "active" | "inactive";

export interface PassportMember {
  id: string;
  displayName: string;
  email: string;
  homeTown?: string;
  createdAt: string;
}

export interface PassportStamp {
  id: string;
  memberId: string;
  placeId: string;
  placeName: string;
  stampType: PassportStampType;
  earnedAt: string;
  notes?: string;
}

export interface PassportReward {
  id: string;
  title: string;
  description: string;
  requiredStamps: number;
  rewardType: PassportRewardType;
  status: PassportRewardStatus;
  expiresAt?: string;
}

export interface PassportStats {
  totalMembers: number;
  totalStamps: number;
  activeRewards: number;
  topCheckInPlaces: Array<{ placeId: string; placeName: string; stamps: number }>;
  recentStamps: PassportStamp[];
}
