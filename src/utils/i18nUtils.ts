import type { Language } from '../types/i18n';
import { englishTranslations } from '../locales/en';
import { spanishTranslations } from '../locales/es';

// Helper function to format dates according to language
export const formatDate = (date: Date, language: Language, options?: Intl.DateTimeFormatOptions): string => {
  const locale = language === 'es' ? 'es-MX' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(date);
};

// Helper function to format times according to language
export const formatTime = (time: string, language: Language): string => {
  try {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    
    const locale = language === 'es' ? 'es-MX' : 'en-US';
    return new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return time; // Return original if parsing fails
  }
};

// Helper function to get month name
export const getMonthName = (monthIndex: number, language: Language, short: boolean = false): string => {
  const translations = language === 'es' ? spanishTranslations : englishTranslations;
  const months = short ? translations.date.monthsShort : translations.date.months;
  return months[monthIndex] || '';
};

// Helper function to get day name
export const getDayName = (dayIndex: number, language: Language, short: boolean = false): string => {
  const translations = language === 'es' ? spanishTranslations : englishTranslations;
  const days = short ? translations.date.daysShort : translations.date.days;
  return days[dayIndex] || '';
};
