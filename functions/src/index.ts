import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { v2 as TranslateV2 } from '@google-cloud/translate';

// Initialize Admin SDK once
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Google Cloud Translation client (v2 simple API)
const translateClient = new TranslateV2.Translate();

// Build a deterministic cache key for a translation request
function buildCacheKey(params: { text: string; source?: string; target: string; domain?: string }) {
  const { text, source = 'auto', target, domain = 'default' } = params;
  // Simple stable key; Firestore doc ID limit is 1500 bytes, we slice to be safe
  const base = `${domain}::${source}::${target}::${text}`;
  // Firestore doc ids cannot contain slashes; use split/join to support older runtimes
  return base.split('/').join('_').slice(0, 1400);
}

export const translateText = functions
  .region('us-central1')
  .https.onCall(async (data, context) => {
    try {
      const textUnknown: unknown = data?.text;
      const targetUnknown: unknown = data?.target;
      const sourceUnknown: unknown = data?.source ?? 'auto';
      const domainUnknown: unknown = data?.domain ?? 'wedding-invitation-platform';

      if (typeof textUnknown !== 'string' || !textUnknown.trim()) {
        throw new functions.https.HttpsError('invalid-argument', 'Expected non-empty "text" string');
      }
      if (typeof targetUnknown !== 'string' || !['en', 'es'].includes(targetUnknown)) {
        throw new functions.https.HttpsError('invalid-argument', 'Expected target to be one of: en, es');
      }
      if (typeof sourceUnknown !== 'string') {
        throw new functions.https.HttpsError('invalid-argument', 'Expected source to be a string');
      }

      const text = textUnknown.trim();
      const target = targetUnknown as 'en' | 'es';
      const source = sourceUnknown as string;
      const domain = typeof domainUnknown === 'string' ? domainUnknown : 'wedding-invitation-platform';

      // Basic abuse protection: require auth for large texts
      if (text.length > 1000 && !context.auth) {
        throw new functions.https.HttpsError('permission-denied', 'Authentication required for large texts');
      }

      const cacheKey = buildCacheKey({ text, source, target, domain });
      const cacheRef = db.collection('translationCache').doc(cacheKey);
      const cachedSnap = await cacheRef.get();
      if (cachedSnap.exists) {
        const cached = cachedSnap.data();
        if (cached?.translation) {
          return { translation: cached.translation as string, source: cached.source, cached: true };
        }
      }

      // Call Google Cloud Translation API (v2)
      const [translated] = await translateClient.translate(text, { to: target, from: source === 'auto' ? undefined : source });

      // Persist to cache (best-effort)
      await cacheRef.set(
        {
          text,
          source,
          target,
          translation: translated,
          domain,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      return { translation: translated, source, cached: false };
    } catch (err: unknown) {
      console.error('translateText error', err);
      if (err instanceof functions.https.HttpsError) throw err;
      const message = err instanceof Error ? err.message : 'Translation failed';
      throw new functions.https.HttpsError('internal', message);
    }
  });

// Export for Firebase Functions
exports.translateText = translateText;
