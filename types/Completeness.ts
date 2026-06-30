export type CompletenessItem = {
  key: string;
  label: string;
  points: number;
  completed: boolean;
  description: string;
};

export type CompletenessScore = {
  contentType: "place";
  contentId: string;
  score: number;
  maxScore: number;
  percentage: number;
  items: CompletenessItem[];
  missingItems: CompletenessItem[];
};
