# Wedding Invitation Platform

A comprehensive wedding invitation platform built with React TypeScript and Firebase, supporting multiple user roles and customizable wedding invitations. Features include bilingual support (English/Spanish), wedding party management, RSVP analytics, and modern responsive design.

## What's New (August 2025)
- Internationalization
  - Strictly typed TranslationKeys with schema parity across en/es
  - Full i18n for SendInvitationsModal (URLs, email section, actions, placeholders)
  - Wedding Creation Wizard: shell and all steps localized (labels, placeholders, review). Validation messages are being migrated next
  - New i18n maintenance scripts: npm run i18n:unused and npm run i18n:prune
- UX fixes
  - Removed nested layout in RSVP dashboard to avoid duplicate header/sidebar
- Stack updates
  - Upgraded to React 19 and React Router 7
- Theming
  - Global ThemeProvider with light/dark/system modes and shared theme tokens
  - Theme-aware UI across guest management, editors, dashboards, and RSVP
- Optional dynamic translations
  - Firebase Callable + GCP Translate API with local and Firestore caching (see docs/BILINGUAL_SUPPORT_GUIDE.md)

## 🌟 Current Features (Updated: August 2025)

### ✅ **Production-Ready Features**

#### For Administrators
- **Dashboard Overview**: Central management interface for all platform weddings
- **Wedding Analytics**: Platform-wide statistics and performance metrics
- **Content Moderation**: Wedding approval and content oversight capabilities

#### For Couples
- **Wedding Creation Wizard**: Intuitive 4-step guided setup process
- **Custom Invitation Design**: 
  - 13+ beautiful Google Fonts with real-time preview
  - Dynamic color schemes (primary/secondary colors)
  - Background customization (gradients, images, patterns)
  - Section visibility controls for personalized layouts
- **Wedding Party Management**: 
  - Complete CRUD interface for wedding party members
  - Role-based organization (Bridesmaids, Groomsmen, Mexican Padrinos traditions)
  - Professional image upload with Firebase Storage
  - Drag & drop photo functionality with automatic optimization
- **Guest Management**: 
  - Comprehensive guest list management with search and filtering
  - CSV import/export functionality for bulk operations
  - Individual invitation URL generation for easy sharing
  - Customizable WhatsApp/SMS templates with placeholders {firstName} and {url} (persisted in localStorage)
  - Guest status tracking (invited, confirmed, declined)
- **RSVP Analytics Dashboard**: 
  - Real-time response tracking with visual charts
  - Detailed attendance analytics (ceremony/reception breakdown)
  - Dietary restrictions and special requests management
  - Plus-one handling with individual guest details
- **Bilingual Support**:
  - Complete English/Spanish translation system
  - Cultural appropriateness for Mexican wedding traditions
  - Language selector with persistent user preference
  - 240+ translation keys covering all UI elements

## 🚀 Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Firebase (Auth, Firestore, Storage, Functions, Hosting)
- **Styling**: CSS-in-JS with styled-components (ThemeProvider, theme tokens; light/dark/system) + Google Fonts
- **Forms**: React Hook Form with Yup validation
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Development**: ESLint, Prettier, TypeScript
- **Testing**: Jest + React Testing Library (configured)

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project with Authentication, Firestore, and Storage enabled

## 🛠️ Quick Start

### 1. Installation
```bash
# Clone the repository
git clone <repository-url>
cd wedding-invitation-platform

# Install dependencies
npm install

# Install Firebase Functions dependencies
cd functions && npm install && cd ..

# Environment setup
cp .env.example .env
# Fill in your Firebase configuration variables
```

### 2. Development
```bash
# Start development server (Vite hot reload)
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# i18n maintenance
npm run i18n:unused   # list unused translation keys
npm run i18n:prune    # prune unused keys (with backup)
```

### 3. Firebase Setup
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init

