# Search and Discovery Readiness

Last updated: 2026-07-05

## Scope completed

- Homepage search
- Header command palette search
- New public `/search` route
- `/businesses` filters
- Concierge entry points and "Plan a trip" CTA

## Search coverage

The public search experience now includes:

- Places
- Businesses
- Stays
- Guides
- Collections
- Events

Search result labels shown to visitors:

- Place
- Business
- Stay
- Guide
- Collection
- Event

## Empty and no-results states

- Empty state suggestions:
  - Waterfalls
  - Stays
  - Restaurants
  - Bellows Falls
  - Manchester
  - Family friendly
  - Rainy day
- No-results state copy:
  - "No results yet. Try a broader search or suggest a place."
- No-results CTA:
  - `Suggest a Place` (links to `/feedback?category=Missing%20Place`)

## Routes checked

- `/` homepage hero search now submits to `/search`
- Header command palette uses public content index (not Basecamp actions)
- `/search` added and public (no 404)
- `/businesses` filter options updated to launch requirements
- Concierge entry points remain public and coherent (`/concierge`)

## Business filter updates

Required business filters are now present:

- Lodging
- Restaurant
- Cafe
- Brewery
- Shopping
- Gallery
- Campground
- Attraction
- Services
- Stays

Filter behavior:

- **Stays** includes lodging-related categories (Lodging, Campground, Inn, Motel, Bed & Breakfast, Cabin, Vacation Rental, Unique Stay).
- **Services** includes service-oriented categories (Bakery, Distillery, Farm Stand, General Store, Museum, Outdoor Recreation, Winery).

## Notes

- Search implementation is backed by the current local/public repository data model.
- No public mock or internal-only labels are shown in visitor-facing UI.
