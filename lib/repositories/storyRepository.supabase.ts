import type { Story } from "@/types/Story";

export type StoryInput = Omit<Story, "id" | "createdAt" | "updatedAt">;

function notImplemented(): never {
  throw new Error("Story supabase repository is not implemented yet.");
}

export async function getStoryByPlace(_placeId: string): Promise<Story | null> {
  notImplemented();
}

export async function getStoryByCollection(_collectionId: string): Promise<Story | null> {
  notImplemented();
}

export async function getStory(_id: string): Promise<Story | null> {
  notImplemented();
}

export async function createStory(_input: StoryInput): Promise<Story> {
  notImplemented();
}

export async function updateStory(_id: string, _updates: Partial<StoryInput>): Promise<Story | null> {
  notImplemented();
}

export const supabaseStoryRepository = {
  getStoryByPlace,
  getStoryByCollection,
  getStory,
  createStory,
  updateStory,
};
