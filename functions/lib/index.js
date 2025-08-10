"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateText = void 0;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions"));
const translate_1 = require("@google-cloud/translate");
// Initialize Admin SDK once
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
// Google Cloud Translation client (v2 simple API)
const translateClient = new translate_1.v2.Translate();
// Build a deterministic cache key for a translation request
function buildCacheKey(params) {
    const { text, source = 'auto', target, domain = 'default' } = params;
    // Simple stable key; Firestore doc ID limit is 1500 bytes, we slice to be safe
    const base = `${domain}::${source}::${target}::${text}`;
    // Firestore doc ids cannot contain slashes; use split/join to support older runtimes
    return base.split('/').join('_').slice(0, 1400);
}
exports.translateText = functions
    .region('us-central1')
    .https.onCall(async (data, context) => {
    var _a, _b;
    try {
        const textUnknown = data === null || data === void 0 ? void 0 : data.text;
        const targetUnknown = data === null || data === void 0 ? void 0 : data.target;
        const sourceUnknown = (_a = data === null || data === void 0 ? void 0 : data.source) !== null && _a !== void 0 ? _a : 'auto';
        const domainUnknown = (_b = data === null || data === void 0 ? void 0 : data.domain) !== null && _b !== void 0 ? _b : 'wedding-invitation-platform';
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
        const target = targetUnknown;
        const source = sourceUnknown;
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
            if (cached === null || cached === void 0 ? void 0 : cached.translation) {
                return { translation: cached.translation, source: cached.source, cached: true };
            }
        }
        // Call Google Cloud Translation API (v2)
        const [translated] = await translateClient.translate(text, { to: target, from: source === 'auto' ? undefined : source });
        // Persist to cache (best-effort)
        await cacheRef.set({
            text,
            source,
            target,
            translation: translated,
            domain,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
        return { translation: translated, source, cached: false };
    }
    catch (err) {
        console.error('translateText error', err);
        if (err instanceof functions.https.HttpsError)
            throw err;
        const message = err instanceof Error ? err.message : 'Translation failed';
        throw new functions.https.HttpsError('internal', message);
    }
});
// Export for Firebase Functions
exports.translateText = exports.translateText;
//# sourceMappingURL=index.js.map