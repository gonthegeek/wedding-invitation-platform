import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Language } from '../types/i18n';
import { englishTranslations } from '../locales/en';
import { spanishTranslations } from '../locales/es';
import { LanguageContext } from './LanguageContextDefinition';
import type { LanguageContextType } from './LanguageContextDefinition';

const translations = {
  en: englishTranslations,
  es: spanishTranslations,
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Get initial language from localStorage or default to English
  const getInitialLanguage = (): Language => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('wedding-platform-language') as Language;
      if (stored && ['en', 'es'].includes(stored)) {
        return stored;
      }
      
      // Detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('es')) {
        return 'es';
      }
    }
    return 'en';
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage());

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('wedding-platform-language', newLanguage);
      // Update document language attribute
      document.documentElement.lang = newLanguage;
    }
  };

  useEffect(() => {
    // Set initial document language
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    isRTL: false, // Neither English nor Spanish is RTL
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
