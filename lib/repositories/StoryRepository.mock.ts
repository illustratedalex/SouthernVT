import { collectionStoryMap, mockStories, placeStoryMap } from "@/data/stories";
import type { Story } from "@/types/Story";

export type StoryInput = Omit<Story, "id" | "createdAt" | "updatedAt">;

let storyStore: Story[] = mockStories.map((story) => ({ ...story }));

function createStoryId(title: string) {
  return `story-${title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`;
}

export async function getStory(id: string): Promise<Story | null> {
  const story = storyStore.find((item) => item.id === id);
  return story ? { ...story } : null;
}

export async function getStoryByPlace(placeId: string): Promise<Story | null> {
  const storyId = placeStoryMap[placeId];
  if (!storyId) {
    return null;
  }
  return getStory(storyId);
}

export async function getStoryByCollection(collectionId: string): Promise<Story | null> {
  const storyId = collectionStoryMap[collectionId];
  if (!storyId) {
    return null;
  }
  return getStory(storyId);
}

export async function createStory(input: StoryInput): Promise<Story> {
  const created: Story = {
    id: createStoryId(input.title),
    ...input,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  storyStore = [created, ...storyStore];
  return { ...created };
}

export async function updateStory(id: string, updates: Partial<StoryInput>): Promise<Story | null> {
  const index = storyStore.findIndex((item) => item.id === id);
  if (index < 0) {
    return null;
  }

  const updated: Story = {
    ...storyStore[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  storyStore[index] = updated;
  return { ...updated };
}
