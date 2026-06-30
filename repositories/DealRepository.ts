export {
  archiveDeal,
  createDeal,
  dealRepository,
  getDealById,
  getDealBySlug,
  getDeals,
  getDealsByPlaceId,
  getFeaturedDeals,
  getPublishedDeals,
  updateDeal,
} from "@/lib/repositories/dealRepository";

export type { DealInput } from "@/lib/repositories/dealRepository.mock";
