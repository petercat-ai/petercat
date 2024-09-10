import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://25cd1bf180d345e9c926589cd0ca0353@o4507910955597824.ingest.us.sentry.io/4507910957432832",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
