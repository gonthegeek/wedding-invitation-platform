import { useLanguage } from './useLanguage';
import { useCallback } from 'react';
import { translateDynamic } from '../services/translationService';

// Hook to translate dynamic strings while respecting current language
export function useDynamicTranslation(domain?: string) {
  const { language } = useLanguage();

  const tDyn = useCallback(
    async (text: string, opts?: { source?: 'en' | 'es' | 'auto'; ttlMs?: number }) => {
      return translateDynamic(text, {
        source: opts?.source ?? 'auto',
        target: language,
        domain,
        ttlMs: opts?.ttlMs,
      });
    },
    [language, domain]
  );

  return { tDyn };
}
