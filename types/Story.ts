export type StoryDifficulty = "Relaxed" | "Easy" | "Moderate" | "Challenging";

export type StorySeason = "Spring" | "Summer" | "Fall" | "Winter" | "Year-Round";

export interface Story {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  summary: string;
  author: string;
  readingTime: string;
  difficulty: StoryDifficulty;
  season: StorySeason;
  history: string[];
  visitorTips: string[];
  photographyTips: string[];
  localSecrets: string[];
  bestTimeToVisit: string;
  featuredQuote: string;
  createdAt: string;
  updatedAt: string;
}