# Deploy
firebase deploy
```

## 🏗️ **Implementation Guide for Future Development**

### **System Architecture Overview**

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                       │
├─────────────────────────────────────────────────────────┤
│  Components/     Pages/       Hooks/      Services/     │
│  - Shared UI     - Routes     - Custom    - API Layer   │
│  - Forms         - Auth       - State     - Firebase    │
│  - Modals        - Dashboard  - Effects   - Storage     │
├─────────────────────────────────────────────────────────┤
│              React Router v7 + Context API              │
├─────────────────────────────────────────────────────────┤
│         Styled Components + TypeScript Types            │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                 Firebase Backend                        │
├─────────────────────────────────────────────────────────┤
│  Authentication    Firestore DB     Storage             │
│  - Role-based      - Collections    - Images            │
│  - JWT tokens      - Security Rules - Optimization      │
├─────────────────────────────────────────────────────────┤
│            Cloud Functions (Node.js/TypeScript)         │
│            - Email Service                              │
│            - Image Processing                           │
│            - Analytics                                  │
└─────────────────────────────────────────────────────────┘
```

### **Code Organization Principles**

#### **1. Feature-Based Structure**
```typescript
src/
├── components/
│   ├── guest/          # Guest management components
│   ├── rsvp/           # RSVP system components  
│   ├── shared/         # Reusable UI components
│   └── wedding/        # Wedding creation/management
├── hooks/              # Custom React hooks for business logic
├── services/           # Firebase API layer & business logic
├── types/              # TypeScript type definitions
└── utils/              # Pure utility functions
```

#### **2. Service Layer Pattern**
Each major feature has a dedicated service class:

```typescript
// Example: weddingService.ts
export class WeddingService {
  private static COLLECTION = 'weddings';
  
  static async createWedding(data: WeddingData): Promise<string> {
    // Centralized business logic
  }
  
  static async updateWedding(id: string, updates: Partial<Wedding>): Promise<void> {
    // With proper error handling
  }
}
```

#### **3. Custom Hooks Pattern**
Business logic separated from UI components:

```typescript
// Example: useWedding.ts
export const useWedding = () => {
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Centralized state management
  const updateWedding = useCallback(async (updates: Partial<Wedding>) => {
    if (!wedding) return;
    await WeddingService.updateWedding(wedding.id, updates);
    setWedding(prev => prev ? { ...prev, ...updates } : null);
  }, [wedding]);
  
  return { wedding, loading, updateWedding };
};
```

#### **4. Type-First Development**
Comprehensive TypeScript definitions:

```typescript
// types/index.ts
export interface Wedding {
  id: string;
  coupleId: string;
  brideFirstName: string;
  groomFirstName: string;
  weddingDate: Date;
  ceremoneyLocation: WeddingLocation;
  receptionLocation: WeddingLocation;
  settings: WeddingSettings;
  // ... all properties strictly typed
}
```

### **Adding New Features - Step-by-Step Guide**

#### **1. New Component Pattern**
```typescript
// components/feature/NewComponent.tsx
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from '../../hooks/useLanguage';

interface NewComponentProps {
  title: string;
  onAction: () => void;
}

const Container = styled.div`
  padding: var(--spacing-md);
`;

export const NewComponent: React.FC<NewComponentProps> = ({ 
  title, 
  onAction 
}) => {
  const t = useTranslation();
  
  return (
    <Container>
      <h2>{title}</h2>
      <button onClick={onAction}>
        {t.common.refresh}
      </button>
    </Container>
  );
};
```

#### **2. New Service Implementation**
```typescript
// services/newFeatureService.ts
import { collection, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { NewFeature } from '../types';

export class NewFeatureService {
  private static readonly COLLECTION = 'newFeatures';
  
  static async create(data: Omit<NewFeature, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTION), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating new feature:', error);
      throw new Error('Failed to create new feature');
    }
  }
  
  // Additional CRUD methods...
}
```

#### **3. Translation Keys**
```typescript
// locales/en.ts & locales/es.ts
export const translations = {
  // ... existing translations
  newFeature: {
    title: 'New Feature',
    description: 'Feature description',
    actions: {
      save: 'Save',
      cancel: 'Cancel'
    }
  }
};
```

### **Firebase Implementation Details**

#### **1. Data Modeling Strategy**
```typescript
// Normalized data structure
Collections:
├── users/              # User profiles and roles
├── weddings/           # Main wedding documents
├── guests/             # Guest information linked to weddings
├── rsvps/              # RSVP responses with analytics data
└── weddingParty/       # Wedding party members
```

