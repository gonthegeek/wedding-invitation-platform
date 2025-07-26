# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Wedding Invitation Platform

A comprehensive wedding invitation platform built with React TypeScript and Firebase, supporting multiple user roles and customizable wedding invitations.

## 🌟 Features

### For Administrators
- **Multi-tenant Management**: Manage multiple weddings on the platform
- **User Management**: Oversee couples and guest accounts
- **Platform Analytics**: Track usage, RSVPs, and revenue
- **Content Moderation**: Review and approve wedding content

### For Couples
- **Custom Invitations**: Create personalized wedding invitations
- **Guest Management**: Manage guest lists and send invitations
- **RSVP Tracking**: Real-time monitoring of guest responses
- **Timeline Management**: Create and share wedding day schedules
- **Subdomain Hosting**: Unique URLs for each wedding

### For Guests
- **Beautiful Invitations**: View elegant, responsive wedding invitations
- **Easy RSVP**: Simple confirmation process with plus-one support
- **Event Details**: Access to ceremony and reception information
- **Gift Registry**: View and contribute to wedding registries

## 🚀 Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Firebase (Auth, Firestore, Storage, Hosting)
- **Styling**: CSS-in-JS with styled-components
- **Forms**: React Hook Form with Yup validation
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Development**: ESLint, Prettier, TypeScript

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project setup

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wedding-invitation-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Fill in your Firebase configuration variables in `.env`

4. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication, Firestore, and Storage
   - Copy your Firebase config to `.env`

## 🏃‍♂️ Development

**Start the development server:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

**Run linting:**
```bash
npm run lint
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── admin/          # Admin-specific components
│   ├── couple/         # Couple-specific components
│   ├── guest/          # Guest-specific components
│   └── shared/         # Shared/common components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API and Firebase services
├── styles/             # Global styles and themes
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

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

## 📈 Roadmap

### Phase 1: Foundation ✅
- [x] Project setup with React + TypeScript + Vite
- [x] Firebase configuration
- [x] Authentication system
- [x] Basic routing and user roles
- [x] Initial page structures

### Phase 2: Core Features (Next)
- [ ] Wedding creation and management
- [ ] Guest list management
- [ ] RSVP system implementation
- [ ] Email notifications

### Phase 3: Advanced Features
- [ ] Custom invitation templates
- [ ] Photo gallery management
- [ ] Gift registry integration
- [ ] Analytics dashboard

### Phase 4: Production Ready
- [ ] Performance optimization
- [ ] SEO implementation
- [ ] Advanced security measures
- [ ] Comprehensive testing

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
