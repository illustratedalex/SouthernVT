# QA Checklist

## Public Routes
- `/`
- `/places`
- `/collections`
- `/guides`
- `/events`
- `/deals`
- `/map`
- `/planner`
- `/passport`
- `/partner-portal`

## Basecamp Routes
- `/basecamp`
- `/basecamp/places`
- `/basecamp/collections`
- `/basecamp/articles`
- `/basecamp/events`
- `/basecamp/deals`
- `/basecamp/media`
- `/basecamp/reviews`
- `/basecamp/passport`
- `/basecamp/analytics`
- `/basecamp/activity`
- `/basecamp/settings/features`

## Mobile Checklist
- Verify headers do not wrap awkwardly.
- Verify tables scroll horizontally instead of overflowing.
- Verify drawers and side panels fit within the viewport.
- Verify primary actions remain reachable without horizontal scrolling.
- Verify empty states and filters stack cleanly.

## Build Checklist
- Run `npm.cmd run build`.
- Confirm TypeScript passes.
- Confirm static generation completes.

## Pre-Release Checklist
- Scan the public nav and Basecamp nav for stale links.
- Check empty states, loading states, and error states on key surfaces.
- Confirm accessibility labels on icon-only controls.
- Do a quick mobile pass on public and Basecamp pages.