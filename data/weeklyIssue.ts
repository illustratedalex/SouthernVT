import type { EditorialIssue } from "@/types/EditorialIssue";

export type PublicationStage = "Idea" | "Assigned" | "Draft" | "Copy Desk" | "Photo Desk" | "Ready" | "Published";

export type WeeklyIssueStory = {
  title: string;
  summary: string;
  href: string;
  status: PublicationStage;
  contentHealth: number;
};

export type WeeklyIssueCard = {
  title: string;
  summary: string;
  href: string;
};

export type WeeklyIssueTask = {
  title: string;
  detail: string;
  status: "pending" | "in_progress" | "complete";
};

export type WeeklyIssueChecklistItem = {
  title: string;
  detail: string;
  complete: boolean;
};

export type WeeklyIssue = {
  issueNumber: number;
  title: string;
  theme: string;
  coverStory: WeeklyIssueStory & {
    leadPhotoPlaceholder: string;
  };
  publicationDate: string;
  completionPercent: number;
  currentStage: PublicationStage;
  publicationStages: Array<{ label: PublicationStage; complete: boolean }>;
  supportingStories: WeeklyIssueStory[];
  featuredCollections: WeeklyIssueCard[];
  photographyAssignments: WeeklyIssueTask[];
  verificationTasks: WeeklyIssueTask[];
  publicationChecklist: WeeklyIssueChecklistItem[];
  newsletterPreview: {
    subject: string;
    sections: WeeklyIssueCard[];
  };
  metrics: {
    storiesInProgress: number;
    storiesPublished: number;
    averageContentHealth: number;
    assignmentsComplete: number;
    photosOutstanding: number;
    verificationOutstanding: number;
  };
  editorialNotes: string;
};

export const weeklyIssue: WeeklyIssue = {
  issueNumber: 1,
  title: "Summer Swimming Holes",
  theme: "Cool off in Southern Vermont",
  publicationDate: "2026-07-10",
  completionPercent: 71,
  currentStage: "Copy Desk",
  coverStory: {
    title: "Hamilton Falls",
    summary:
      "A cinematic waterfall story with a lead image, access notes, and enough texture to anchor the whole weekly issue.",
    href: "/places/hamilton-falls",
    status: "Draft",
    contentHealth: 93,
    leadPhotoPlaceholder: "Lead photo placeholder",
  },
  publicationStages: [
    { label: "Idea", complete: true },
    { label: "Assigned", complete: true },
    { label: "Draft", complete: true },
    { label: "Copy Desk", complete: true },
    { label: "Photo Desk", complete: false },
    { label: "Ready", complete: false },
    { label: "Published", complete: false },
  ],
  supportingStories: [
    {
      title: "Jamaica State Park",
      summary: "A reliable family swim stop with easy access, shade, and a classic river-day feel.",
      href: "/places/jamaica-state-park",
      status: "Assigned",
      contentHealth: 86,
    },
    {
      title: "Lye Brook Falls",
      summary: "A cool forest hike with a waterfall payoff and a practical note on when the trail feels best.",
      href: "/places/lye-brook-falls",
      status: "Copy Desk",
      contentHealth: 84,
    },
    {
      title: "West River recreation",
      summary: "A route-level guide to river access, wading spots, and where to slow the day down.",
      href: "/explorer",
      status: "Draft",
      contentHealth: 81,
    },
    {
      title: "River safety guide",
      summary: "A clear, practical safety companion with conditions, etiquette, and what to watch for.",
      href: "/guides",
      status: "Published",
      contentHealth: 95,
    },
  ],
  featuredCollections: [
    {
      title: "Summer Swimming Holes",
      summary: "The anchor collection for easy summer planning around rivers, pools, and falls.",
      href: "/collections/summer-swimming-holes",
    },
    {
      title: "Waterfalls & River Days",
      summary: "A softer editorial lane for cool mornings, waterfall hikes, and open-air afternoons.",
      href: "/collections/breweries-and-bites",
    },
    {
      title: "Family Weekend Escapes",
      summary: "Useful for pairing swimming with food, lodging, and low-friction weekend planning.",
      href: "/collections/southern-vermont-with-kids",
    },
  ],
  photographyAssignments: [
    { title: "Hero needed", detail: "Hamilton Falls hero frame and story opener", status: "in_progress" },
    { title: "Gallery needed", detail: "Jamaica State Park and Lye Brook set coverage", status: "pending" },
    { title: "Drone needed", detail: "West River context shot for route framing", status: "pending" },
    { title: "Winter photos needed", detail: "Keep a seasonal fallback library for future reruns", status: "pending" },
    { title: "Vertical reel", detail: "Short-form clip for social and newsletter teasers", status: "in_progress" },
  ],
  verificationTasks: [
    { title: "Confirm access notes", detail: "Parking, trailheads, and river entry points", status: "complete" },
    { title: "Check water conditions", detail: "Low-water notes and recent weather context", status: "in_progress" },
    { title: "Validate safety language", detail: "Cold water, currents, and family-friendly guidance", status: "in_progress" },
    { title: "Recheck publication links", detail: "Collection and route links before release", status: "pending" },
  ],
  publicationChecklist: [
    { title: "Cover story edited", detail: "Headline, summary, and lead image all approved", complete: true },
    { title: "Supporting stories reviewed", detail: "All companion stories have a clear role in the issue", complete: true },
    { title: "Photo desk updated", detail: "Hero, gallery, drone, and reel status recorded", complete: false },
    { title: "Verification complete", detail: "Safety and access notes checked by editorial", complete: false },
    { title: "Newsletter preview ready", detail: "Subject line and section lineup prepared", complete: true },
    { title: "Homepage issue link live", detail: "Current issue card points to Hamilton Falls", complete: true },
  ],
  newsletterPreview: {
    subject: "This Weekend in Southern Vermont: Swimming Holes Edition",
    sections: [
      { title: "Cover Story", summary: "Hamilton Falls takes the lead with the issue's main summer day-out story.", href: "/places/hamilton-falls" },
      { title: "Hidden Gem", summary: "A quieter river stop tucked into the week's supporting coverage.", href: "/explorer" },
      { title: "Weekend Events", summary: "A quick scan for events that fit a swim-and-stroll weekend.", href: "/events" },
      { title: "Featured Partner", summary: "A local business spotlight that stays editorial and useful.", href: "/partner-portal" },
    ],
  },
  metrics: {
    storiesInProgress: 3,
    storiesPublished: 1,
    averageContentHealth: 88,
    assignmentsComplete: 4,
    photosOutstanding: 3,
    verificationOutstanding: 2,
  },
  editorialNotes:
    "The issue is centered on one clean summer story package: a waterfall lead, supporting river coverage, and practical safety notes.",
};

