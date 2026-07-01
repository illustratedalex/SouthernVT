# Analytics

This project supports both Vercel Analytics and Microsoft Clarity.

## Vercel Analytics

Vercel Analytics is wired in `app/layout.tsx` using `@vercel/analytics/next` and remains enabled.

## Microsoft Clarity

Microsoft Clarity is wired in `app/layout.tsx` through `components/analytics/MicrosoftClarity.tsx`.

- If `NEXT_PUBLIC_CLARITY_PROJECT_ID` is not set, no Clarity script is injected.
- If it is set, the Clarity script loads on the client after hydration.

## Configuration

Set your Clarity project ID in environment variables:

```bash
NEXT_PUBLIC_CLARITY_PROJECT_ID=your-clarity-project-id
```

Use `.env.local` for local development and configure the same variable in your deployment environment.

`.env.example` includes this variable as a template.

## Verifying tracking

1. Add `NEXT_PUBLIC_CLARITY_PROJECT_ID` to `.env.local`.
2. Start the app and load any page.
3. Open browser DevTools and check that a request/script to `https://www.clarity.ms/tag/` is present.
4. Confirm sessions/heatmaps appear in the Microsoft Clarity dashboard.
