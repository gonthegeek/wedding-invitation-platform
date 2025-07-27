# Wedding Invitation Platform

A comprehensive wedding invitation platform built with React TypeScript and Firebase, supporting multiple user roles and customizable wedding invitations with modern features like wedding party management, image uploads, and custom fonts.

## 🌟 Current Features (Updated: July 2025)

### ✅ **Completed Features**

#### For Administrators
- **Multi-tenant Management**: Manage multiple weddings on the platform
- **User Management**: Oversee couples and guest accounts
- **Wedding Analytics**: Track wedding invitations and RSVP responses
- **Content Moderation**: Review and approve wedding content

#### For Couples
- **Wedding Creation Wizard**: Step-by-step wedding setup process
- **Custom Invitation Design**: 
  - Personalized color schemes (primary/secondary colors)
  - 13+ beautiful font options (serif, sans-serif, script fonts)
  - Background customization (gradient/image backgrounds)
  - Section visibility controls
- **Wedding Party Management**: 
  - Add/edit/delete wedding party members
  - Role-based organization (Bridesmaids, Groomsmen, etc.)
  - Professional image upload with Firebase Storage
  - Drag & drop photo functionality
- **Guest Management**: 
  - Import/export guest lists (CSV support)
  - Individual invitation codes
  - Bulk invitation sending
  - Guest categorization and filtering
- **RSVP Dashboard**: 
  - Real-time response tracking
  - Detailed analytics and charts
  - Dietary restrictions management
  - Plus-one handling
- **Content Management**:
  - Couple photo uploads
  - Photo gallery management
  - Custom messages and quotes
  - Event details and timeline

#### For Guests
- **Beautiful Invitations**: Responsive, customizable wedding invitations
- **Enhanced RSVP System**: 
  - Simple confirmation process
  - Dietary restrictions form
  - Plus-one support
  - Message to couple
- **Wedding Information**: 
  - Event details (ceremony/reception)
  - Wedding party member display
  - Photo galleries
  - Gift registry links

### 🔧 **Technical Implementation**

#### Frontend Architecture
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Styled-components** for dynamic theming and responsive design
- **React Router v6** for navigation
- **React Hook Form** with Yup validation
- **Custom Hooks** for business logic (useAuth, useWedding, useGuest, useRSVPAnalytics)

#### Backend & Services
- **Firebase Authentication** for secure user management
- **Firestore Database** with role-based security rules
- **Firebase Storage** for image management and optimization
- **Firebase Functions** for server-side operations
- **Email Service** for automated invitation sending

#### Key Services
- `weddingService.ts` - Wedding CRUD operations
- `guestService.ts` - Guest management and invitations
- `rsvpAnalyticsService.ts` - RSVP tracking and analytics
- `storageService.ts` - Image upload and management
- `weddingPartyService.ts` - Wedding party member management
- `emailService.ts` - Automated email notifications

## 🚀 Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Firebase (Auth, Firestore, Storage, Functions, Hosting)
- **Styling**: CSS-in-JS with styled-components + Google Fonts
- **Forms**: React Hook Form with Yup validation
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Development**: ESLint, Prettier, TypeScript
- **Testing**: Jest + React Testing Library (configured)

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project with Authentication, Firestore, and Storage enabled

## 🛠️ Development Workflow

### **Getting Started**
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wedding-invitation-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd functions && npm install && cd ..
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Fill in your Firebase configuration variables in `.env`

4. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication, Firestore, and Storage
   - Copy your Firebase config to `src/config/firebase-config.ts`

### **Development Commands**
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check
```

### **Firebase Development**
```bash
# Start Firebase emulators
firebase emulators:start

# Deploy functions only
firebase deploy --only functions

# Deploy hosting only
firebase deploy --only hosting

