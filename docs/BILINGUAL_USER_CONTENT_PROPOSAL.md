# Bilingual User Content Enhancement Proposal

## Current State
- ✅ Static UI content is fully translated (English/Spanish)
- ⚠️ User-entered content displays in original language only
- ⚠️ Location names, descriptions, and custom messages are not translated

## Proposed Enhancement: Language-Specific Fields

### 1. Wedding Location Fields
```typescript
interface WeddingLocation {
  // Current fields
  name: string;
  address: string;
  
  // Proposed bilingual fields
  name_en?: string;
  name_es?: string;
  address_en?: string;
  address_es?: string;
}
```

### 2. Wedding Settings Bilingual Fields
```typescript
interface WeddingSettings {
  // Current single-language fields
  rsvpTitle?: string;
  rsvpMessage?: string;
  footerMessage?: string;
  dressCode?: string;
  
  // Proposed bilingual fields
  rsvpTitle_en?: string;
  rsvpTitle_es?: string;
  rsvpMessage_en?: string;
  rsvpMessage_es?: string;
  footerMessage_en?: string;
  footerMessage_es?: string;
  dressCode_en?: string;
  dressCode_es?: string;
  
  // Hotel information
  hotelInfo?: {
    name_en?: string;
    name_es?: string;
    description_en?: string;
    description_es?: string;
    // ... other hotel fields
  }
}
```

### 3. Implementation Strategy

#### Phase 1: Database Schema Update
- Add language-specific fields to Firestore collections
- Maintain backward compatibility with existing single-language fields
- Create migration scripts for existing weddings

#### Phase 2: UI Enhancement
- Update wedding creation/editing forms to include language tabs
- Add language switcher in customization interface
- Implement field-level language validation

#### Phase 3: Display Logic
```tsx
// Helper function to get content in current language
const getLocalizedContent = (
  content: { en?: string; es?: string; default?: string },
  language: Language
): string => {
  return content[language] || content.default || content.en || content.es || '';
};

// Usage in component
<LocationName>
  {getLocalizedContent({
    en: wedding.ceremonyLocation.name_en,
    es: wedding.ceremonyLocation.name_es,
    default: wedding.ceremonyLocation.name
  }, language)}
</LocationName>
```

### 4. User Experience Improvements

#### Wedding Creation Wizard
- Language preference selection at the beginning
- Bilingual content entry with live preview
- Auto-translation suggestions (optional)

#### Content Management
- Bulk content translation tools
- Language completeness indicators
- Preview mode in both languages

### 5. Benefits
- ✅ Fully localized user experience
- ✅ Professional appearance for Mexican/international audiences
- ✅ SEO benefits for bilingual content
- ✅ Accessibility compliance
- ✅ Market expansion opportunities

### 6. Implementation Effort
- **Database**: 2-3 days (schema + migration)
- **Backend**: 3-4 days (service layer updates)
- **Frontend**: 5-7 days (forms + display logic)
- **Testing**: 2-3 days (E2E testing both languages)
- **Total**: ~2-3 weeks for complete implementation

### 7. Alternative: Quick Solution
For immediate needs, implement a translation toggle that shows/hides helper text:

```tsx
{language === 'es' && (
  <TranslationHelper>
    Ingresa el contenido en español para una mejor experiencia
  </TranslationHelper>
)}
```

This would encourage users to enter content in the appropriate language without requiring database changes.
