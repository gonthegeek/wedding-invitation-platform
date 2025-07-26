# Wedding Invitation Platform - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a comprehensive wedding invitation platform built with React TypeScript and Firebase. The platform supports three main user roles:

1. **Admin**: Platform administrator who manages multiple weddings
2. **Couple**: Future spouses who customize their invitation and manage RSVPs
3. **Guest**: Wedding guests who view invitations and submit RSVPs

## Architecture Guidelines

### Frontend (React TypeScript + Vite)
- Use functional components with React Hooks
- Implement TypeScript strictly with proper type definitions
- Use styled-components for component styling
- Follow React best practices and performance optimization
- Implement proper error boundaries and loading states

### Backend (Firebase)
- **Authentication**: Firebase Auth for user management
- **Database**: Firestore for data storage with proper security rules
- **Hosting**: Firebase Hosting for production deployment
- **Storage**: Firebase Storage for image uploads

### Security & Best Practices
- Implement role-based access control (RBAC)
- Use Firebase Security Rules for data protection
- Sanitize all user inputs
- Implement proper error handling and validation
- Follow OWASP security guidelines
- Use environment variables for sensitive configuration

### Code Organization
- Use feature-based folder structure
- Separate concerns: components, hooks, services, types
- Implement custom hooks for business logic
- Use context providers for global state management
- Create reusable utility functions

### Development Workflow
- Write clean, maintainable, and documented code
- Use meaningful commit messages following conventional commits
- Implement proper testing strategies
- Follow Git flow for development and production branches
- Use proper error handling and logging

### Styling Guidelines
- Mobile-first responsive design
- Use CSS-in-JS with styled-components
- Implement consistent design system
- Follow accessibility guidelines (WCAG)
- Optimize for performance and SEO

## Key Features to Implement
1. Multi-tenant wedding management
2. Customizable invitation templates
3. RSVP management system
4. Real-time guest confirmation tracking
5. Photo and content management
6. Subdomain routing for individual weddings
7. Email notifications
8. Guest list management
9. Wedding timeline and itinerary
10. Gift registry integration

When generating code, always consider:
- Type safety and proper TypeScript usage
- Performance optimization
- Security implications
- Accessibility requirements
- Mobile responsiveness
- SEO optimization
- Firebase best practices
- React performance patterns
