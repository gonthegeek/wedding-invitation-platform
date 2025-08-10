import { httpsCallable, type HttpsCallableResult } from 'firebase/functions';
import { functions } from './firebase';

// Local Storage cache to minimize calls and work on free tier
const LOCAL_CACHE_PREFIX = 'translation-cache-v1';

interface TranslateOptions {
  source?: 'en' | 'es' | 'auto';
  target: 'en' | 'es';
  domain?: string; // optional namespace, e.g., 'wedding-details'
  ttlMs?: number; // local cache TTL
}

function buildLocalKey(text: string, opts: TranslateOptions) {
  const source = opts.source ?? 'auto';
  const domain = opts.domain ?? 'default';
  const target = opts.target;
  const key = `${LOCAL_CACHE_PREFIX}::${domain}::${source}::${target}::${text}`;
  return key.slice(0, 1900);
}

function getLocal(text: string, opts: TranslateOptions) {
  if (typeof window === 'undefined') return null;
  try {
    const key = buildLocalKey(text, opts);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { v: string; ts: number } | null;
    if (!parsed) return null;
    const ttl = opts.ttlMs ?? 1000 * 60 * 60 * 24 * 7; // 7 days
    if (Date.now() - parsed.ts > ttl) return null;
    return parsed.v;
  } catch {
    return null;
  }
}

function setLocal(text: string, opts: TranslateOptions, value: string) {
  if (typeof window === 'undefined') return;
  try {
    const key = buildLocalKey(text, opts);
    localStorage.setItem(key, JSON.stringify({ v: value, ts: Date.now() }));
  } catch {
    // ignore quota errors
  }
}

const translateFn = httpsCallable<
  { text: string; source?: string; target: string; domain?: string },
  { translation: string }
>(functions, 'translateText');

export async function translateDynamic(text: string, opts: TranslateOptions): Promise<string> {
  const trimmed = text?.trim();
  if (!trimmed) return '';

  // 1) Local cache first
  const cached = getLocal(trimmed, opts);
  if (cached) return cached;

  // 2) If target equals source explicitly, return as-is
  if (opts.source && opts.source === opts.target) return trimmed;

  // 3) Call backend function (which has Firestore cache as well)
  const res: HttpsCallableResult<{ translation: string }> = await translateFn({
    text: trimmed,
    source: opts.source,
    target: opts.target,
    domain: opts.domain,
  });
  const translated = res.data?.translation;
  if (translated) setLocal(trimmed, opts, translated);
  return translated ?? trimmed;
}

// Batch translation helper to reduce round trips
export async function translateBatch(texts: string[], opts: TranslateOptions): Promise<string[]> {
  const results: string[] = [];
  for (const t of texts) {
    results.push(await translateDynamic(t, opts));
  }
  return results;
}
