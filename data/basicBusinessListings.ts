import type { BusinessListing } from "@/types/BusinessListing";

const BASIC_DESCRIPTION =
  "Basic SouthernVT listing. Details may be incomplete. Business owners can claim this page to update information.";

type BasicListingSeed = {
  name: string;
  slug: string;
  category: string;
  town: string;
  county: string;
  address?: string;
  phone?: string;
  website?: string;
  completenessScore: number;
};

const createdAt = "2026-07-05T12:00:00.000Z";
const updatedAt = "2026-07-05T12:00:00.000Z";
const lastReviewedAt = "2026-07-05T12:00:00.000Z";

function createBasicListing(seed: BasicListingSeed, index: number): BusinessListing {
  return {
    id: `business-basic-${String(index + 1).padStart(3, "0")}`,
    name: seed.name,
    slug: seed.slug,
    category: seed.category,
    town: seed.town,
    county: seed.county,
    address: seed.address ?? "",
    phone: seed.phone ?? "",
    website: seed.website ?? "",
    description: BASIC_DESCRIPTION,
    status: "basic",
    claimStatus: "unclaimed",
    source: "southernvt_seeded",
    completenessScore: seed.completenessScore,
    isFeatured: false,
    isFoundingPartner: false,
    isVerified: false,
    createdAt,
    updatedAt,
    lastReviewedAt,
  };
}

