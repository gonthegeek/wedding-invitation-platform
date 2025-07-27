# GitHub Actions Deployment Setup

This document explains how to set up GitHub Actions for automated Firebase deployment.

## 🚀 Overview

The GitHub Actions workflow will automatically:
- ✅ Build and test the application on every push/PR
- ✅ Deploy to Firebase Hosting when code is pushed to `main` branch
- ✅ Run linting and type checking
- ✅ Cache dependencies for faster builds

## 📋 Prerequisites

1. **Firebase Project**: You need a Firebase project with Hosting enabled
2. **GitHub Repository**: Your code needs to be in a GitHub repository
3. **Firebase CLI**: Installed locally for initial setup

## 🔧 Setup Instructions

### Step 1: Generate Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings → Service Accounts
4. Click "Generate new private key"
5. Save the JSON file securely (you'll need it for GitHub secrets)

### Step 2: Set up GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these **Repository Secrets**:

#### Firebase Configuration Secrets
```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id (optional)
```

#### Firebase Deployment Secrets
```
FIREBASE_SERVICE_ACCOUNT=<paste_entire_service_account_json_here>
FIREBASE_PROJECT_ID=your_project_id
```

### Step 3: Get Your Firebase Configuration

You can find these values in your Firebase project settings:

1. Go to Firebase Console → Project Settings
2. Scroll down to "Your apps" section
3. Click the web app (or create one if you haven't)
4. Copy the config values from the Firebase SDK snippet

Example Firebase config:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...", // → VITE_FIREBASE_API_KEY
  authDomain: "project.firebaseapp.com", // → VITE_FIREBASE_AUTH_DOMAIN
  projectId: "project-id", // → VITE_FIREBASE_PROJECT_ID
  storageBucket: "project.appspot.com", // → VITE_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789", // → VITE_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123:web:abc123", // → VITE_FIREBASE_APP_ID
  measurementId: "G-ABC123" // → VITE_FIREBASE_MEASUREMENT_ID
};
```

### Step 4: Configure Firebase Hosting

Make sure your `firebase.json` is properly configured:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## 🔄 Workflow Behavior

### When you push to `main` branch:
1. **Build & Test**: Runs linting, type checking, and builds the app
2. **Deploy**: Automatically deploys to Firebase Hosting
3. **Notification**: Shows deployment status

### When you create a Pull Request:
1. **Build & Test**: Runs all checks to ensure code quality
2. **No Deployment**: Only testing, no deployment

## 📊 Monitoring Deployments

1. **GitHub Actions Tab**: See build/deploy status in your repository
2. **Firebase Console**: Monitor hosting deployments
3. **GitHub Notifications**: Get notified of deployment success/failure

## 🐛 Troubleshooting

### Common Issues:

1. **Build Fails**: Check that all environment variables are set correctly
2. **Deployment Fails**: Verify Firebase service account permissions
3. **Type Errors**: Ensure all TypeScript errors are fixed before pushing

### Debug Steps:

1. Check GitHub Actions logs for detailed error messages
2. Verify all secrets are correctly set in GitHub
3. Test build locally: `npm run build`
4. Test deployment locally: `firebase deploy`

## 🔒 Security Best Practices

- ✅ Never commit Firebase config or service account keys to repository
- ✅ Use GitHub secrets for all sensitive information
- ✅ Regularly rotate service account keys
- ✅ Review permissions on Firebase service accounts
- ✅ Monitor deployment logs for any unusual activity

## 📈 Optimization Tips

- The workflow uses npm cache to speed up builds
- Build artifacts are shared between jobs
- Only deploys on `main` branch pushes (not PRs)
- Runs tests before deployment to catch issues early

## 🎯 Next Steps

After setting up the workflow:

1. **Test the deployment**: Push a change to `main` branch
2. **Monitor the build**: Check GitHub Actions tab
3. **Verify deployment**: Visit your Firebase Hosting URL
4. **Set up notifications**: Configure GitHub/email notifications for deployment status

---

**Need Help?** Check the GitHub Actions logs or Firebase Console for detailed error messages.
