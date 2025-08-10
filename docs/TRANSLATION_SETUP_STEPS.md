# Dynamic Translation Setup (Google Cloud Translation + Firebase)

Follow these steps to enable dynamic translation of user-provided content, with caching to stay in free tiers.

Prerequisites:
- Firebase project already initialized (Auth, Firestore, Functions)
- You have the Firebase CLI installed and logged in

Steps:
1) Enable Cloud Functions and install dependencies
   - In the project root:
     - npm install (if not already)
   - In the functions directory:
     - cd functions
     - npm install
     - npm install @google-cloud/translate
     - cd ..

2) Enable Google Cloud Translation API in your Firebase project
   - Go to Google Cloud Console: https://console.cloud.google.com/apis/library
   - Ensure you are in the Firebase project's GCP project (matches your projectId)
   - Search for "Cloud Translation API" and click Enable
   - No API key is required on the server when using service account (default for Firebase Functions)

   Optional: Set quotas / budgets to keep free-tier usage
   - Billing -> Budgets & alerts: create a small budget with alerts
   - Quotas: locate Cloud Translation quotas and set appropriate limits

3) Deploy the Cloud Function
   - From the project root:
     - npm run functions:deploy
   - Or deploy everything:
     - firebase deploy --only functions

4) Update Firebase Functions region (optional)
   - Code uses us-central1. If your project uses a different region, update both:
     - functions/src/index.ts (functions.region)
     - src/services/firebase.ts (getFunctions(app, 'us-central1'))

5) Client-side configuration
   - Nothing additional required. The app calls callable function 'translateText'.
   - Local cache uses LocalStorage with 7-day TTL to minimize calls.

6) Using Firebase Extension instead (alternative)
   - If you prefer the Firebase Extension "Translate Text" (by Google):
     - In Firebase Console -> Extensions -> Install "Translate Text"
     - Choose source collection (e.g., translationRequests) and output collection (e.g., translationResults)
     - Update security rules accordingly
     - Replace the callable usage with Firestore writes and listeners
   - The current implementation already uses Google Cloud Translation directly, which is simpler.

7) Security rules (Firestore cache)
   - The function writes to collection 'translationCache'. No client writes are needed.
   - If you want clients to read cache directly, add a rule to allow read of that collection. By default clients do not access it.

8) Testing locally
   - Run npm run functions:serve to start emulators
   - Start web app with npm run dev
   - Test translating a custom message in the invitation settings and switch languages

9) Cost control best practices
   - Prefer static locale files for UI
   - Cache aggressively (already implemented)
   - Avoid translating very long texts; enforce limits in UI
   - Pre-translate popular content (load once in admin dashboard)
