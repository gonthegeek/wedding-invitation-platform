# Translation on Free Tier

This project uses Google Cloud Translation API via a Firebase Callable Function with aggressive caching to keep usage within free tiers.

How we minimize costs:
- LocalStorage cache in the browser (7-day TTL, configurable)
- Firestore cache in Cloud Functions (deduplicates across users)
- Only translate when current language differs from detected/original
- Batch helper available to reduce round-trips

Operational tips:
- Prefer static translations for UI (locales). Use dynamic translation only for user-generated content.
- Pre-translate frequently viewed content to warm the cache.
- Monitor translation traffic in GCP and Firestore reads/writes.
