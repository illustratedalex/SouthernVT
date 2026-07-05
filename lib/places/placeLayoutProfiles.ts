import type { Place } from "@/types/Place";
import { buildClaimListingHref } from "@/lib/claims/claimListingUrl";

type QuickFact = {
  label: string;
  value: string;
  detail?: string;
};

type CTAConfig = {
  title: string;
  description: string;
  href: string;
  label: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

type SidebarAction = {
  label: string;
  href: string;
};

type ContentLabels = {
  storyEyebrow: string;
  storyDescription: string;
  nearbyDescription: string;
  guidesDescription: string;
  safetyTitle: string;
  safetyDescription: string;
};

export type PlaceLayoutType =
  | "waterfall"
  | "hotel"
  | "shop"
  | "restaurant"
  | "trail"
  | "park"
  | "scenic_overlook"
  | "farm_stand"
  | "brewery"
  | "default";

export type PlaceLayoutProfile = {
  layoutType: PlaceLayoutType;
  heroBadges: string[];
  quickFacts: QuickFact[];
  visitorTips: string[];
  photographyTips: string[];
  primaryCTA: CTAConfig;
  secondaryCTA: CTAConfig;
  sidebarActions: SidebarAction[];
  contentLabels: ContentLabels;
};

function hasAmenity(place: Place, terms: string[]) {
  const normalized = place.amenities.map((item) => item.toLowerCase());
  return terms.some((term) => normalized.some((item) => item.includes(term)));
}

function parseBoolLabel(value: boolean | undefined, yesLabel: string, noLabel = "No") {
  return value ? yesLabel : noLabel;
}

function toTelHref(phone: string) {
  const digits = phone.replace(/[^+\d]/g, "");
  return digits ? `tel:${digits}` : "#";
}

function inferLayoutType(place: Place): PlaceLayoutType {
  if (place.placeType === "Waterfall") {
    return "waterfall";
  }
  if (place.placeType === "Hotel") {
    return "hotel";
  }
  if (place.placeType === "Shop") {
    return "shop";
  }
  if (place.placeType === "Restaurant") {
    return "restaurant";
  }
  if (place.placeType === "Brewery") {
    return "brewery";
  }
  if (place.placeType === "Scenic Overlook") {
    return "scenic_overlook";
  }
  if (place.placeType === "Farm Stand") {
    return "farm_stand";
  }
  if (place.placeType === "Trail") {
    const parkSignal =
      place.name.toLowerCase().includes("park") ||
      place.categories.some((category) => category.toLowerCase().includes("park")) ||
      place.tags.some((tag) => tag.toLowerCase().includes("park"));
    return parkSignal ? "park" : "trail";
  }
  return "default";
}

export function getPlaceLayoutProfile(place: Place): PlaceLayoutProfile {
  const layoutType = inferLayoutType(place);
  const dogFriendly = hasAmenity(place, ["dog", "pet"]);
  const familyFriendly = hasAmenity(place, ["family"]);
  const parking = hasAmenity(place, ["parking"]) ? "On-site" : "Nearby";
  const accessibility = hasAmenity(place, ["accessible"]) ? "Accessible" : "Check local access";

  const baseSidebarActions: SidebarAction[] = [
    { label: "Website", href: place.website || "#" },
    { label: "Call", href: toTelHref(place.phone) },
    { label: "Directions", href: "/map" },
    { label: "Save", href: `/places/${place.slug}` },
    { label: "Claim listing", href: buildClaimListingHref(place.slug) },
  ];

  switch (layoutType) {
    case "waterfall": {
      const swimming = place.metadata.waterfall?.swimming ?? place.tags.some((tag) => tag.toLowerCase().includes("swimming"));
      const dogs = place.metadata.trail?.dogsAllowed ?? dogFriendly;
      return {
        layoutType,
        heroBadges: [
          "Visit 2-3 hours",
          `Difficulty ${place.metadata.waterfall?.difficulty || "Moderate"}`,
          `Swimming ${parseBoolLabel(swimming, "Seasonal", "No")}`,
          `Dogs ${parseBoolLabel(dogs, "Allowed on leash", "Check local rules")}`,
          "Photography Friendly",
          "Late Spring to Fall",
        ],
        quickFacts: [
          { label: "Best season", value: "Late Spring to Fall", detail: "Strongest flow after rain and spring runoff." },
          { label: "Visit time", value: "2-3 hours", detail: "Allow extra time for trail conditions." },
          { label: "Trail length", value: place.metadata.waterfall?.trailDistance || "1.2 miles round trip", detail: "Round trip from trailhead." },
          { label: "Difficulty", value: place.metadata.waterfall?.difficulty || "Moderate", detail: "Steep, slick sections possible." },
          { label: "Swimming", value: parseBoolLabel(swimming, "Seasonal", "No"), detail: "Water levels can shift quickly." },
          { label: "Dogs", value: parseBoolLabel(dogs, "Allowed on leash", "Check local rules"), detail: "Trail etiquette recommended." },
          { label: "Parking", value: "Trailhead lot", detail: "Arrive early on summer weekends." },
          { label: "Restrooms", value: "Limited nearby", detail: "Use facilities before trail approach." },
          { label: "Cell service", value: "Limited", detail: "Weak signal in ravines and forest bends." },
          { label: "Accessibility", value: "Not ADA accessible", detail: "Uneven ground and natural terrain." },
        ],
        visitorTips: [
          "Wear proper footwear.",
          "Water levels can change quickly.",
          "Watch children near wet rock.",
          "Pack out everything.",
          "Visit early for easier parking.",
        ],
        photographyTips: [
          "Morning light gives the clearest texture and mist detail.",
          "After rainfall, flow is stronger and more dramatic.",
          "Use a wide frame for canyon context and a tighter frame for falls texture.",
        ],
        primaryCTA: {
          title: `Build a day around ${place.name}`,
          description: "Create a route with nearby food, village stops, and scenic add-ons.",
          href: "/planner/new",
          label: "Build a Trip",
          secondaryHref: `/places/${place.slug}`,
          secondaryLabel: "Save place",
        },
        secondaryCTA: {
          title: "Plan your field actions",
          description: "Use map orientation and passport tools before heading out.",
          href: "/map",
          label: "Open map",
          secondaryHref: `/passport/check-in/${place.id}`,
          secondaryLabel: "Passport check-in",
        },
        sidebarActions: baseSidebarActions,
        contentLabels: {
          storyEyebrow: "Flagship Story",
          storyDescription: "Waterfall field notes and seasonal context.",
          nearbyDescription: "Build a complete waterfall day with nearby nature and village anchors.",
          guidesDescription: "Turn this waterfall stop into a stronger full-day route with editorial guides.",
          safetyTitle: "Safety note",
          safetyDescription: "Conditions can shift quickly after weather events.",
        },
      };
    }

    case "hotel":
      return {
        layoutType,
        heroBadges: [
          "Historic lodging",
          "Stay 1-3 nights",
          parseBoolLabel(place.metadata.hotel?.petFriendly ?? dogFriendly, "Pet friendly", "No pets"),
          "Great for couples",
          "Fall getaway",
          place.verifiedBusiness ? "Verified partner" : "Local stay",
        ],
        quickFacts: [
          { label: "Check-in", value: place.metadata.hotel?.checkIn || "3:00 PM" },
          { label: "Check-out", value: "11:00 AM" },
          { label: "Rooms", value: place.metadata.hotel?.rooms || "Boutique inventory" },
          { label: "Pet friendly", value: parseBoolLabel(place.metadata.hotel?.petFriendly, "Yes", "No") },
          { label: "Breakfast", value: hasAmenity(place, ["breakfast"]) ? "Included" : "Nearby options" },
          { label: "Parking", value: parking },
          { label: "Wi-Fi", value: hasAmenity(place, ["wifi", "wi-fi"]) ? "Available" : "Ask property" },
          { label: "Restaurant / dining", value: hasAmenity(place, ["dining", "restaurant"]) ? "On-site or nearby" : "Nearby options" },
          { label: "Accessibility", value: accessibility },
          { label: "Best season", value: "Fall through winter", detail: "Strong foliage and holiday travel demand." },
        ],
        visitorTips: [
          "Book ahead during foliage season.",
          "Call directly for best availability.",
          "Ask about seasonal packages.",
          "Check walkable village access.",
          "Use this stay as a basecamp for nearby drives.",
        ],
        photographyTips: [
          "Capture exterior architecture at golden hour.",
          "Use village street angles for contextual storytelling.",
          "Frame interior details for hospitality atmosphere.",
        ],
        primaryCTA: {
          title: `Plan your stay at ${place.name}`,
          description: "Open booking and coordinate your overnight base.",
          href: place.website || "/places",
          label: "Visit website",
          secondaryHref: toTelHref(place.phone),
          secondaryLabel: "Call",
        },
        secondaryCTA: {
          title: "Map and save",
          description: "Pin directions and save this stay for your itinerary.",
          href: "/map",
          label: "Get directions",
          secondaryHref: `/places/${place.slug}`,
          secondaryLabel: "Save stay",
        },
        sidebarActions: baseSidebarActions,
        contentLabels: {
          storyEyebrow: "Stay Story",
          storyDescription: "Lodging context, village access, and trip-planning notes.",
          nearbyDescription: "Pair this stay with dining, scenic drives, and walkable village stops.",
          guidesDescription: "Use guides to shape day trips anchored by this hotel basecamp.",
          safetyTitle: "Travel note",
          safetyDescription: "Confirm seasonal check-in windows and weather impacts.",
        },
      };

    case "shop":
      return {
        layoutType,
        heroBadges: ["Local goods", "Browse 1-2 hours", "Family friendly", "Village stop", place.verifiedBusiness ? "Verified partner" : "Local favorite", "Seasonal picks"],
        quickFacts: [
          { label: "Products", value: place.metadata.shop?.products || "Local goods and gifts" },
          { label: "Local made", value: parseBoolLabel(place.metadata.shop?.localMade, "Yes", "Mixed") },
          { label: "Shipping", value: parseBoolLabel(place.metadata.shop?.shippingAvailable, "Available", "In-store only") },
          { label: "Parking", value: parking },
          { label: "Accessibility", value: accessibility },
          { label: "Best time to visit", value: "Late morning", detail: "Quieter browsing windows." },
          { label: "Nearby food", value: "Walkable options", detail: "Pair with lunch or coffee nearby." },
          { label: "Family friendly", value: parseBoolLabel(familyFriendly, "Yes", "Check in advance") },
        ],
        visitorTips: [
          "Check seasonal hours.",
          "Plan extra browsing time.",
          "Ask about locally made goods.",
        ],
        photographyTips: [
          "Capture storefront context with nearby streetscape.",
          "Photograph product displays in natural window light.",
          "Include local-made signage in detail shots.",
        ],
        primaryCTA: {
          title: `Plan your visit to ${place.name}`,
          description: "Open details and shopping information before you go.",
          href: place.website || "/places",
          label: "Visit website",
          secondaryHref: "/map",
          secondaryLabel: "Get directions",
        },
        secondaryCTA: {
          title: "Keep this stop handy",
          description: "Save this shop and return when finalizing your route.",
          href: `/places/${place.slug}`,
          label: "Save shop",
          secondaryHref: buildClaimListingHref(place.slug),
          secondaryLabel: "Claim listing",
        },
        sidebarActions: baseSidebarActions,
        contentLabels: {
          storyEyebrow: "Local Commerce Story",
          storyDescription: "Shop culture, product focus, and surrounding village rhythm.",
          nearbyDescription: "Build an easy browse-and-dine route around this shop stop.",
          guidesDescription: "Use local guides to combine retail stops with food and scenic detours.",
          safetyTitle: "Visitor note",
          safetyDescription: "Confirm holiday and seasonal opening hours.",
        },
      };

    case "trail":
    case "park": {
      const distance = place.metadata.trail?.distance || "Varies by route";
      const elevation = place.metadata.trail?.elevationGain || "Moderate gain";
      const dogs = place.metadata.trail?.dogsAllowed ?? dogFriendly;
      return {
        layoutType,
        heroBadges: [
          layoutType === "park" ? "State park adventure" : "Trail day",
          `Distance ${distance}`,
          `Elevation ${elevation}`,
          `Dogs ${parseBoolLabel(dogs, "Allowed", "Check rules")}`,
          "Outdoor exploration",
          "Best in spring-fall",
        ],
        quickFacts: [
          { label: "Distance", value: distance },
          { label: "Elevation", value: elevation },
          { label: "Difficulty", value: "Moderate", detail: "Check current trail conditions." },
          { label: "Dogs", value: parseBoolLabel(dogs, "Allowed", "Check local rules") },
          { label: "Parking", value: parking },
          { label: "Restrooms", value: hasAmenity(place, ["restroom"]) ? "Available" : "Limited" },
          { label: "Best season", value: "Late spring to fall" },
          { label: "Cell service", value: "Limited in remote sections" },
        ],
        visitorTips: [
          "Bring water.",
          "Check trail conditions.",
          "Wear proper footwear.",
          "Stay on marked trails.",
        ],
        photographyTips: [
          "Use ridge and tree-frame compositions for depth.",
          "Capture trail texture and wayfinding markers.",
          "Morning and late-day light gives stronger contrast.",
        ],
        primaryCTA: {
          title: `Plan your route for ${place.name}`,
          description: "Use map tools and trip builder before your trail day.",
          href: "/map",
          label: "Get directions",
          secondaryHref: "/planner/new",
          secondaryLabel: "Build a Trip",
        },
        secondaryCTA: {
          title: "Track your adventure",
          description: "Save this route and check in with Passport while on the trail.",
          href: `/places/${place.slug}`,
          label: "Save place",
          secondaryHref: `/passport/check-in/${place.id}`,
          secondaryLabel: "Passport",
        },
        sidebarActions: baseSidebarActions,
        contentLabels: {
          storyEyebrow: "Trail Story",
          storyDescription: "Terrain, pacing, and seasonal route conditions.",
          nearbyDescription: "Pair this route with nearby food, views, and shorter add-on stops.",
          guidesDescription: "Use guides to combine this route with village and scenic highlights.",
          safetyTitle: "Trail note",
          safetyDescription: "Weather and footing conditions can change quickly.",
        },
      };
    }

    case "restaurant":
    case "brewery": {
      const cuisine = place.metadata.restaurant?.cuisine || (layoutType === "brewery" ? "Taproom and pub fare" : "House specialties");
      return {
        layoutType,
        heroBadges: [layoutType === "brewery" ? "Taproom stop" : "Dining stop", "Great for weekends", "Local flavors", parseBoolLabel(hasAmenity(place, ["outdoor"]), "Outdoor seating", "Indoor focused"), "Plan ahead", "Evening friendly"],
        quickFacts: [
          { label: "Cuisine / taproom", value: cuisine },
          { label: "Hours", value: place.hours || "Check website" },
          { label: "Reservations", value: parseBoolLabel(place.metadata.restaurant?.reservations, "Recommended", "Walk-ins welcome") },
          { label: "Outdoor seating", value: parseBoolLabel(place.metadata.restaurant?.outdoorSeating || hasAmenity(place, ["outdoor"]), "Available", "Limited") },
          { label: "Family friendly", value: parseBoolLabel(familyFriendly, "Yes", "Varies by hour") },
          { label: "Dog friendly", value: parseBoolLabel(dogFriendly, "Patio only", "Check in advance") },
          { label: "Parking", value: parking },
          { label: "Price range", value: "$".repeat(Math.min(4, Math.max(1, place.categories.length % 4 + 1))) },
        ],
        visitorTips: [
          "Check hours before visiting.",
          "Reserve during busy weekends.",
          "Ask about seasonal specials.",
        ],
        photographyTips: [
          "Capture warm interior light and table scenes.",
          "Use detail frames for menu and specialty pours.",
          "Photograph exterior signage for wayfinding context.",
        ],
        primaryCTA: {
          title: `Visit ${place.name}`,
          description: "Open menu and contact details before you head over.",
          href: place.website || "/places",
          label: layoutType === "brewery" ? "View tap list" : "View menu",
          secondaryHref: toTelHref(place.phone),
          secondaryLabel: "Call",
        },
        secondaryCTA: {
          title: "Map and save",
          description: "Pin directions and save this stop to your route.",
          href: "/map",
          label: "Get directions",
          secondaryHref: `/places/${place.slug}`,
          secondaryLabel: "Save",
        },
        sidebarActions: baseSidebarActions,
        contentLabels: {
          storyEyebrow: "Local Flavor Story",
          storyDescription: "Dining atmosphere, service rhythm, and seasonal menu context.",
          nearbyDescription: "Pair this food stop with nearby walks, shops, and scenic detours.",
          guidesDescription: "Use guides for food-forward itineraries around this destination.",
          safetyTitle: "Visit note",
          safetyDescription: "Confirm hours, reservations, and holiday schedules before arrival.",
        },
      };
    }

    case "farm_stand":
      return {
        layoutType,
        heroBadges: ["Fresh local goods", "Seasonal market", "Family stop", "Morning friendly", "Weekend favorite", "Rural Vermont"],
        quickFacts: [
          { label: "Products", value: "Seasonal produce and local goods" },
          { label: "Hours", value: place.hours || "Check market schedule" },
          { label: "Parking", value: parking },
          { label: "Family friendly", value: parseBoolLabel(familyFriendly, "Yes", "Generally") },
          { label: "Accessibility", value: accessibility },
          { label: "Best season", value: "Summer to fall" },
        ],
        visitorTips: [
          "Arrive early for best produce selection.",
          "Bring reusable bags.",
          "Ask vendors about local seasonal specialties.",
        ],
        photographyTips: [
          "Capture morning stall light for color-rich produce shots.",
          "Include vendor signage and local labels.",
          "Shoot wider frames to show market atmosphere.",
        ],
        primaryCTA: {
          title: `Plan your market stop` ,
          description: "Map your route and confirm market timing.",
          href: "/map",
          label: "Get directions",
          secondaryHref: place.website || `/places/${place.slug}`,
          secondaryLabel: "Visit website",
        },
        secondaryCTA: {
          title: "Save this stop",
          description: "Keep this market on your itinerary.",
          href: `/places/${place.slug}`,
          label: "Save place",
          secondaryHref: buildClaimListingHref(place.slug),
          secondaryLabel: "Claim listing",
        },
        sidebarActions: baseSidebarActions,
        contentLabels: {
          storyEyebrow: "Market Story",
          storyDescription: "Seasonality, local producers, and best-time planning.",
          nearbyDescription: "Pair this market stop with nearby cafes and short scenic routes.",
          guidesDescription: "Use guides to combine local food stops into a complete day plan.",
          safetyTitle: "Visitor note",
          safetyDescription: "Weather and harvest cycles can impact offerings.",
        },
      };

    case "scenic_overlook":
      return {
        layoutType,
        heroBadges: ["Scenic drive", "Wide vistas", "Photo stop", "Great for couples", "Fall foliage", "Sunset friendly"],
        quickFacts: [
          { label: "Best season", value: "Fall and clear summer days" },
          { label: "Visit time", value: "1-2 hours" },
          { label: "Parking", value: parking },
          { label: "Accessibility", value: accessibility },
          { label: "Cell service", value: "Variable" },
          { label: "Family friendly", value: parseBoolLabel(familyFriendly, "Yes", "Yes") },
        ],
        visitorTips: [
          "Check weather for visibility before departure.",
          "Aim for golden hour for strongest light.",
          "Bring layers for summit wind changes.",
        ],
        photographyTips: [
          "Use layered ridgeline framing for depth.",
          "Capture both wide panoramas and focused detail crops.",
          "Tripods help during sunrise and sunset conditions.",
        ],
        primaryCTA: {
          title: `Scenic planning for ${place.name}`,
          description: "Map your drive and pair with nearby village stops.",
          href: "/map",
          label: "Get directions",
          secondaryHref: "/planner/new",
          secondaryLabel: "Build a Trip",
        },
        secondaryCTA: {
          title: "Save this overlook",
          description: "Keep this scenic stop in your route planning.",
          href: `/places/${place.slug}`,
          label: "Save",
          secondaryHref: "/explorer",
          secondaryLabel: "Explorer Mode",
        },
        sidebarActions: baseSidebarActions,
        contentLabels: {
          storyEyebrow: "Scenic Story",
          storyDescription: "View quality, seasonal timing, and route context.",
          nearbyDescription: "Connect this overlook to food, lodging, and nearby attractions.",
          guidesDescription: "Use guides to sequence scenic drives across Southern Vermont.",
          safetyTitle: "Road note",
          safetyDescription: "Mountain weather can change quickly; drive cautiously.",
        },
      };

    default:
      return {
        layoutType,
        heroBadges: [place.placeType, "Local favorite", "Flexible stop", "Scenic region", "Trip-ready", "Year-round"],
        quickFacts: [
          { label: "Type", value: place.placeType },
          { label: "Hours", value: place.hours || "Check website" },
          { label: "Parking", value: parking },
          { label: "Accessibility", value: accessibility },
          { label: "Best season", value: "Year-round" },
          { label: "Family friendly", value: parseBoolLabel(familyFriendly, "Yes", "Check in advance") },
        ],
        visitorTips: [
          "Check hours and local conditions before visiting.",
          "Pair this stop with nearby places for a fuller itinerary.",
          "Save this destination for quick route building.",
        ],
        photographyTips: [
          "Capture a wide establishing frame plus detail shots.",
          "Use morning or late-day light for richer texture.",
          "Include nearby context to tell the full destination story.",
        ],
        primaryCTA: {
          title: `Plan around ${place.name}`,
          description: "Build a trip with nearby places and seasonal stops.",
          href: "/planner/new",
          label: "Build a Trip",
          secondaryHref: `/places/${place.slug}`,
          secondaryLabel: "Save place",
        },
        secondaryCTA: {
          title: "Keep exploring Southern Vermont",
          description: "Use discovery and map tools to expand your route.",
          href: "/explorer",
          label: "Explorer Mode",
          secondaryHref: "/map",
          secondaryLabel: "Open map",
        },
        sidebarActions: baseSidebarActions,
        contentLabels: {
          storyEyebrow: "Place Story",
          storyDescription: "Local context and planning notes for this destination.",
          nearbyDescription: "Build a balanced day with nearby food, views, and activity stops.",
          guidesDescription: "Use guides to add context and sequence your route.",
          safetyTitle: "Visitor note",
          safetyDescription: "Check local conditions and operating windows.",
        },
      };
  }
}
