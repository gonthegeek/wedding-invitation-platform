# Email Service Integration Guide

## Overview

The Wedding Invitation Platform now supports professional email delivery for wedding invitations through Firebase Functions and third-party email service providers.

## 🚀 Quick Start

### Option 1: Continue with URL Sharing (FREE)
- No additional setup required
- Share invitation links via WhatsApp, SMS, or social media
- Personal touch with direct messaging
- Already fully functional in your platform

### Option 2: Enable Email Service (PAID)
- Professional email delivery
- Automated invitation sending
- Email tracking and analytics
- Requires technical setup and monthly costs

## 📧 Email Service Setup

### Prerequisites
- Firebase project with Functions enabled
- Email service provider account (SendGrid, Resend, etc.)
- Technical knowledge for deployment

### Step 1: Choose Email Provider

#### SendGrid (Recommended)
- **Free Tier**: 100 emails/day
- **Paid Plans**: Starting at $19.95/month for 50K emails
- **Features**: High deliverability, analytics, templates
- **Setup**: Requires SendGrid account and API key

#### Resend (Modern Alternative)
- **Free Tier**: 100 emails/day
- **Paid Plans**: Starting at $20/month for 50K emails
- **Features**: Developer-friendly, React templates
- **Setup**: Requires Resend account and API key

#### Custom SMTP (Advanced)
- **Cost**: Varies by provider
- **Features**: Use existing email account
- **Setup**: Requires SMTP configuration

### Step 2: Configure Firebase Functions

1. **Install Dependencies**
   ```bash
   cd functions
   npm install
   ```

2. **Set Environment Variables**
   ```bash
   # For SendGrid
   firebase functions:secrets:set SENDGRID_API_KEY
   
   # For production URL
   firebase functions:config:set app.frontend_url="https://yourdomain.com"
   ```

3. **Deploy Functions**
   ```bash
   firebase deploy --only functions
   ```

### Step 3: Update Frontend Configuration

1. **Add Environment Variables** (`.env`)
   ```bash
   VITE_EMAIL_SERVICE_ENABLED=true
   VITE_EMAIL_PROVIDER=sendgrid
   VITE_FIREBASE_FUNCTIONS_URL=https://us-central1-your-project-id.cloudfunctions.net
   ```

2. **Redeploy Frontend**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

## 🛠️ Technical Details

### Firebase Functions Structure
- `sendInvitationEmails`: HTTP function for sending invitations
- `sendRSVPConfirmation`: Firestore trigger for RSVP confirmations
- Authentication required for security
- Error handling and retry logic

### Email Templates
- Responsive HTML design
- Wedding branding
- Mobile-optimized
- Customizable content

### Security Features
- User authentication verification
- Wedding ownership validation
- Rate limiting (planned)
- Input sanitization

## 💰 Cost Comparison

### URL Sharing Method (Current)
- **Cost**: FREE
- **Pros**: 
  - No additional costs
  - Personal touch via messaging apps
  - Immediate delivery
  - No spam folder issues
- **Cons**: 
  - Manual sharing required
  - No automated tracking

### Email Service Method
- **Cost**: $20-50/month (depending on volume)
- **Pros**: 
  - Professional appearance
  - Automated sending
  - Delivery tracking
  - Rich HTML content
- **Cons**: 
  - Additional monthly costs
  - May end up in spam
  - Technical setup required

## 🔧 Troubleshooting

### Common Issues

1. **"Email service not configured"**
   - Verify environment variables
   - Check Firebase Functions deployment
   - Ensure API keys are set correctly

2. **"Authentication required"**
   - User needs to log in again
   - Check Firebase auth token validity

3. **"Failed to send emails"**
   - Check email service provider status
   - Verify API key permissions
   - Check recipient email addresses

### Testing Email Service

1. **Check Service Status**
   - Send Invitations modal shows service status
   - Green = Email service ready
   - Yellow/Red = Configuration required

2. **Send Test Invitation**
   - Select a single guest
   - Use email method
   - Check email delivery and formatting

3. **Monitor Logs**
   ```bash
   firebase functions:log
   ```

## 📈 Future Enhancements

### Phase 3B Extensions
- [ ] Email template customization
- [ ] Automated reminder sequences
- [ ] A/B testing for subject lines
- [ ] Bounce and spam tracking
- [ ] Guest communication hub

### Advanced Features
- [ ] SMS integration (Twilio)
- [ ] Push notifications
- [ ] Email scheduling
- [ ] Advanced analytics
- [ ] Custom domain support

## 🆘 Support

### Need Help?
1. **URL Sharing**: Always available as fallback method
2. **Email Setup**: Contact technical support for assistance
3. **Cost Concerns**: URL sharing remains free and effective

### Best Practices
- Start with URL sharing for immediate use
- Consider email service for large weddings (100+ guests)
- Test email delivery before sending to all guests
- Monitor delivery rates and adjust as needed

---

**Remember**: The platform is fully functional with URL sharing. Email service is an optional enhancement that can be added later if needed.
