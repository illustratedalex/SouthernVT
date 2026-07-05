import type { RelationshipGraphData, RelationshipGraphEntity, RelationshipType } from "@/types/RelationshipGraph";

const relationshipLabels: Record<RelationshipType, string> = {
  near: "Near",
  inside: "Inside",
  related: "Related",
  recommended_after: "Recommended After",
  recommended_before: "Recommended Before",
  best_with: "Best With",
  hidden_gem: "Hidden Gem",
  family_friendly: "Family Friendly",
  dog_friendly: "Dog Friendly",
  photography: "Photography",
  camping: "Camping",
  historic: "Historic",
  food_nearby: "Food Nearby",
  coffee_nearby: "Coffee Nearby",
  lodging_nearby: "Lodging Nearby",
  shopping_nearby: "Shopping Nearby",
  rainy_day: "Rainy Day",
  fall_foliage: "Fall Foliage",
  winter: "Winter",
  summer: "Summer",
};

export function getRelationshipLabel(type: RelationshipType) {
  return relationshipLabels[type];
}

const entities: RelationshipGraphEntity[] = [
  { id: "place-hamilton-falls", type: "place", name: "Hamilton Falls", slug: "hamilton-falls", href: "/places/hamilton-falls" },
  { id: "place-jamaica-state-park", type: "place", name: "Jamaica State Park", slug: "jamaica-state-park", href: "/places/jamaica-state-park" },
  { id: "place-grafton-inn", type: "place", name: "Grafton Inn", slug: "grafton-inn", href: "/places/grafton-inn" },
  { id: "place-vermont-country-store", type: "place", name: "Vermont Country Store", slug: "vermont-country-store", href: "/places/vermont-country-store" },
  { id: "place-mount-equinox-skyline-drive", type: "place", name: "Mount Equinox Skyline Drive", slug: "mount-equinox-skyline-drive", href: "/places/mount-equinox-skyline-drive" },

  { id: "business-grafton-inn", type: "business", name: "Grafton Inn", slug: "grafton-inn-business", href: "/businesses/grafton-inn-business" },
  { id: "business-putney-mountain-roasters", type: "business", name: "Putney Mountain Roasters", slug: "putney-mountain-roasters", href: "/businesses/putney-mountain-roasters" },
  { id: "business-vermont-country-store", type: "business", name: "Vermont Country Store", slug: "vermont-country-store-business", href: "/businesses/vermont-country-store-business" },
  { id: "business-founding-firehouse-bbq", type: "business", name: "Founding Firehouse BBQ", slug: "founding-firehouse-bbq", href: "/businesses/founding-firehouse-bbq" },
  { id: "business-village-square-booksellers-cafe", type: "business", name: "Village Square Booksellers Cafe" },
  { id: "business-red-slate", type: "business", name: "The Red Slate" },

  { id: "collection-summer-swimming-holes", type: "collection", name: "Summer Swimming Holes", slug: "summer-swimming-holes", href: "/collections/summer-swimming-holes" },
  { id: "collection-fall-foliage-weekend", type: "collection", name: "Fall Foliage Weekend", slug: "fall-foliage-weekend", href: "/collections/fall-foliage-weekend" },
  { id: "collection-southern-vermont-with-kids", type: "collection", name: "Southern Vermont With Kids", slug: "southern-vermont-with-kids", href: "/collections/southern-vermont-with-kids" },
  { id: "collection-breweries-and-bites", type: "collection", name: "Breweries & Bites", slug: "breweries-and-bites", href: "/collections/breweries-and-bites" },

  { id: "article-hamilton-falls-why-it-matters", type: "article", name: "Hamilton Falls and Why It Matters" },
  { id: "guide-swimming-holes", type: "guide", name: "Best Swimming Holes in Southern Vermont", slug: "best-swimming-holes-southern-vermont", href: "/guides/best-swimming-holes-southern-vermont" },
  { id: "guide-rainy-day-adventures", type: "guide", name: "Rainy Day Adventures in Southern Vermont", slug: "rainy-day-adventures-southern-vermont", href: "/guides/rainy-day-adventures-southern-vermont" },

  { id: "event-manchester-fall-foliage-walk", type: "event", name: "Manchester Fall Foliage Walk", slug: "manchester-fall-foliage-walk", href: "/events/manchester-fall-foliage-walk" },
  { id: "event-grafton-food-antique-festival", type: "event", name: "Grafton Food & Antique Festival", slug: "grafton-food-antique-festival", href: "/events/grafton-food-antique-festival" },
  { id: "event-brattleboro-farmers-market", type: "event", name: "Brattleboro Farmers Market", slug: "brattleboro-farmers-market", href: "/events/brattleboro-farmers-market" },

  { id: "deal-swimming-hole-picnic-package", type: "deal", name: "Summer Swimming Hole Picnic Package", slug: "summer-swimming-hole-picnic-package", href: "/deals/summer-swimming-hole-picnic-package" },
  { id: "deal-grafton-weekday-10", type: "deal", name: "10% Off Weekday Stays at Grafton Inn", slug: "grafton-inn-10-percent-weekday-stays", href: "/deals/grafton-inn-10-percent-weekday-stays" },

  { id: "town-jamaica", type: "town", name: "Jamaica" },
  { id: "town-grafton", type: "town", name: "Grafton" },
  { id: "region-west-river-valley", type: "region", name: "West River Valley" },

  { id: "person-field-editor", type: "person", name: "Field Editor" },

  { id: "season-summer", type: "season", name: "Summer" },
  { id: "season-fall", type: "season", name: "Fall" },
  { id: "season-winter", type: "season", name: "Winter" },

  { id: "activity-picnic", type: "activity", name: "Picnic" },
  { id: "activity-drone-photography", type: "activity", name: "Drone Photography" },
];

