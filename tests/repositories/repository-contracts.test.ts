import { describe, expect, it, beforeEach } from "vitest";
import { setRepositoryModeOverride } from "@/lib/repositories/mode";
import { placeRepository } from "@/lib/repositories/placeRepository";
import { collectionRepository } from "@/lib/repositories/collectionRepository";
import { articleRepository } from "@/lib/repositories/articleRepository";
import { eventRepository } from "@/lib/repositories/eventRepository";
import { dealRepository } from "@/lib/repositories/dealRepository";
import { mediaRepository } from "@/lib/repositories/mediaRepository";
import { relationshipRepository } from "@/lib/repositories/RelationshipRepository";
import { workflowRepository } from "@/lib/repositories/WorkflowRepository";
import { activityRepository } from "@/lib/repositories/ActivityRepository";
import { reviewRepository } from "@/lib/repositories/reviewRepository";
import { passportRepository } from "@/lib/repositories/passportRepository";
import { featureFlagRepository } from "@/lib/repositories/featureFlagRepository";

function toCreateInput(entity: Record<string, unknown>) {
  const next = { ...entity };
  delete next.id;
  delete next.createdAt;
  delete next.updatedAt;
  delete next.archivedAt;
  return next;
}

beforeEach(() => {
  setRepositoryModeOverride("mock");
});

