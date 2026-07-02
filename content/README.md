# SouthernVT Content Folder

This folder holds the editorial source content for the **100 Places Project** — a version-controlled, writer-friendly archive of flagship destination content for SouthernVT.

---

## Purpose

- One Markdown file per Place
- Human-readable, Git-diffable, reviewer-friendly
- Source of truth for editorial copy before it is wired into the CMS or database
- Allows writers and editors to contribute without touching code

---

## File Convention

Files live at `content/places/<slug>.md`.

The frontmatter block at the top of each file maps directly to Place fields in the data layer:

```
---
title:         Human-readable place name
slug:          URL slug (must match the Place record slug)
town:          Vermont town name
placeType:     One of: Waterfall, State Park, Inn, Shop, Downtown, Trail, Overlook, Farmers Market, Mountain
featured:      true | false
season:        Spring | Summer | Fall | Winter | Year-Round
status:        draft | review | published
contentHealth: 0–100 editorial quality estimate
---
```

---

## Content Rules

- **All content must be original.** No copy-paste from other sites, travel blogs, or Wikipedia.
- Write from a field-notes perspective: specific, grounded, useful.
- Avoid superlatives without evidence ("the best waterfall in Vermont").
- Prefer practical, honest visitor guidance over marketing language.
- Photography and drone footage are **optional enhancements**, not launch blockers.

---

## Launch-Ready Minimum

A Place file is considered launch-ready when it has:

| Section | Requirement |
|---|---|
| Frontmatter | All fields filled, `status: review` or `status: published` |
| Story | 2–4 paragraphs, original field-notes voice |
| Why Visit | 3 specific, honest reasons |
| Visitor Tips | Parking, restrooms, dogs, accessibility, difficulty, visit length |
| Photography Tips | Best angle, light window, seasonal notes |
| GPS | Decimal coordinates (lat, lon) |
| Best Time to Visit | Month range with seasonal notes |

Nearby Places, Food, Lodging, and Collections are **recommended** but not required for launch.

---

## 100 Places Project Tracking

Target: 100 flagship Southern Vermont destinations with full editorial coverage.

Current priority: Windham County core destinations, then Bennington and Windsor County expansion.