export const relationshipGraphData: RelationshipGraphData = {
  entities,
  links: [
    { id: "l1", fromId: "place-hamilton-falls", toId: "place-jamaica-state-park", type: "near" },
    { id: "l2", fromId: "place-hamilton-falls", toId: "region-west-river-valley", type: "inside" },
    { id: "l3", fromId: "place-hamilton-falls", toId: "activity-picnic", type: "best_with" },
    { id: "l4", fromId: "place-hamilton-falls", toId: "place-grafton-inn", type: "recommended_after" },
    { id: "l5", fromId: "place-hamilton-falls", toId: "business-red-slate", type: "food_nearby" },
    { id: "l7", fromId: "place-hamilton-falls", toId: "collection-summer-swimming-holes", type: "related" },
    { id: "l8", fromId: "place-hamilton-falls", toId: "guide-swimming-holes", type: "related" },
    { id: "l9", fromId: "place-hamilton-falls", toId: "season-summer", type: "summer" },
    { id: "l10", fromId: "place-hamilton-falls", toId: "season-fall", type: "fall_foliage" },
    { id: "l11", fromId: "place-hamilton-falls", toId: "town-jamaica", type: "inside" },

    { id: "l12", fromId: "place-jamaica-state-park", toId: "place-hamilton-falls", type: "recommended_before" },
    { id: "l13", fromId: "place-jamaica-state-park", toId: "deal-swimming-hole-picnic-package", type: "related" },
    { id: "l14", fromId: "place-jamaica-state-park", toId: "activity-picnic", type: "family_friendly" },
    { id: "l15", fromId: "place-jamaica-state-park", toId: "season-summer", type: "summer" },
    { id: "l16", fromId: "place-jamaica-state-park", toId: "season-winter", type: "winter" },

    { id: "l17", fromId: "business-grafton-inn", toId: "place-grafton-inn", type: "near" },
    { id: "l18", fromId: "business-grafton-inn", toId: "collection-fall-foliage-weekend", type: "related" },
    { id: "l19", fromId: "business-grafton-inn", toId: "event-grafton-food-antique-festival", type: "related" },
    { id: "l20", fromId: "business-grafton-inn", toId: "deal-grafton-weekday-10", type: "related" },
    { id: "l21", fromId: "business-grafton-inn", toId: "town-grafton", type: "inside" },
    { id: "l22", fromId: "business-grafton-inn", toId: "place-mount-equinox-skyline-drive", type: "near" },

    { id: "l23", fromId: "business-vermont-country-store", toId: "place-vermont-country-store", type: "near" },
    { id: "l24", fromId: "business-vermont-country-store", toId: "collection-fall-foliage-weekend", type: "shopping_nearby" },
    { id: "l25", fromId: "business-vermont-country-store", toId: "event-manchester-fall-foliage-walk", type: "related" },

    { id: "l26", fromId: "business-putney-mountain-roasters", toId: "place-jamaica-state-park", type: "coffee_nearby" },
    { id: "l27", fromId: "business-putney-mountain-roasters", toId: "collection-summer-swimming-holes", type: "related" },
    { id: "l28", fromId: "business-putney-mountain-roasters", toId: "event-brattleboro-farmers-market", type: "related" },

    { id: "l29", fromId: "collection-summer-swimming-holes", toId: "business-putney-mountain-roasters", type: "coffee_nearby" },
    { id: "l30", fromId: "collection-summer-swimming-holes", toId: "business-founding-firehouse-bbq", type: "food_nearby" },
    { id: "l31", fromId: "collection-summer-swimming-holes", toId: "business-grafton-inn", type: "lodging_nearby" },
    { id: "l32", fromId: "collection-summer-swimming-holes", toId: "place-jamaica-state-park", type: "related" },

    { id: "l33", fromId: "collection-fall-foliage-weekend", toId: "business-vermont-country-store", type: "shopping_nearby" },
    { id: "l34", fromId: "collection-fall-foliage-weekend", toId: "business-grafton-inn", type: "lodging_nearby" },
    { id: "l35", fromId: "collection-southern-vermont-with-kids", toId: "business-founding-firehouse-bbq", type: "family_friendly" },
    { id: "l36", fromId: "collection-breweries-and-bites", toId: "business-founding-firehouse-bbq", type: "food_nearby" },

    { id: "l37", fromId: "guide-rainy-day-adventures", toId: "collection-fall-foliage-weekend", type: "rainy_day" },
    { id: "l38", fromId: "article-hamilton-falls-why-it-matters", toId: "place-hamilton-falls", type: "historic" },
    { id: "l39", fromId: "person-field-editor", toId: "place-hamilton-falls", type: "hidden_gem" },
  ],
};

export function getRelationshipGraph() {
  return relationshipGraphData;
}