#### **2. Security Rules Structure**
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Wedding documents - role-based access
    match /weddings/{weddingId} {
      allow read: if true; // Public read for guest invitations
      allow create, update: if request.auth != null && 
        (resource.data.coupleId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### **Performance Optimization Strategies**

#### **1. Code Splitting & Lazy Loading**
```typescript
// Route-based code splitting
const CoupleDashboard = lazy(() => import('./pages/CoupleDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

<Suspense fallback={<div>Loading...</div>}>
  <CoupleDashboard />
</Suspense>
```

### **Internationalization (i18n) Implementation**

#### Translation System Architecture
```typescript
// use in components
import { useTranslation } from '../hooks/useLanguage';

const t = useTranslation();
return <h1>{t.nav.platformTitle}</h1>;
```

- Strict TypeScript typing via `TranslationKeys` prevents missing/mistyped keys
- Analyzer scripts help keep locales healthy:
  - `npm run i18n:unused` to list unused keys
  - `npm run i18n:prune` to safely prune unused keys
- Optional dynamic translations at runtime via Firebase Callable + GCP Translate with local/Firestore caching. See BILINGUAL_SUPPORT_GUIDE.md

## 📂 **Current Project Structure**

```
wedding-invitation-platform/
├── 📁 src/                                    # Source code
│   ├── 📁 components/                         # React components by feature
│   │   ├── 📁 guest/                         # Guest management & display
│   │   │   ├── AddGuestModal.tsx             # Guest creation form
│   │   │   ├── EditGuestModal.tsx            # Guest editing interface
│   │   │   ├── DeletedGuestsModal.tsx        # Soft-deleted guests management
│   │   │   ├── GuestImportExport.tsx         # CSV import/export functionality
│   │   │   ├── GuestManagementSection.tsx    # Main guest CRUD interface
│   │   │   ├── SendInvitationsModal.tsx      # Bulk invitation sending
│   │   │   └── WeddingPartyDisplay.tsx       # Public wedding party showcase
│   │   ├── 📁 rsvp/                          # RSVP system components
│   │   │   ├── EnhancedRSVPForm.tsx          # Comprehensive RSVP form
│   │   │   ├── RSVPDashboard.tsx             # Analytics dashboard
│   │   │   └── DetailedRSVPResponses.tsx     # Response management interface
│   │   ├── 📁 shared/                        # Reusable UI components
│   │   │   ├── FloatingLanguageSelector.tsx  # Language switching widget
│   │   │   ├── GalleryUpload.tsx             # Multi-image upload component
│   │   │   ├── Header.tsx                    # Navigation header
│   │   │   ├── ImageUpload.tsx               # Single image upload
│   │   │   ├── LanguageSelector.tsx          # Language selection dropdown
│   │   │   ├── Layout.tsx                    # Main layout wrapper
│   │   │   ├── Modal.tsx                     # Reusable modal component
│   │   │   ├── NavigationSidebar.tsx         # Role-based navigation
│   │   │   └── ProtectedRoute.tsx            # Authentication guard
│   │   └── 📁 wedding/                       # Wedding management
│   │       ├── WeddingCreationWizard.tsx     # Multi-step creation wizard
│   │       ├── WeddingDetailsEditor.tsx      # Invitation customization
│   │       ├── WeddingPartyManagement.tsx    # Wedding party CRUD
│   │       └── 📁 steps/                     # Wizard step components
│   │           ├── BasicInfoStep.tsx         # Step 1: Basic information
│   │           ├── DetailsStep.tsx           # Step 2: Event details
│   │           ├── DesignStep.tsx            # Step 3: Design customization
│   │           ├── ReviewStep.tsx            # Step 4: Review & submit
│   │           └── index.ts                  # Step exports
│   ├── 📁 contexts/                          # React contexts
│   │   ├── AuthContext.tsx                   # Authentication state
│   │   ├── LanguageContext.tsx               # i18n state management
│   │   └── LanguageContextDefinition.ts     # Language type definitions
│   ├── 📁 hooks/                             # Custom React hooks
│   │   ├── useAuth.ts                        # Authentication logic
│   │   ├── useGuest.ts                       # Guest operations
│   │   ├── useLanguage.ts                    # Language switching
│   │   ├── useRSVPAnalytics.ts              # RSVP analytics data
│   │   └── useWedding.ts                     # Wedding data management
│   ├── 📁 locales/                           # Internationalization
│   │   ├── en.ts                             # English translations (240+ keys)
│   │   └── es.ts                             # Spanish translations (complete)
│   ├── 📁 pages/                             # Route components
│   │   ├── AdminDashboard.tsx                # Admin main interface
│   │   ├── AdminRoutes.tsx                   # Admin routing configuration
│   │   ├── CoupleDashboard.tsx               # Couple main dashboard
│   │   ├── CoupleRoutes.tsx                  # Couple routing configuration
│   │   ├── CreateWeddingPage.tsx             # Wedding creation entry point
│   │   ├── CustomizeInvitationPage.tsx       # Invitation design interface
│   │   ├── GuestInvitation.tsx               # Guest-specific invitation view
│   │   ├── GuestManagementPage.tsx           # Comprehensive guest management
│   │   ├── LoginPage.tsx                     # User authentication
│   │   ├── NotFoundPage.tsx                  # 404 error page
│   │   ├── PublicWeddingInvitation.tsx       # Main public invitation
│   │   ├── RegisterPage.tsx                  # User registration
│   │   ├── RSVPPage.tsx                      # Guest RSVP interface
│   │   ├── UnauthorizedPage.tsx              # 403 error page
│   │   ├── WeddingDetailsPage.tsx            # Wedding information editing
│   │   ├── WeddingManagementPage.tsx         # Wedding overview dashboard
│   │   └── index.ts                          # Page exports
│   ├── 📁 services/                          # Firebase API layer
│   │   ├── emailService.ts                   # Email automation
│   │   ├── firebase.ts                       # Firebase configuration
│   │   ├── guestImportExportService.ts       # CSV import/export logic
│   │   ├── guestService.ts                   # Guest CRUD operations
│   │   ├── rsvpAnalyticsService.ts           # RSVP tracking & analytics
│   │   ├── storageService.ts                 # Image upload & management
│   │   ├── weddingPartyService.ts            # Wedding party operations
│   │   └── weddingService.ts                 # Wedding CRUD operations
│   ├── 📁 styles/                            # Global styling
│   │   └── global.css                        # CSS variables & base styles
│   ├── 📁 types/                             # TypeScript definitions
│   │   ├── guest.ts                          # Guest-related types
│   │   ├── i18n.ts                           # Translation types
│   │   └── index.ts                          # Main type exports
│   ├── 📁 utils/                             # Utility functions
│   │   ├── i18nUtils.ts                      # Translation helpers
│   │   ├── inviteCodeGenerator.ts            # Unique code generation
│   │   └── index.ts                          # Utility exports
│   ├── App.tsx                               # Main application component
│   ├── main.tsx                              # Application entry point
│   ├── index.css                             # Base CSS imports
│   └── vite-env.d.ts                         # Vite type definitions
├── 📁 functions/                             # Firebase Cloud Functions
│   ├── 📁 src/
│   │   └── index.ts                          # Function definitions
│   ├── package.json                          # Functions dependencies
│   └── tsconfig.json                         # Functions TypeScript config
├── 📁 docs/                                  # Documentation
│   ├── BILINGUAL_SUPPORT_GUIDE.md            # i18n implementation guide
│   ├── EMAIL_SERVICE_SETUP.md                # Email configuration guide
│   ├── FUTURE_IMPROVEMENTS.md                # Development roadmap
│   ├── GITHUB_ACTIONS_SETUP.md               # CI/CD configuration
│   └── INVITATION_METHODS.md                 # Invitation sending methods
├── 📁 public/                                # Static assets
│   └── vite.svg                              # Default Vite icon
├── 📁 .github/                               # GitHub configuration
│   └── copilot-instructions.md               # AI assistant guidelines
├── .env.example                              # Environment template
├── .env.development                          # Development environment
├── .env.production                           # Production environment
├── .gitignore                                # Git ignore rules
├── .prettierrc                               # Code formatting config
├── eslint.config.js                          # Code linting configuration
├── firebase.json                             # Firebase project config
├── firestore.indexes.json                    # Database index definitions
├── firestore.rules                           # Database security rules
├── storage.rules                             # Storage security rules
├── package.json                              # Dependencies & scripts
├── tsconfig.app.json                         # App TypeScript config
├── tsconfig.json                             # Root TypeScript config
├── tsconfig.node.json                        # Node TypeScript config
├── vite.config.ts                            # Vite build configuration
└── README.md                                 # This documentation
```

## 📈 **Project Status & Development Roadmap**

### 🎉 **PRODUCTION READY - Current Status (August 2025)**

#### ✅ **Phase 1: Foundation** - **COMPLETED**
- React + TypeScript + Vite setup with hot reload
- Firebase integration (Auth, Firestore, Storage, Functions)
- Authentication system with role-based access (Admin/Couple/Guest)
- ESLint + Prettier + TypeScript strict configuration
- Responsive design foundation with styled-components
- Routing with React Router v7

#### ✅ **Phase 2: Core Wedding Features** - **COMPLETED**
- Multi-step wedding creation wizard (4 steps)
- Comprehensive wedding details editor with live preview
- Dynamic invitation design system with Google Fonts
- Advanced color scheme customization (primary/secondary)
- Background customization (gradients, images, patterns)
- Section visibility controls for personalized layouts

#### ✅ **Phase 3A: Guest Management** - **COMPLETED**
- Complete guest CRUD operations with search and filtering
- CSV import/export functionality for bulk operations
- Individual invitation URL generation and sharing
- Guest status tracking (invited, confirmed, declined)
- Soft delete system with recovery capabilities

#### ✅ **Phase 3B: Enhanced RSVP System** - **COMPLETED**
- Comprehensive RSVP form with validation and error handling
- Advanced guest information collection (dietary restrictions, allergies)
- Plus-one management with individual guest details
- Real-time RSVP analytics dashboard with visual charts
- Response tracking and attendance rate calculations

#### ✅ **Phase 3C: Wedding Party Management** - **COMPLETED**
- Complete wedding party CRUD interface with role management
- Role-based organization (Bridesmaids, Groomsmen, Mexican Padrinos)
- Professional image upload with Firebase Storage integration
- Automatic image compression and optimization
- Responsive wedding party display in public invitations

#### ✅ **Phase 3D: Internationalization** - **COMPLETED / CONTINUOUS**
- Complete bilingual support (English/Spanish)
- 240+ translation keys covering all UI elements
- Typed i18n with schema parity and maintenance scripts
- Ongoing: migrate remaining validation strings to i18n

---

### 🚀 **NEXT DEVELOPMENT PHASES**

#### 🔄 **Phase 4: Communication & Automation** - **IN PROGRESS**
- Email service configuration and basic templates
- SMTP integration with secure credential management
- Automated RSVP reminder system
- Thank you email automation after RSVP submission
- Wedding day countdown emails
- SMS notifications for critical updates (Optional)

#### 📋 **Phase 5: Advanced Features** - **PLANNED (Q3-Q4 2025)**
- Multiple invitation template system
- Advanced photo gallery with albums
- Gift registry integration
- Wedding timeline/itinerary management
- QR code generation for quick invitation access

#### 🔧 **Phase 6: Production Optimization** - **PLANNED (Q1 2026)**
- Advanced SEO implementation
- Comprehensive testing suite
- Performance monitoring and analytics
- CDN integration for global image delivery

#### 🌟 **Phase 7: Advanced Platform Features** - **FUTURE (2026)**
- Multi-event support
- Real-time collaboration for couples
- Advanced analytics dashboard
- API development for third-party integrations

---

## 🔧 Troubleshooting & Common Issues

### Firebase Connection Issues
```bash
# Check Firebase configuration
npm run dev

# Reset Firebase CLI
firebase logout
firebase login

# Check Firestore rules
firebase firestore:rules:get
```

### TypeScript Errors
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
npm run type-check
```

### Build Issues
```bash
# Clear build cache
rm -rf dist/
npm run build

# Verify all imports are correct
npm run lint
```

## 📚 Documentation

### Development Process
1. **Feature Branch Workflow**:
   ```bash
   git checkout -b feature/new-feature-name
   git commit -m "feat: add new feature description"
   git push origin feature/new-feature-name
   ```

2. **Code Style & Standards**:
   - TypeScript strict mode
   - ESLint + Prettier
   - Conventional commits

3. **Testing Requirements**:
   - Render tests for components
   - Unit tests for services
   - Integration tests for critical flows

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, create an issue in this repository or contact the development team.

---

**Made with ❤️ for creating beautiful wedding memories**

*Last Updated: August 2025*
