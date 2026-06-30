import { mockDeals } from "@/data/deals";
import type { Deal } from "@/types/Deal";

export type DealInput = Omit<Deal, "id" | "createdAt" | "updatedAt">;

let dealStore: Deal[] = mockDeals.map((deal) => ({ ...deal }));

function clone(deal: Deal): Deal {
  return { ...deal, categories: [...deal.categories], tags: [...deal.tags] };
}

function createId(slug: string) {
  return `deal-${slug}-${Date.now().toString(36)}`;
}

function sortByWindow(items: Deal[]) {
  return [...items].sort((a, b) => `${a.startDate}-${a.title}`.localeCompare(`${b.startDate}-${b.title}`));
}

function isActive(deal: Deal) {
  const today = new Date().toISOString().slice(0, 10);
  return deal.endDate >= today;
}

export async function getDeals(): Promise<Deal[]> {
  return sortByWindow(dealStore).map(clone);
}

export async function getPublishedDeals(): Promise<Deal[]> {
  const deals = await getDeals();
  return deals.filter((deal) => deal.status === "published" && isActive(deal));
}

export async function getFeaturedDeals(): Promise<Deal[]> {
  const deals = await getPublishedDeals();
  return deals.filter((deal) => deal.featured);
}

export async function getDealById(id: string): Promise<Deal | null> {
  const deal = dealStore.find((item) => item.id === id);
  return deal ? clone(deal) : null;
}

export async function getDealBySlug(slug: string): Promise<Deal | null> {
  const deal = dealStore.find((item) => item.slug === slug);
  return deal ? clone(deal) : null;
}

export async function getDealsByPlaceId(placeId: string): Promise<Deal[]> {
  const deals = await getDeals();
  return deals.filter((deal) => deal.placeId === placeId);
}

export async function createDeal(input: DealInput): Promise<Deal> {
  const now = new Date().toISOString();
  const created: Deal = {
    ...input,
    id: createId(input.slug),
    createdAt: now,
    updatedAt: now,
  };

  dealStore = [created, ...dealStore];
  return clone(created);
}

export async function updateDeal(id: string, updates: Partial<DealInput>): Promise<Deal | null> {
  const index = dealStore.findIndex((deal) => deal.id === id);
  if (index < 0) {
    return null;
  }

  const updated: Deal = {
    ...dealStore[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  dealStore[index] = updated;
  return clone(updated);
}

export async function archiveDeal(id: string): Promise<Deal | null> {
  return updateDeal(id, { status: "archived" });
}

export const mockDealRepository = {
  getDeals,
  getPublishedDeals,
  getFeaturedDeals,
  getDealById,
  getDealBySlug,
  getDealsByPlaceId,
  createDeal,
  updateDeal,
  archiveDeal,
};
