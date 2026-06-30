import { CompassEngine } from "@/lib/compass/CompassEngine";
import { DiscoveryService, type NextAdventure } from "@/lib/discovery/DiscoveryService";
import { getPlaces } from "@/repositories/PlaceRepository";
import type { Recommendation } from "@/types/Recommendation";
import type { RecommendationReason } from "@/types/RecommendationReason";
import type { Place } from "@/types/Place";

export type ExperienceRail = {
  key:
    | "daily_adventure"
    | "seasonal_engine"
    | "discover_mode"
    | "continue_exploring"
    | "editors_picks"
    | "recently_added"
    | "most_photographed"
    | "dog_friendly"
    | "family_friendly"
    | "under_30_minutes";
  title: string;
  description: string;
  recommendations: Recommendation<Place>[];
};

export type HomeFeed = {
  season: string;
  dailyAdventure: NextAdventure;
  rails: ExperienceRail[];
};

function inferSeason(month: number): string {
  if ([12, 1, 2].includes(month)) {
    return "Winter";
  }
  if ([3, 4, 5].includes(month)) {
    return "Spring";
  }
  if ([6, 7, 8].includes(month)) {
    return "Summer";
  }
  return "Fall";
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

function distanceMiles(a: Place, b: Place): number {
  const radiusMiles = 3958.8;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const t =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 2 * radiusMiles * Math.atan2(Math.sqrt(t), Math.sqrt(1 - t));
}

function withExtraReason(
  recommendations: Recommendation<Place>[],
  reason: RecommendationReason,
  bonusScore: number,
): Recommendation<Place>[] {
  return recommendations.map((recommendation) => ({
    ...recommendation,
    score: recommendation.score + bonusScore,
    reasons: [reason, ...recommendation.reasons],
  }));
}

async function scorePlaces(places: Place[], tags: string[], anchorPlace?: Place): Promise<Recommendation<Place>[]> {
  const scored = await Promise.all(
    places.map((place) => CompassEngine.scorePlace(place, { tags, anchorPlace })),
  );
  return scored.sort((a, b) => b.score - a.score);
}

export const ExperienceService = {
  async getHomeFeed(limitPerRail = 6): Promise<HomeFeed> {
    const month = new Date().getMonth() + 1;
    const season = inferSeason(month);

    const [dailyAdventure, allPlaces, seasonalEngine, discoverMode] = await Promise.all([
      DiscoveryService.getNextAdventure(),
      getPlaces(),
      CompassEngine.recommendForSeason(season, limitPerRail),
      CompassEngine.recommendAdventure(limitPerRail),
    ]);

    const publishedPlaces = allPlaces.filter((place) => place.status === "published");
    const anchorPlace = dailyAdventure.place ?? publishedPlaces[0] ?? null;

    const dailyAdventureRail = anchorPlace
      ? withExtraReason(
        [await CompassEngine.scorePlace(anchorPlace, { tags: ["adventure", "today"], season, anchorPlace: undefined })],
        {
          code: "adventure",
          message: "Today's anchor adventure.",
          weight: 12,
        },
        12,
      )
      : [];

    const continueExploring = anchorPlace
      ? await (async () => {
        const related = await DiscoveryService.getRelatedPlaces({ placeId: anchorPlace.id, limit: limitPerRail + 2 });
        const scored = await scorePlaces(related, anchorPlace.tags, anchorPlace);
        return withExtraReason(
          scored.slice(0, limitPerRail),
          {
            code: "relationships",
            message: "Continues from your current adventure cluster.",
            weight: 10,
          },
          10,
        );
      })()
      : [];

    const editorsCandidate = publishedPlaces.filter((place) => place.featured).slice(0, limitPerRail + 2);
    const editorsPicks = withExtraReason(
      (await scorePlaces(editorsCandidate, ["featured", "editorial"], anchorPlace ?? undefined)).slice(0, limitPerRail),
      {
        code: "featured",
        message: "Editor's Pick this week.",
        weight: 10,
      },
      10,
    );

    const recentlyAddedCandidates = [...publishedPlaces]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limitPerRail + 2);
    const recentlyAdded = withExtraReason(
      (await scorePlaces(recentlyAddedCandidates, ["new", "recent"], anchorPlace ?? undefined)).slice(0, limitPerRail),
      {
        code: "popularity",
        message: "Freshly added to the map.",
        weight: 9,
      },
      9,
    );

    const mostPhotographedCandidates = [...publishedPlaces]
      .sort((a, b) => (b.gallery.length + Number(Boolean(b.featuredImage))) - (a.gallery.length + Number(Boolean(a.featuredImage))))
      .slice(0, limitPerRail + 2);
    const mostPhotographed = withExtraReason(
      (await scorePlaces(mostPhotographedCandidates, ["scenic", "views", "photography"], anchorPlace ?? undefined)).slice(0, limitPerRail),
      {
        code: "photography",
        message: "Frequently photographed by visitors.",
        weight: 9,
      },
      9,
    );

    const dogFriendlyCandidates = publishedPlaces.filter((place) => {
      const amenitySignal = place.amenities.some((amenity) => amenity.toLowerCase().includes("dog") || amenity.toLowerCase().includes("pet"));
      const tagSignal = place.tags.some((tag) => tag.toLowerCase().includes("dog") || tag.toLowerCase().includes("pet"));
      const trailSignal = place.placeType === "Trail" && Boolean(place.metadata.trail?.dogsAllowed);
      return amenitySignal || tagSignal || trailSignal;
    });
    const dogFriendly = withExtraReason(
      (await scorePlaces(dogFriendlyCandidates, ["dog", "pet", "trail"], anchorPlace ?? undefined)).slice(0, limitPerRail),
      {
        code: "tags",
        message: "Dog friendly signals are strong here.",
        weight: 8,
      },
      8,
    );

    const familyFriendlyCandidates = publishedPlaces.filter((place) => {
      const amenitySignal = place.amenities.some((amenity) => amenity.toLowerCase().includes("family"));
      const tagSignal = place.tags.some((tag) => tag.toLowerCase().includes("family") || tag.toLowerCase().includes("kid"));
      return amenitySignal || tagSignal;
    });
    const familyFriendly = withExtraReason(
      (await scorePlaces(familyFriendlyCandidates, ["family", "kids", "easy"], anchorPlace ?? undefined)).slice(0, limitPerRail),
      {
        code: "family",
        message: "Family friendly pacing and activities.",
        weight: 8,
      },
      8,
    );

    const underThirtyCandidates = anchorPlace
      ? publishedPlaces
        .filter((place) => place.id !== anchorPlace.id)
        .map((place) => ({ place, minutes: Math.round((distanceMiles(anchorPlace, place) / 35) * 60) }))
        .filter((entry) => entry.minutes <= 30)
        .sort((a, b) => a.minutes - b.minutes)
        .slice(0, limitPerRail + 2)
        .map((entry) => entry.place)
      : [];
    const underThirtyMinutes = withExtraReason(
      (await scorePlaces(underThirtyCandidates, ["quick", "local", "nearby"], anchorPlace ?? undefined)).slice(0, limitPerRail),
      {
        code: "distance",
        message: "Estimated drive is under 30 minutes.",
        weight: 10,
      },
      10,
    );

    return {
      season,
      dailyAdventure,
      rails: [
        {
          key: "daily_adventure",
          title: "Daily Adventure",
          description: "Your daily anchor for building a Southern Vermont route.",
          recommendations: dailyAdventureRail,
        },
        {
          key: "seasonal_engine",
          title: `${season} Seasonal Engine`,
          description: "Season-aware recommendations tuned for right-now Southern Vermont conditions.",
          recommendations: seasonalEngine,
        },
        {
          key: "discover_mode",
          title: "Discover Mode",
          description: "Compass adventure-forward picks when you want a strong surprise route.",
          recommendations: discoverMode,
        },
        {
          key: "continue_exploring",
          title: "Continue Exploring",
          description: "Natural next stops based on your current adventure context.",
          recommendations: continueExploring,
        },
        {
          key: "editors_picks",
          title: "Editor's Picks",
          description: "A hand-selected feeling feed powered by featured local curation signals.",
          recommendations: editorsPicks,
        },
        {
          key: "recently_added",
          title: "Recently Added",
          description: "New places added to the Southern Vermont discovery graph.",
          recommendations: recentlyAdded,
        },
        {
          key: "most_photographed",
          title: "Most Photographed",
          description: "Photo-rich places that visitors consistently capture.",
          recommendations: mostPhotographed,
        },
        {
          key: "dog_friendly",
          title: "Dog Friendly",
          description: "Places where canine-friendly amenities or trail policies are clear.",
          recommendations: dogFriendly,
        },
        {
          key: "family_friendly",
          title: "Family Friendly",
          description: "Easy, flexible stops that work well for mixed-age groups.",
          recommendations: familyFriendly,
        },
        {
          key: "under_30_minutes",
          title: "Under 30 Minutes",
          description: "Quick-hit options for short drive-time exploration windows.",
          recommendations: underThirtyMinutes,
        },
      ],
    };
  },
};