describe("Repository contracts", () => {
  it("Places: getAll/getById/create/update/archive", async () => {
    const all = await placeRepository.getAll();
    expect(all.length).toBeGreaterThan(0);

    const first = all[0]!;
    const byId = await placeRepository.getById(first.id);
    expect(byId?.id).toBe(first.id);

    const created = await placeRepository.create(toCreateInput(first as unknown as Record<string, unknown>) as any);
    const updated = await placeRepository.update(created.id, { name: `${created.name} Updated` });
    const archived = await placeRepository.archive(created.id);

    expect(created.id).toBeTruthy();
    expect(updated?.id).toBe(created.id);
    expect(archived?.id).toBe(created.id);
  });

  it("Collections: getAll/getById/create/update/archive", async () => {
    const all = await collectionRepository.getAll();
    expect(all.length).toBeGreaterThan(0);

    const first = all[0]!;
    const byId = await collectionRepository.getById(first.id);
    expect(byId?.id).toBe(first.id);

    const created = await collectionRepository.create(toCreateInput(first as unknown as Record<string, unknown>) as any);
    const updated = await collectionRepository.update(created.id, { title: `${created.title} Updated` });
    const archived = await collectionRepository.archive(created.id);

    expect(created.id).toBeTruthy();
    expect(updated?.id).toBe(created.id);
    expect(archived?.id).toBe(created.id);
  });

  it("Articles: getAll/getById/create/update/archive", async () => {
    const all = await articleRepository.getAll();
    expect(all.length).toBeGreaterThan(0);

    const first = all[0]!;
    const byId = await articleRepository.getById(first.id);
    expect(byId?.id).toBe(first.id);

    const created = await articleRepository.create(toCreateInput(first as unknown as Record<string, unknown>) as any);
    const updated = await articleRepository.update(created.id, { title: `${created.title} Updated` });
    const archived = await articleRepository.archive(created.id);

    expect(created.id).toBeTruthy();
    expect(updated?.id).toBe(created.id);
    expect(archived?.id).toBe(created.id);
  });

  it("Events: getAll/getById/create/update/archive", async () => {
    const all = await eventRepository.getAll();
    expect(all.length).toBeGreaterThan(0);

    const first = all[0]!;
    const byId = await eventRepository.getById(first.id);
    expect(byId?.id).toBe(first.id);

    const created = await eventRepository.create(toCreateInput(first as unknown as Record<string, unknown>) as any);
    const updated = await eventRepository.update(created.id, { title: `${created.title} Updated` });
    const archived = await eventRepository.archive(created.id);

    expect(created.id).toBeTruthy();
    expect(updated?.id).toBe(created.id);
    expect(archived?.id).toBe(created.id);
  });

  it("Deals: getAll/getById/create/update/archive", async () => {
    const all = await dealRepository.getAll();
    expect(all.length).toBeGreaterThan(0);

    const first = all[0]!;
    const byId = await dealRepository.getById(first.id);
    expect(byId?.id).toBe(first.id);

    const created = await dealRepository.create(toCreateInput(first as unknown as Record<string, unknown>) as any);
    const updated = await dealRepository.update(created.id, { title: `${created.title} Updated` });
    const archived = await dealRepository.archive(created.id);

    expect(created.id).toBeTruthy();
    expect(updated?.id).toBe(created.id);
    expect(archived?.id).toBe(created.id);
  });

  it("Media: getAll/getById/create/update/archive", async () => {
    const all = await mediaRepository.getAll();
    expect(all.length).toBeGreaterThan(0);

    const first = all[0]!;
    const byId = await mediaRepository.getById(first.id);
    expect(byId?.id).toBe(first.id);

    const created = await mediaRepository.create(toCreateInput(first as unknown as Record<string, unknown>) as any);
    const updated = await mediaRepository.update(created.id, { title: `${created.title} Updated` });
    const archived = await mediaRepository.archive(created.id);

    expect(created.id).toBeTruthy();
    expect(updated?.id).toBe(created.id);
    expect(archived?.id).toBe(created.id);
  });

  it("Relationships: getAll/getById/create/update/archive", async () => {
    const all = await relationshipRepository.getAll();
    expect(all.length).toBeGreaterThan(0);

    const first = all[0]!;
    const byId = await relationshipRepository.getById(first.id);
    expect(byId?.id).toBe(first.id);

    const created = await relationshipRepository.create(toCreateInput(first as unknown as Record<string, unknown>) as any);
    const updated = await relationshipRepository.update(created.id, { notes: "Updated by contract test" } as any);
    const archived = await relationshipRepository.archive(created.id);

    expect(created.id).toBeTruthy();
    expect(updated?.id).toBe(created.id);
    expect(archived?.id).toBe(created.id);
  });

  it("Workflow: getAll/getById/create/update/archive", async () => {
    const all = await workflowRepository.getAll();
    expect(all.length).toBeGreaterThan(0);

    const first = all[0]!;
    const byId = await workflowRepository.getById(first.id);
    expect(byId?.id).toBe(first.id);

    const created = await workflowRepository.create(toCreateInput(first as unknown as Record<string, unknown>) as any);
    const updated = await workflowRepository.update(created.id, { note: "Updated by contract test" } as any);
    const archived = await workflowRepository.archive(created.id);

    expect(created.id).toBeTruthy();
    expect(updated?.id).toBe(created.id);
    expect(archived?.id).toBe(created.id);
  });

  it("Activity: getAll/getById/create/update/archive", async () => {
    const all = await activityRepository.getAll();
    expect(all.length).toBeGreaterThan(0);

    const first = all[0]!;
    const byId = await activityRepository.getById(first.id);
    expect(byId?.id).toBe(first.id);

    const created = await activityRepository.create(toCreateInput(first as unknown as Record<string, unknown>) as any);
    const updated = await activityRepository.update(created.id, { title: `${created.title} Updated` } as any);
    const archived = await activityRepository.archive(created.id);

    expect(created.id).toBeTruthy();
    expect(updated?.id).toBe(created.id);
    expect(archived?.id).toBe(created.id);
  });

  it("Reviews: getAll/getById/create/update/archive", async () => {
    const all = await reviewRepository.getAll();
    expect(all.length).toBeGreaterThan(0);

    const first = all[0]!;
    const byId = await reviewRepository.getById(first.id);
    expect(byId?.id).toBe(first.id);

    const created = await reviewRepository.create(toCreateInput(first as unknown as Record<string, unknown>) as any);
    const updated = await reviewRepository.update(created.id, { title: `${created.title} Updated` } as any);
    const archived = await reviewRepository.archive(created.id);

    expect(created.id).toBeTruthy();
    expect(updated?.id).toBe(created.id);
    expect(archived?.id).toBe(created.id);
  });

  it("Passport: getAll/getById/create/update/archive", async () => {
    const all = await passportRepository.getAll();
    expect(all.length).toBeGreaterThan(0);

    const first = all[0]!;
    const byId = await passportRepository.getById(first.id);
    expect(byId?.id).toBe(first.id);

    const created = await passportRepository.create(toCreateInput(first as unknown as Record<string, unknown>) as any);
    const updated = await passportRepository.update(created.id, { displayName: `${created.displayName} Updated` } as any);
    const archived = await passportRepository.archive(created.id);

    expect(created.id).toBeTruthy();
    expect(updated?.id).toBe(created.id);
    expect(archived?.id).toBe(created.id);
  });

  it("Feature Flags: getAll/getById/create/update/archive", async () => {
    const all = await featureFlagRepository.getAll();
    expect(all.length).toBeGreaterThan(0);

    const first = all[0]!;
    const byId = await featureFlagRepository.getById(first.key);
    expect(byId?.key).toBe(first.key);

    const created = await featureFlagRepository.create(first as any);
    const updated = await featureFlagRepository.update(created.key, !created.enabled);
    const archived = await featureFlagRepository.archive(created.key);

    expect(created.key).toBeTruthy();
    expect(updated?.key).toBe(created.key);
    expect(archived?.key).toBe(created.key);
  });
});
