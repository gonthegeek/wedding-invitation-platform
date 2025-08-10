import React from 'react';
import styled from 'styled-components';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import type { Language } from '../../types/i18n';

const LanguageSelectorContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const LanguageButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 9999px;
  color: ${(p) => p.theme.colors.textPrimary};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);

  &:hover {
    background: ${(p) => p.theme.colors.surfaceAlt};
  }

  svg { color: ${(p) => p.theme.colors.textSecondary}; }
`;

const LanguageDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  z-index: 1000;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
`;

const LanguageOption = styled.button<{ $isSelected: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  border: none;
  background: ${(p) => (p.$isSelected ? p.theme.colors.surfaceAlt : 'transparent')};
  color: ${(p) => (p.$isSelected ? p.theme.colors.primary : p.theme.colors.textPrimary)};
  font-weight: ${(p) => (p.$isSelected ? 600 : 400)};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(p) => p.theme.colors.surfaceAlt};
    color: ${(p) => p.theme.colors.primary};
  }

  &:first-child { border-radius: 0.5rem 0.5rem 0 0; }
  &:last-child { border-radius: 0 0 0.5rem 0.5rem; }
`;

const FlagEmoji = styled.span`
  margin-right: 0.25rem;
  font-size: 1.05em;
`;

interface LanguageSelectorProps {
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  className
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);

  const languages: Array<{ code: Language; name: string; flag: string }> = [
    { code: 'en', name: t.language.english, flag: '🇺🇸' },
    { code: 'es', name: t.language.spanish, flag: '🇲🇽' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  const handleClickOutside = React.useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('[data-language-selector]')) {
      setIsOpen(false);
    }
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen, handleClickOutside]);

  return (
    <LanguageSelectorContainer className={className} data-language-selector>
      <LanguageButton
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t.language.selectLanguage}
        title={t.language.selectLanguage}
      >
        <Globe size={16} />
        <FlagEmoji>{currentLanguage?.flag}</FlagEmoji>
        {currentLanguage?.name}
      </LanguageButton>
      
      <LanguageDropdown $isOpen={isOpen}>
        {languages.map((lang) => (
          <LanguageOption
            key={lang.code}
            $isSelected={language === lang.code}
            onClick={() => handleLanguageChange(lang.code)}
          >
            <FlagEmoji>{lang.flag}</FlagEmoji>
            {lang.name}
          </LanguageOption>
        ))}
      </LanguageDropdown>
    </LanguageSelectorContainer>
  );
};
