import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContextDefinition';
import type { LanguageContextType } from '../contexts/LanguageContextDefinition';

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Helper hook for getting specific translation sections
export const useTranslation = () => {
  const { t } = useLanguage();
  return t;
};