# Deploy everything
firebase deploy
```

## 🏗️ Current Project Structure

```
wedding-invitation-platform/
├── src/
│   ├── components/              # React components
│   │   ├── admin/              # Admin dashboard components
│   │   ├── couple/             # Couple-specific components
│   │   ├── guest/              # Guest management & display
│   │   │   ├── WeddingPartyDisplay.tsx    # Public wedding party display
│   │   │   ├── GuestManagementSection.tsx # Guest CRUD interface
│   │   │   └── AddGuestModal.tsx          # Guest creation modal
│   │   ├── rsvp/               # RSVP system components
│   │   │   ├── EnhancedRSVPForm.tsx       # Main RSVP form
│   │   │   ├── RSVPDashboard.tsx          # Analytics dashboard
│   │   │   └── DetailedRSVPResponses.tsx  # Response management
│   │   ├── shared/             # Reusable components
│   │   │   ├── ImageUpload.tsx            # File upload component
│   │   │   ├── Modal.tsx                  # Modal wrapper
│   │   │   └── Header.tsx                 # Navigation header
│   │   └── wedding/            # Wedding management
│   │       ├── WeddingCreationWizard.tsx  # Multi-step creation
│   │       ├── WeddingDetailsEditor.tsx   # Customization interface
│   │       ├── WeddingPartyManagement.tsx # Wedding party CRUD
│   │       └── steps/                     # Wizard steps
│   ├── contexts/               # React contexts
│   │   └── AuthContext.tsx     # Authentication state
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts          # Authentication logic
│   │   ├── useWedding.ts       # Wedding data management
│   │   ├── useGuest.ts         # Guest operations
│   │   └── useRSVPAnalytics.ts # RSVP analytics
│   ├── pages/                  # Page components
│   │   ├── PublicWeddingInvitation.tsx    # Main invitation display
│   │   ├── CoupleDashboard.tsx            # Couple main page
│   │   ├── AdminDashboard.tsx             # Admin interface
│   │   ├── GuestManagementPage.tsx        # Guest management
│   │   └── RSVPPage.tsx                   # RSVP interface
│   ├── services/               # API and Firebase services
│   │   ├── firebase.ts         # Firebase configuration
│   │   ├── weddingService.ts   # Wedding CRUD operations
│   │   ├── guestService.ts     # Guest management
│   │   ├── rsvpAnalyticsService.ts # RSVP tracking
│   │   ├── storageService.ts   # Image upload/management
│   │   ├── weddingPartyService.ts # Wedding party operations
│   │   └── emailService.ts     # Email notifications
│   ├── types/                  # TypeScript definitions
│   │   ├── index.ts            # Main type exports
│   │   └── guest.ts            # Guest-specific types
│   ├── utils/                  # Utility functions
│   │   ├── index.ts            # Common utilities
│   │   └── inviteCodeGenerator.ts # Invitation codes
│   └── styles/                 # Global styles
│       └── global.css          # Global CSS variables
├── functions/                   # Firebase Cloud Functions
│   ├── src/
│   │   └── index.ts            # Function definitions
│   └── package.json            # Functions dependencies
├── public/                     # Static assets
├── docs/                       # Documentation
│   ├── EMAIL_SERVICE_SETUP.md  # Email configuration guide
│   ├── INVITATION_METHODS.md   # Invitation sending methods
│   └── CONSOLE_ERRORS_EXPLAINED.md # Troubleshooting
├── firebase.json              # Firebase configuration
├── firestore.rules           # Database security rules
├── storage.rules             # Storage security rules
└── vite.config.ts            # Vite configuration
```

### **Key Architecture Decisions**

1. **Component Organization**: Feature-based structure with clear separation of concerns
2. **Service Layer**: Centralized business logic in service files
3. **Type Safety**: Comprehensive TypeScript definitions for all data structures
4. **State Management**: Context API for global state, local state for components
5. **Styling**: CSS-in-JS with styled-components for dynamic theming
6. **Security**: Role-based access control with Firebase security rules

## 🔐 Authentication & Security

- **Firebase Authentication**: Secure user authentication
- **Role-based Access Control**: Admin, Couple, and Guest roles
- **Firestore Security Rules**: Database-level security
- **Input Validation**: Client and server-side validation
- **HTTPS Everywhere**: Secure data transmission

## 🎨 Styling Guidelines

- **Mobile-first**: Responsive design approach
- **Accessibility**: WCAG 2.1 compliance
- **Theme System**: Consistent color and typography
- **CSS Variables**: Maintainable styling system

## 🔧 Configuration

### Firebase Security Rules

**Firestore Rules** (to be implemented):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User documents
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Wedding documents
    match /weddings/{weddingId} {
      allow read: if true; // Public read for guest invitations
      allow write: if request.auth != null && 
        (resource.data.coupleId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // RSVP documents
    match /rsvps/{rsvpId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📱 Deployment

### Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login and initialize**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Build and deploy**
   ```bash
   npm run build
   firebase deploy
   ```

### Environment Variables

**Production environment variables:**
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

## 🧪 Testing

Testing implementation is planned for future phases:
- Unit tests with Jest and React Testing Library
- Integration tests for Firebase interactions
- End-to-end tests with Cypress

## 📈 Project Status & Roadmap

### 🎉 **Phase 1: Foundation** ✅ **COMPLETED**
- [x] Project setup with React + TypeScript + Vite
- [x] Firebase configuration (Auth, Firestore, Storage)
- [x] Authentication system with role-based access
- [x] Basic routing and user roles (Admin, Couple, Guest)
- [x] Initial page structures and navigation

### 🎨 **Phase 2: Core Wedding Features** ✅ **COMPLETED**
- [x] Wedding creation wizard with multi-step form
- [x] Wedding details editor with live preview
- [x] Custom invitation design system
- [x] Color scheme customization
- [x] Font selection with 13+ Google Fonts
- [x] Background customization (gradient/image)
- [x] Section visibility controls

### 👥 **Phase 3A: Guest Management** ✅ **COMPLETED**
- [x] Guest list management (CRUD operations)
- [x] Guest import/export (CSV functionality)
- [x] Individual invitation code generation
- [x] Bulk invitation sending
- [x] Guest categorization and filtering

### 💌 **Phase 3B: Enhanced RSVP System** ✅ **COMPLETED**
- [x] Comprehensive RSVP form with validation
- [x] Dietary restrictions and special requests
- [x] Plus-one management
- [x] Real-time RSVP dashboard
- [x] Analytics and response tracking
- [x] RSVP reminder system

### 👰 **Phase 3C: Wedding Party Management** ✅ **COMPLETED** (Latest)
- [x] Wedding party member management
- [x] Role-based organization (Bridesmaids, Groomsmen, etc.)
- [x] Professional image upload with Firebase Storage
- [x] Wedding party display in public invitations
- [x] Drag & drop photo functionality
- [x] Image compression and optimization

### 📧 **Phase 4: Communication & Notifications** 🔄 **IN PROGRESS**
- [x] Email service configuration
- [x] Invitation email templates
- [ ] Automated RSVP reminders
- [ ] Thank you email automation
- [ ] SMS notifications (optional)

### 🚀 **Phase 5: Advanced Features** 📋 **PLANNED**
- [ ] Multiple invitation templates
- [ ] Advanced photo gallery with albums
- [ ] Gift registry integration
- [ ] Wedding timeline/itinerary management
- [ ] QR code generation for quick access
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

### 🔧 **Phase 6: Production Optimization** 📋 **PLANNED**
- [ ] Performance optimization and code splitting
- [ ] SEO implementation and meta tags
- [ ] Advanced security measures
- [ ] Comprehensive testing suite
- [ ] Error monitoring and logging
- [ ] CDN integration for images

### 💡 **Future Enhancements** 🔮 **FUTURE**
- [ ] Mobile app (React Native)
- [ ] Real-time chat for wedding party
- [ ] Integration with popular calendar apps
- [ ] Live streaming integration
- [ ] Wedding website builder
- [ ] Social media integration

## 🔧 **Recent Updates (July 2025)**

### ✨ **Latest Features Added**
1. **Wedding Party Management**:
   - Complete CRUD interface for wedding party members
   - Role-based categorization (Maid of Honor, Best Man, etc.)
   - Professional image upload with Firebase Storage integration
   - Responsive photo display with fallback initials

2. **Enhanced Font System**:
   - Converted text input to elegant dropdown selection
   - 13 carefully curated Google Fonts
   - Real-time font preview in customization
   - Categories: Serif, Sans-serif, Script fonts

3. **Code Cleanup & Optimization**:
   - Removed deprecated Padrinos (godparents) system
   - Streamlined section visibility controls
   - Improved TypeScript type definitions
   - Clean component architecture

4. **UI/UX Improvements**:
   - Modern drag & drop interfaces
   - Improved responsive design
   - Better error handling and validation
   - Enhanced loading states

### 🐛 **Recent Bug Fixes**
- Fixed section visibility controls in public invitations
- Resolved image upload issues in wedding party management
- Improved responsive layout for mobile devices
- Fixed TypeScript compilation errors

### 🔄 **Current Development Status**
- **Active Development**: Email automation and notification system
- **Testing Phase**: Wedding party management features
- **Ready for Production**: Core invitation and RSVP functionality
- **Next Priority**: Advanced photo gallery and gift registry integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@weddinginvitations.com or create an issue in this repository.

---

**Made with ❤️ for creating beautiful wedding memories**

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
