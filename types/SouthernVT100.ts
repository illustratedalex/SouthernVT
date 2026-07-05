export type SouthernVT100Coverage = "Core Southern Vermont" | "Worth the Drive" | "Regional Feature";

export type SouthernVT100Category =
  | "Waterfalls"
  | "Swimming Holes"
  | "State Parks"
  | "Historic Villages"
  | "Covered Bridges"
  | "Scenic Drives"
  | "Mountains"
  | "Breweries"
  | "Coffee"
  | "Restaurants"
  | "Lodging"
  | "Museums"
  | "Shopping"
  | "Art"
  | "Family"
  | "Winter"
  | "Photography"
  | "Hidden Gems"
  | "Worth the Drive"
  | "Regional Features";

export type SouthernVT100Priority = "Critical" | "High" | "Medium" | "Low";

export type SouthernVT100EditorialStatus =
  | "Idea"
  | "Research"
  | "Assigned"
  | "Writing"
  | "Photography"
  | "Copy Desk"
  | "Ready"
  | "Published";

export type SouthernVT100IssueAssignment = "Current Issue" | "Future Issue" | "None";

export type SouthernVT100Season = "Spring" | "Summer" | "Fall" | "Winter" | "Evergreen";

export interface SouthernVT100Verification {
  location: boolean;
  photo: boolean;
  visited: boolean;
  recommended: boolean;
}

export interface SouthernVT100Destination {
  id: string;
  slug: string;
  name: string;
  town: string;
  region: string;
  coverage: SouthernVT100Coverage;
  category: SouthernVT100Category;
  priority: SouthernVT100Priority;
  editorialStatus: SouthernVT100EditorialStatus;
  verification: SouthernVT100Verification;
  contentHealth: number;
  coverageScore: number;
  relationshipScore: number;
  photographyScore: number;
  issueAssignment: SouthernVT100IssueAssignment;
  season: SouthernVT100Season;
}
