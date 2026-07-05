# Google Analytics 4 (GA4)

Compass supports Google Analytics 4 in addition to existing Vercel Analytics and Microsoft Clarity.

## Measurement ID

Use your GA4 Measurement ID from Google Analytics, formatted like:

`G-XXXXXXXXXX`

## Environment variable

Set this variable in your environment:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

If this variable is not set, GA4 is not loaded.

## Verification

1. Start the app and open a public page.
2. In browser DevTools, confirm requests to `googletagmanager.com/gtag/js`.
3. In GA4 Realtime, confirm your visit appears.
4. Navigate between routes and confirm visits continue to appear in Realtime.

## Notes

- GA4 is injected once from `app/layout.tsx` through `components/analytics/GoogleAnalytics.tsx`.
- This setup avoids duplicate script injection.
- Vercel Analytics and Microsoft Clarity remain enabled.