export const weeklyIssueEditorialIssue: EditorialIssue = {
  id: "issue-001",
  title: weeklyIssue.title,
  weekOf: "2026-07-07",
  theme: weeklyIssue.theme,
  status: "active",
  coverStoryId: "story-hamilton-falls",
  featuredPlaces: [
    "place-hamilton-falls",
    "place-jamaica-state-park",
    "place-lye-brook-falls",
    "place-west-river",
  ],
  featuredCollections: ["coll-summer-swimming-holes", "coll-waterfall-weekend"],
  featuredArticles: ["article-river-safety-guide", "article-west-river-recreation"],
  featuredEvents: ["event-summer-river-days"],
  featuredDeals: ["deal-cool-off-weekend"],
  assignments: [
    {
      id: "assign-cover-story",
      title: "Hamilton Falls feature story",
      type: "story",
      assignee: "Alex Chen",
      status: "in_progress",
      priority: "urgent",
      dueDate: "2026-07-08",
      contentId: "story-hamilton-falls",
      notes: "Strong lead, clear access notes, and a calm editorial voice.",
      createdAt: "2026-07-03T10:00:00Z",
      updatedAt: "2026-07-03T12:00:00Z",
    },
    {
      id: "assign-photo",
      title: "Hamilton Falls hero and gallery",
      type: "photography",
      assignee: "Jordan Davis",
      status: "assigned",
      priority: "high",
      dueDate: "2026-07-09",
      notes: "Need hero, gallery, and a vertical clip.",
      createdAt: "2026-07-03T10:00:00Z",
      updatedAt: "2026-07-03T10:00:00Z",
    },
    {
      id: "assign-research",
      title: "River safety and access research",
      type: "research",
      assignee: "Morgan Lee",
      status: "submitted",
      priority: "high",
      dueDate: "2026-07-07",
      notes: "Check signage, current conditions, and best-practice language.",
      createdAt: "2026-07-03T10:00:00Z",
      updatedAt: "2026-07-03T11:30:00Z",
    },
    {
      id: "assign-verification",
      title: "Verify supporting story facts",
      type: "verification",
      status: "review",
      priority: "medium",
      dueDate: "2026-07-08",
      notes: "Confirm access, parking, and seasonal caveats.",
      createdAt: "2026-07-03T10:00:00Z",
      updatedAt: "2026-07-03T12:30:00Z",
    },
    {
      id: "assign-seo",
      title: "SEO pass for swimming holes package",
      type: "seo",
      assignee: "Casey Smith",
      status: "idea",
      priority: "medium",
      dueDate: "2026-07-10",
      notes: "Focus on summer swimming, waterfalls, and river recreation terms.",
      createdAt: "2026-07-03T10:00:00Z",
      updatedAt: "2026-07-03T10:00:00Z",
    },
  ],
  notes: weeklyIssue.editorialNotes,
  createdAt: "2026-07-03T09:00:00Z",
  updatedAt: "2026-07-03T12:30:00Z",
};
