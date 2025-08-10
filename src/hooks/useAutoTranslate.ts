import { useEffect, useState } from 'react';
import { useLanguage } from './useLanguage';
import { translateDynamic } from '../services/translationService';

interface Options {
  source?: 'en' | 'es' | 'auto';
  domain?: string;
  ttlMs?: number;
}

export function useAutoTranslate(input: string | undefined | null, options?: Options) {
  const { language } = useLanguage();
  const [text, setText] = useState<string>(input ?? '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const original = input ?? '';
      setText(original);
      if (!original) return;
      setLoading(true);
      try {
        const translated = await translateDynamic(original, {
          source: options?.source ?? 'auto',
          target: language,
          domain: options?.domain,
          ttlMs: options?.ttlMs,
        });
        if (!cancelled) setText(translated);
      } catch {
        // fall back to original text
        if (!cancelled) setText(original);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [input, language, options?.domain, options?.source, options?.ttlMs]);

  return { text, loading };
}
