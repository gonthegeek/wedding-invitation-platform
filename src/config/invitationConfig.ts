// Configuration for invitation sending methods
export const invitationConfig = {
  // Email configuration
  email: {
    enabled: false, // Set to true when email service is configured
    provider: 'simulation', // 'simulation' | 'sendgrid' | 'resend' | 'nodemailer'
    
    // Provider-specific settings (to be configured later)
    sendgrid: {
      apiKey: import.meta.env.VITE_SENDGRID_API_KEY,
      fromEmail: import.meta.env.VITE_FROM_EMAIL,
      fromName: import.meta.env.VITE_FROM_NAME,
    },
    
    resend: {
      apiKey: import.meta.env.VITE_RESEND_API_KEY,
      fromEmail: import.meta.env.VITE_FROM_EMAIL,
      fromName: import.meta.env.VITE_FROM_NAME,
    },
  },
  
  // URL sharing configuration
  urlSharing: {
    enabled: true,
    baseUrl: window.location.origin,
    
    // Social sharing templates
    templates: {
      whatsapp: (url: string, coupleName: string) => 
        `Hi! You're invited to ${coupleName}'s wedding! 💒 RSVP here: ${url}`,
      
      sms: (url: string, coupleName: string) => 
        `You're invited to ${coupleName}'s wedding! Please RSVP: ${url}`,
      
      generic: (url: string, coupleName: string) => 
        `Wedding Invitation - ${coupleName} - RSVP: ${url}`,
    },
  },
  
  // Feature flags
  features: {
    bulkURLCopy: true,
    socialShareButtons: true,
    qrCodeGeneration: false, // Future feature
    printableInvitations: false, // Future feature
  },
};

// Helper functions for generating sharing URLs
export const generateSharingURL = {
  whatsapp: (message: string) => 
    `https://wa.me/?text=${encodeURIComponent(message)}`,
  
  sms: (message: string) => 
    `sms:?body=${encodeURIComponent(message)}`,
  
  email: (subject: string, body: string) => 
    `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
};

// Cost comparison for different methods
export const methodComparison = {
  urlSharing: {
    cost: 'Free',
    pros: [
      'No additional costs',
      'Personal touch via WhatsApp/SMS',
      'Immediate delivery',
      'No spam folder issues',
      'Works with any messaging app',
    ],
    cons: [
      'Manual sharing required',
      'No automated tracking',
      'Requires social media/messaging apps',
    ],
  },
  
  email: {
    cost: '$10-50/month depending on volume',
    pros: [
      'Automated sending',
      'Professional appearance',
      'Built-in delivery tracking',
      'Can include rich HTML content',
    ],
    cons: [
      'Additional service costs',
      'May end up in spam',
      'Requires email service setup',
      'Less personal than direct messaging',
    ],
  },
};
