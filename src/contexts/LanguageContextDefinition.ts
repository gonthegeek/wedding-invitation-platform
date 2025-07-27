import { createContext } from 'react';
import type { Language, TranslationKeys } from '../types/i18n';

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslationKeys;
  isRTL: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
