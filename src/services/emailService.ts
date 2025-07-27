import { auth } from './firebase';
import type { Guest } from '../types/guest';

interface EmailInvitationRequest {
  weddingId: string;
  guests: Guest[];
}

interface EmailInvitationResult {
  success: boolean;
  results: Array<{
    guestId: string;
    status: 'sent' | 'failed';
    error?: string;
  }>;
  totalSent: number;
  totalFailed: number;
}

/**
 * Email service for sending wedding invitations
 */
export class EmailService {
  private static readonly FUNCTIONS_URL = import.meta.env.VITE_FIREBASE_FUNCTIONS_URL || 
    'https://us-central1-wedding-invitation-platform.cloudfunctions.net';

  /**
   * Send invitation emails to selected guests
   */
  static async sendInvitationEmails(request: EmailInvitationRequest): Promise<EmailInvitationResult> {
    try {
      // Get current user's auth token
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const idToken = await user.getIdToken();

      // Call Firebase Function
      const response = await fetch(`${this.FUNCTIONS_URL}/sendInvitationEmails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send emails');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending invitation emails:', error);
      throw error;
    }
  }

  /**
   * Check if email service is available and configured
   */
  static async checkEmailServiceStatus(): Promise<{
    available: boolean;
    provider: string;
    error?: string;
  }> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { available: false, provider: 'none', error: 'Not authenticated' };
      }

      const idToken = await user.getIdToken();

      const response = await fetch(`${this.FUNCTIONS_URL}/checkEmailService`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (response.ok) {
        return await response.json();
      } else {
        return { available: false, provider: 'none', error: 'Service check failed' };
      }
    } catch (error) {
      return { 
        available: false, 
        provider: 'none', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get email service configuration and pricing info
   */
  static getEmailServiceInfo() {
    return {
      providers: [
        {
          name: 'SendGrid',
          description: 'Reliable email delivery service',
          pricing: 'Free tier: 100 emails/day, Paid: $19.95/month for 50K emails',
          features: ['High deliverability', 'Analytics', 'Templates', 'API support'],
          recommended: true,
        },
        {
          name: 'Resend',
          description: 'Modern email API for developers',
          pricing: 'Free tier: 100 emails/day, Paid: $20/month for 50K emails',
          features: ['Developer-friendly', 'React templates', 'Analytics', 'Good deliverability'],
          recommended: false,
        },
        {
          name: 'Custom SMTP',
          description: 'Use your own email provider',
          pricing: 'Varies by provider (Gmail, Outlook, etc.)',
          features: ['Use existing email account', 'Custom domain support', 'Variable costs'],
          recommended: false,
        },
      ],
      setupSteps: [
        'Choose an email service provider',
        'Create account and get API keys',
        'Configure Firebase Functions environment variables',
        'Deploy updated functions',
        'Test email delivery',
      ],
    };
  }
}

/**
 * Email template configurations
 */
export const emailTemplates = {
  invitation: {
    subject: (brideName: string, groomName: string) => 
      `You're Invited to ${brideName} & ${groomName}'s Wedding! 💒`,
    
    preview: (guestName: string, brideName: string, groomName: string) =>
      `${guestName}, join us for ${brideName} & ${groomName}'s special day`,
  },
  
  reminder: {
    subject: (brideName: string, groomName: string) => 
      `Reminder: ${brideName} & ${groomName}'s Wedding RSVP`,
    
    preview: (guestName: string) =>
      `${guestName}, don't forget to RSVP for our wedding`,
  },
  
  confirmation: {
    subject: (brideName: string, groomName: string) => 
      `RSVP Confirmation - ${brideName} & ${groomName}'s Wedding`,
    
    preview: (guestName: string) =>
      `${guestName}, thank you for your RSVP!`,
  },
};

/**
 * Email service configuration helper
 */
export const emailConfig = {
  // Check if email service is configured
  isConfigured: () => {
    return !!(
      import.meta.env.VITE_EMAIL_SERVICE_ENABLED === 'true' &&
      import.meta.env.VITE_FIREBASE_FUNCTIONS_URL
    );
  },
  
  // Get current email service provider
  getProvider: () => {
    return import.meta.env.VITE_EMAIL_PROVIDER || 'none';
  },
  
  // Get email service status for UI
  getStatus: () => {
    if (!import.meta.env.VITE_EMAIL_SERVICE_ENABLED) {
      return 'disabled';
    }
    
    if (!import.meta.env.VITE_FIREBASE_FUNCTIONS_URL) {
      return 'not_configured';
    }
    
    return 'enabled';
  },
};