const seedsByTown: Record<string, BasicListingSeed[]> = {
  Arlington: [
    { name: "Arlington Green Covered Bridge", slug: "arlington-green-covered-bridge", category: "Attraction", town: "Arlington", county: "Bennington County", completenessScore: 46 },
    { name: "Battenkill River Access", slug: "battenkill-river-access-arlington", category: "Outdoor Recreation", town: "Arlington", county: "Bennington County", completenessScore: 44 },
    { name: "Camping on the Battenkill", slug: "camping-on-the-battenkill-arlington", category: "Campground", town: "Arlington", county: "Bennington County", completenessScore: 48 },
    { name: "Kelly Stand Road", slug: "kelly-stand-road-arlington", category: "Attraction", town: "Arlington", county: "Bennington County", completenessScore: 39 },
  ],
  "Bellows Falls": [
    { name: "Bellows Falls Opera House", slug: "bellows-falls-opera-house", category: "Attraction", town: "Bellows Falls", county: "Windham County", completenessScore: 47 },
    { name: "Canal House Inn", slug: "canal-house-inn-bellows-falls", category: "Lodging", town: "Bellows Falls", county: "Windham County", completenessScore: 46 },
    { name: "Flat Iron Exchange", slug: "flat-iron-exchange-bellows-falls", category: "Restaurant", town: "Bellows Falls", county: "Windham County", completenessScore: 54 },
    { name: "Hall Art Foundation", slug: "hall-art-foundation-bellows-falls", category: "Gallery", town: "Bellows Falls", county: "Windham County", completenessScore: 46 },
    { name: "Village Square Booksellers Cafe", slug: "village-square-booksellers-cafe-bellows-falls", category: "Cafe", town: "Bellows Falls", county: "Windham County", completenessScore: 50 },
    { name: "Wunderbar", slug: "wunderbar-bellows-falls", category: "Restaurant", town: "Bellows Falls", county: "Windham County", completenessScore: 55 },
  ],
  Bennington: [
    { name: "Bennington Battle Monument", slug: "bennington-battle-monument", category: "Museum", town: "Bennington", county: "Bennington County", completenessScore: 49 },
    { name: "Bennington Museum", slug: "bennington-museum", category: "Museum", town: "Bennington", county: "Bennington County", completenessScore: 53 },
    { name: "Madison Brewing Company Pub & Restaurant", slug: "madison-brewing-company-bennington", category: "Brewery", town: "Bennington", county: "Bennington County", completenessScore: 51 },
    { name: "Old First Church", slug: "old-first-church-bennington", category: "Attraction", town: "Bennington", county: "Bennington County", completenessScore: 43 },
    { name: "Park-McCullough Historic Governor's Mansion", slug: "park-mccullough-historic-governors-mansion-bennington", category: "Museum", town: "Bennington", county: "Bennington County", completenessScore: 45 },
    { name: "Silk Road Covered Bridge", slug: "silk-road-covered-bridge-bennington", category: "Attraction", town: "Bennington", county: "Bennington County", completenessScore: 42 },
  ],
  Brattleboro: [
    { name: "Brattleboro Area Farmers Market", slug: "brattleboro-area-farmers-market", category: "Farm Stand", town: "Brattleboro", county: "Windham County", completenessScore: 53 },
    { name: "Brattleboro Food Co-op", slug: "brattleboro-food-co-op", category: "Shopping", town: "Brattleboro", county: "Windham County", completenessScore: 52 },
    { name: "Brattleboro Museum & Art Center", slug: "brattleboro-museum-and-art-center-business", category: "Museum", town: "Brattleboro", county: "Windham County", completenessScore: 54 },
    { name: "Brattleboro North KOA Journey", slug: "brattleboro-north-koa-journey", category: "Campground", town: "Brattleboro", county: "Windham County", completenessScore: 44 },
    { name: "Creamery Covered Bridge", slug: "creamery-covered-bridge-brattleboro", category: "Attraction", town: "Brattleboro", county: "Windham County", completenessScore: 40 },
    { name: "Duo Restaurant", slug: "duo-restaurant-brattleboro", category: "Restaurant", town: "Brattleboro", county: "Windham County", completenessScore: 49 },
    { name: "Echo Restaurant & Lounge", slug: "echo-restaurant-and-lounge-brattleboro", category: "Restaurant", town: "Brattleboro", county: "Windham County", completenessScore: 46 },
    { name: "Harris Hill Ski Jump", slug: "harris-hill-ski-jump-brattleboro", category: "Attraction", town: "Brattleboro", county: "Windham County", completenessScore: 41 },
    { name: "Hermit Thrush Brewery", slug: "hermit-thrush-brewery", category: "Brewery", town: "Brattleboro", county: "Windham County", completenessScore: 55 },
    { name: "Latchis Hotel", slug: "latchis-hotel-brattleboro", category: "Lodging", town: "Brattleboro", county: "Windham County", completenessScore: 47 },
    { name: "Latchis Theatre", slug: "latchis-theatre-brattleboro", category: "Attraction", town: "Brattleboro", county: "Windham County", completenessScore: 44 },
    { name: "Peter Havens Restaurant", slug: "peter-havens-restaurant-brattleboro", category: "Restaurant", town: "Brattleboro", county: "Windham County", completenessScore: 45 },
    { name: "Retreat Farm", slug: "retreat-farm-business", category: "Attraction", town: "Brattleboro", county: "Windham County", completenessScore: 55 },
    { name: "Stone Church", slug: "stone-church-brattleboro", category: "Attraction", town: "Brattleboro", county: "Windham County", completenessScore: 43 },
    { name: "The Works Bakery Cafe", slug: "the-works-bakery-cafe-brattleboro", category: "Cafe", town: "Brattleboro", county: "Windham County", completenessScore: 46 },
    { name: "T.J. Buckley's", slug: "tj-buckleys-brattleboro", category: "Restaurant", town: "Brattleboro", county: "Windham County", completenessScore: 44 },
    { name: "Vermont Country Deli", slug: "vermont-country-deli-brattleboro", category: "Restaurant", town: "Brattleboro", county: "Windham County", completenessScore: 42 },
    { name: "Whetstone Station Restaurant & Brewery", slug: "whetstone-station-restaurant-brewery-brattleboro", category: "Brewery", town: "Brattleboro", county: "Windham County", completenessScore: 54 },
  ],
  Chester: [
    { name: "Chester Theatre Company", slug: "chester-theatre-company", category: "Attraction", town: "Chester", county: "Windsor County", completenessScore: 44 },
    { name: "DaVallia Art & Accents", slug: "davallia-art-accents-chester", category: "Gallery", town: "Chester", county: "Windsor County", completenessScore: 41 },
    { name: "Free Range Restaurant", slug: "free-range-restaurant-chester", category: "Restaurant", town: "Chester", county: "Windsor County", completenessScore: 49 },
    { name: "Southern Pie Cafe", slug: "southern-pie-cafe-chester", category: "Cafe", town: "Chester", county: "Windsor County", completenessScore: 43 },
    { name: "Stone Hearth Inn", slug: "stone-hearth-inn-chester", category: "Lodging", town: "Chester", county: "Windsor County", completenessScore: 42 },
    { name: "Yosemite Firehouse Museum", slug: "yosemite-firehouse-museum-chester", category: "Museum", town: "Chester", county: "Windsor County", completenessScore: 39 },
  ],
  Dorset: [
    { name: "Barrows House", slug: "barrows-house-dorset", category: "Lodging", town: "Dorset", county: "Bennington County", completenessScore: 43 },
    { name: "Dorset Bakery Cafe", slug: "dorset-bakery-cafe", category: "Bakery", town: "Dorset", county: "Bennington County", completenessScore: 39 },
    { name: "Dorset Inn", slug: "dorset-inn", category: "Lodging", town: "Dorset", county: "Bennington County", completenessScore: 44 },
    { name: "Dorset Quarry", slug: "dorset-quarry", category: "Attraction", town: "Dorset", county: "Bennington County", completenessScore: 47 },
    { name: "Dorset Theatre Festival", slug: "dorset-theatre-festival", category: "Attraction", town: "Dorset", county: "Bennington County", completenessScore: 46 },
    { name: "Emerald Lake State Park Campground", slug: "emerald-lake-state-park-campground-dorset", category: "Campground", town: "Dorset", county: "Bennington County", completenessScore: 45 },
    { name: "The Dorset Union Store", slug: "the-dorset-union-store", category: "General Store", town: "Dorset", county: "Bennington County", completenessScore: 42 },
  ],
  Dover: [
    { name: "1846 Tavern and Restaurant", slug: "1846-tavern-dover", category: "Restaurant", town: "Dover", county: "Windham County", completenessScore: 47 },
    { name: "Aerie Inn of Vermont", slug: "aerie-inn-of-vermont-dover", category: "Lodging", town: "Dover", county: "Windham County", completenessScore: 41 },
    { name: "Gray Ghost Inn", slug: "gray-ghost-inn-dover", category: "Lodging", town: "Dover", county: "Windham County", completenessScore: 43 },
    { name: "Mount Snow Grand Summit Resort", slug: "mount-snow-grand-summit-resort", category: "Lodging", town: "Dover", county: "Windham County", completenessScore: 48 },
    { name: "Mount Snow Resort", slug: "mount-snow-resort-dover", category: "Attraction", town: "Dover", county: "Windham County", completenessScore: 52 },
    { name: "Snow Republic Brewery", slug: "snow-republic-brewery-dover", category: "Brewery", town: "Dover", county: "Windham County", completenessScore: 42 },
    { name: "Two Tannery Road", slug: "two-tannery-road-dover", category: "Restaurant", town: "Dover", county: "Windham County", completenessScore: 44 },
  ],
  Grafton: [
    { name: "Grafton Historical Society Museum", slug: "grafton-historical-society-museum", category: "Museum", town: "Grafton", county: "Windham County", completenessScore: 44 },
    { name: "Grafton Inn", slug: "grafton-inn", category: "Lodging", town: "Grafton", county: "Windham County", completenessScore: 56 },
    { name: "Grafton Trails & Outdoor Center", slug: "grafton-trails-outdoor-center", category: "Outdoor Recreation", town: "Grafton", county: "Windham County", completenessScore: 50 },
    { name: "Grafton Village Cheese", slug: "grafton-village-cheese", category: "Shopping", town: "Grafton", county: "Windham County", completenessScore: 55 },
    { name: "Kidder Covered Bridge", slug: "kidder-covered-bridge-grafton", category: "Attraction", town: "Grafton", county: "Windham County", completenessScore: 43 },
    { name: "MKT Grafton", slug: "mkt-grafton", category: "Cafe", town: "Grafton", county: "Windham County", completenessScore: 44 },
    { name: "Nature Museum at Grafton", slug: "nature-museum-at-grafton", category: "Museum", town: "Grafton", county: "Windham County", completenessScore: 45 },
    { name: "Phelps Barn Pub", slug: "phelps-barn-pub-grafton", category: "Restaurant", town: "Grafton", county: "Windham County", completenessScore: 49 },
  ],
  Jamaica: [
    { name: "Jamaica Cottage Shop", slug: "jamaica-cottage-shop", category: "Shopping", town: "Jamaica", county: "Windham County", completenessScore: 36 },
    { name: "Jamaica State Park", slug: "jamaica-state-park", category: "Attraction", town: "Jamaica", county: "Windham County", completenessScore: 51 },
    { name: "Jamaica State Park Campground", slug: "jamaica-state-park-campground", category: "Campground", town: "Jamaica", county: "Windham County", completenessScore: 46 },
    { name: "Jamaica Village Bakery", slug: "jamaica-village-bakery", category: "Bakery", town: "Jamaica", county: "Windham County", completenessScore: 38 },
    { name: "Jamaica Village Inn", slug: "jamaica-village-inn", category: "Lodging", town: "Jamaica", county: "Windham County", completenessScore: 42 },
    { name: "Pikes Falls", slug: "pikes-falls-jamaica", category: "Attraction", town: "Jamaica", county: "Windham County", completenessScore: 48 },
    { name: "West River Provisions", slug: "west-river-provisions-jamaica", category: "Farm Stand", town: "Jamaica", county: "Windham County", completenessScore: 41 },
  ],
  Londonderry: [
    { name: "SoLo Farm & Table", slug: "solo-farm-and-table-londonderry", category: "Restaurant", town: "Londonderry", county: "Windham County", completenessScore: 45 },
    { name: "The Corner Market Deli", slug: "corner-market-deli-londonderry", category: "Cafe", town: "Londonderry", county: "Windham County", completenessScore: 40 },
    { name: "The New American Grill", slug: "the-new-american-grill-londonderry", category: "Restaurant", town: "Londonderry", county: "Windham County", completenessScore: 43 },
    { name: "Viking Nordic Center", slug: "viking-nordic-center-londonderry", category: "Attraction", town: "Londonderry", county: "Windham County", completenessScore: 39 },
    { name: "West River Inn", slug: "west-river-inn-londonderry", category: "Lodging", town: "Londonderry", county: "Windham County", completenessScore: 45 },
    { name: "Winhall Brook Campground", slug: "winhall-brook-campground-londonderry", category: "Campground", town: "Londonderry", county: "Windham County", completenessScore: 42 },
  ],
  Manchester: [
    { name: "Bonnet & Main Cafe", slug: "bonnet-main-cafe-manchester", category: "Cafe", town: "Manchester", county: "Bennington County", completenessScore: 43 },
    { name: "Copper Grouse", slug: "copper-grouse-manchester", category: "Restaurant", town: "Manchester", county: "Bennington County", completenessScore: 47 },
    { name: "Equinox Skyline Drive", slug: "equinox-skyline-drive-manchester", category: "Attraction", town: "Manchester", county: "Bennington County", completenessScore: 44 },
    { name: "Hildene", slug: "hildene-manchester", category: "Museum", town: "Manchester", county: "Bennington County", completenessScore: 55 },
    { name: "Kimpton Taconic Hotel", slug: "kimpton-taconic-hotel-manchester", category: "Lodging", town: "Manchester", county: "Bennington County", completenessScore: 47 },
    { name: "Lye Brook Falls Trail", slug: "lye-brook-falls-trail-manchester", category: "Attraction", town: "Manchester", county: "Bennington County", completenessScore: 43 },
    { name: "Manchester Designer Outlets", slug: "manchester-designer-outlets", category: "Shopping", town: "Manchester", county: "Bennington County", completenessScore: 50 },
    { name: "Northshire Bookstore", slug: "northshire-bookstore-manchester", category: "Shopping", town: "Manchester", county: "Bennington County", completenessScore: 53 },
    { name: "Southern Vermont Arts Center", slug: "southern-vermont-arts-center-business", category: "Gallery", town: "Manchester", county: "Bennington County", completenessScore: 52 },
    { name: "The Crooked Ram", slug: "the-crooked-ram-manchester", category: "Restaurant", town: "Manchester", county: "Bennington County", completenessScore: 46 },
    { name: "The Equinox Golf Resort & Spa", slug: "the-equinox-golf-resort-and-spa-manchester", category: "Lodging", town: "Manchester", county: "Bennington County", completenessScore: 46 },
    { name: "Wilburton Inn", slug: "wilburton-inn-manchester", category: "Lodging", town: "Manchester", county: "Bennington County", completenessScore: 48 },
    { name: "Ye Olde Tavern", slug: "ye-olde-tavern-manchester", category: "Restaurant", town: "Manchester", county: "Bennington County", completenessScore: 45 },
  ],
  Newfane: [
    { name: "Fat Crow Restaurant", slug: "fat-crow-restaurant-newfane", category: "Restaurant", town: "Newfane", county: "Windham County", completenessScore: 42 },
    { name: "Four Columns Inn", slug: "four-columns-inn-newfane", category: "Lodging", town: "Newfane", county: "Windham County", completenessScore: 44 },
    { name: "Newfane Cafe & Creamery", slug: "newfane-cafe-and-creamery", category: "Cafe", town: "Newfane", county: "Windham County", completenessScore: 39 },
    { name: "Williamsville Covered Bridge", slug: "williamsville-covered-bridge-newfane", category: "Attraction", town: "Newfane", county: "Windham County", completenessScore: 42 },
  ],
  Putney: [
    { name: "Next Stage Arts", slug: "next-stage-arts-putney", category: "Gallery", town: "Putney", county: "Windham County", completenessScore: 47 },
    { name: "Popolo", slug: "popolo-putney", category: "Restaurant", town: "Putney", county: "Windham County", completenessScore: 53 },
    { name: "Putney Co-op", slug: "putney-coop", category: "Shopping", town: "Putney", county: "Windham County", completenessScore: 46 },
    { name: "Putney Mountain Roastery", slug: "putney-mountain-roastery-business", category: "Cafe", town: "Putney", county: "Windham County", completenessScore: 49 },
    { name: "The Putney Inn", slug: "the-putney-inn", category: "Lodging", town: "Putney", county: "Windham County", completenessScore: 40 },
  ],
  Rockingham: [
    { name: "Bartonsville Covered Bridge", slug: "bartonsville-covered-bridge-rockingham", category: "Attraction", town: "Rockingham", county: "Windham County", completenessScore: 43 },
    { name: "Great Falls Discovery Center", slug: "great-falls-discovery-center-rockingham", category: "Museum", town: "Rockingham", county: "Windham County", completenessScore: 44 },
    { name: "Rockingham Meeting House", slug: "rockingham-meeting-house", category: "Attraction", town: "Rockingham", county: "Windham County", completenessScore: 45 },
  ],
  "Saxtons River": [
    { name: "Main Street Arts", slug: "main-street-arts-saxtons-river", category: "Gallery", town: "Saxtons River", county: "Windham County", completenessScore: 45 },
    { name: "Saxtons River Distillery", slug: "saxtons-river-distillery", category: "Distillery", town: "Saxtons River", county: "Windham County", completenessScore: 53 },
    { name: "Saxtons River Inn", slug: "saxtons-river-inn", category: "Lodging", town: "Saxtons River", county: "Windham County", completenessScore: 38 },
  ],
  Springfield: [
    { name: "Black Rock Steakhouse", slug: "black-rock-steakhouse-springfield", category: "Restaurant", town: "Springfield", county: "Windsor County", completenessScore: 45 },
    { name: "Crown Point Boardroom", slug: "crown-point-boardroom-springfield", category: "Brewery", town: "Springfield", county: "Windsor County", completenessScore: 39 },
    { name: "Hartness House", slug: "hartness-house-springfield", category: "Lodging", town: "Springfield", county: "Windsor County", completenessScore: 46 },
    { name: "Hartness House Planetarium", slug: "hartness-house-planetarium-springfield", category: "Attraction", town: "Springfield", county: "Windsor County", completenessScore: 41 },
    { name: "Springfield Art & Historical Society", slug: "springfield-art-and-historical-society", category: "Museum", town: "Springfield", county: "Windsor County", completenessScore: 42 },
    { name: "Springfield Coffee Co.", slug: "springfield-coffee-co", category: "Cafe", town: "Springfield", county: "Windsor County", completenessScore: 40 },
  ],
  Townshend: [
    { name: "Scott Covered Bridge", slug: "scott-covered-bridge-townshend", category: "Attraction", town: "Townshend", county: "Windham County", completenessScore: 42 },
    { name: "Townshend Dam Recreation Area", slug: "townshend-dam-recreation-area", category: "Attraction", town: "Townshend", county: "Windham County", completenessScore: 40 },
    { name: "Townshend Lake Campground", slug: "townshend-lake-campground", category: "Campground", town: "Townshend", county: "Windham County", completenessScore: 41 },
  ],
  Westminster: [
    { name: "Athens Diner", slug: "athens-diner-westminster", category: "Restaurant", town: "Westminster", county: "Windham County", completenessScore: 41 },
    { name: "Bald Mountain Preserve", slug: "bald-mountain-preserve-westminster", category: "Attraction", town: "Westminster", county: "Windham County", completenessScore: 43 },
    { name: "Kurn Hattin Farm Stand", slug: "kurn-hattin-farm-stand", category: "Farm Stand", town: "Westminster", county: "Windham County", completenessScore: 42 },
    { name: "Westminster West Store", slug: "westminster-west-store", category: "General Store", town: "Westminster", county: "Windham County", completenessScore: 41 },
  ],
  Weston: [
    { name: "The Vermont Country Store", slug: "vermont-country-store-basic", category: "General Store", town: "Weston", county: "Windsor County", completenessScore: 56 },
    { name: "Weston Playhouse", slug: "weston-playhouse", category: "Attraction", town: "Weston", county: "Windsor County", completenessScore: 45 },
    { name: "Weston Village Store", slug: "weston-village-store", category: "General Store", town: "Weston", county: "Windsor County", completenessScore: 40 },
  ],
  Wilmington: [
    { name: "Adams Farm Market", slug: "adams-farm-market-wilmington", category: "Farm Stand", town: "Wilmington", county: "Windham County", completenessScore: 46 },
    { name: "Dot's Restaurant", slug: "dots-restaurant-wilmington", category: "Restaurant", town: "Wilmington", county: "Windham County", completenessScore: 48 },
    { name: "Molly Stark State Park", slug: "molly-stark-state-park-wilmington", category: "Attraction", town: "Wilmington", county: "Windham County", completenessScore: 47 },
    { name: "Molly Stark State Park Campground", slug: "molly-stark-state-park-campground-wilmington", category: "Campground", town: "Wilmington", county: "Windham County", completenessScore: 44 },
    { name: "Mount Olga Fire Tower", slug: "mount-olga-fire-tower-wilmington", category: "Attraction", town: "Wilmington", county: "Windham County", completenessScore: 43 },
    { name: "The Nutmeg Vermont", slug: "the-nutmeg-vermont-wilmington", category: "Lodging", town: "Wilmington", county: "Windham County", completenessScore: 42 },
    { name: "Wilmington Antique Center", slug: "wilmington-antique-center", category: "Shopping", town: "Wilmington", county: "Windham County", completenessScore: 41 },
  ],
};

const seeds = Object.entries(seedsByTown)
  .sort(([left], [right]) => left.localeCompare(right))
  .flatMap(([, townSeeds]) => [...townSeeds].sort((left, right) => left.name.localeCompare(right.name)));

export const basicBusinessListings: BusinessListing[] = seeds.map(createBasicListing);
