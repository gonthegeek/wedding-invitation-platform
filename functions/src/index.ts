import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import * as sgMail from '@sendgrid/mail';

// Initialize Firebase Admin
admin.initializeApp();

// Initialize SendGrid
const sendGridApiKey = functions.params.defineSecret('SENDGRID_API_KEY');

/**
 * Send wedding invitation emails
 * Triggered by HTTP requests from the frontend
 */
export const sendInvitationEmails = functions.https.onRequest(
  {
    secrets: [sendGridApiKey],
    cors: true,
  },
  async (req, res) => {
    // CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      // Verify authentication
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);

      // Extract request data
      const { weddingId, guests } = req.body;

      if (!weddingId || !guests || !Array.isArray(guests)) {
        res.status(400).json({ error: 'Invalid request data' });
        return;
      }

      // Get wedding data
      const weddingDoc = await admin.firestore()
        .collection('weddings')
        .doc(weddingId)
        .get();

      if (!weddingDoc.exists) {
        res.status(404).json({ error: 'Wedding not found' });
        return;
      }

      const wedding = weddingDoc.data();

      // Verify user permission
      if (wedding?.coupleId !== decodedToken.uid) {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }

      // Initialize SendGrid
      sgMail.setApiKey(sendGridApiKey.value());

      const results = [];

      // Send emails to each guest
      for (const guest of guests) {
        try {
          const invitationUrl = `${process.env.FRONTEND_URL || 'https://wedding-invitation-platform.web.app'}/rsvp/${guest.inviteCode}`;
          
          const msg = {
            to: guest.email,
            from: {
              email: 'noreply@wedding-invitation-platform.com',
              name: `${wedding.brideName} & ${wedding.groomName}`
            },
            subject: `You're Invited to ${wedding.brideName} & ${wedding.groomName}'s Wedding! 💒`,
            html: generateEmailTemplate(guest, wedding, invitationUrl),
            text: `Hi ${guest.firstName}! You're invited to ${wedding.brideName} & ${wedding.groomName}'s wedding. Please RSVP at: ${invitationUrl}`
          };

          await sgMail.send(msg);

          // Update guest record
          await admin.firestore()
            .collection('guests')
            .doc(guest.id)
            .update({
              remindersSent: admin.firestore.FieldValue.increment(1),
              invitedAt: admin.firestore.FieldValue.serverTimestamp(),
              lastEmailSent: admin.firestore.FieldValue.serverTimestamp()
            });

          results.push({ guestId: guest.id, status: 'sent' });
        } catch (error) {
          functions.logger.error(`Failed to send email to ${guest.email}:`, error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          results.push({ guestId: guest.id, status: 'failed', error: errorMessage });
        }
      }

      res.status(200).json({
        success: true,
        results,
        totalSent: results.filter(r => r.status === 'sent').length,
        totalFailed: results.filter(r => r.status === 'failed').length
      });

    } catch (error) {
      functions.logger.error('Error sending invitation emails:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ 
        error: 'Internal server error',
        message: errorMessage
      });
    }
  }
);

// Types for better type safety
interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  inviteCode: string;
}

interface Wedding {
  brideName: string;
  groomName: string;
  weddingDate: string;
  ceremonyVenue?: { name: string };
  receptionVenue?: { name: string };
  coupleId: string;
}

/**
 * Generate HTML email template for wedding invitation
 */
function generateEmailTemplate(guest: Guest, wedding: Wedding, invitationUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Wedding Invitation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px; margin-bottom: 30px;">
        <h1 style="margin: 0 0 10px 0; font-size: 2.5em;">💒</h1>
        <h2 style="margin: 0 0 10px 0; font-size: 1.8em;">${wedding.brideName} & ${wedding.groomName}</h2>
        <p style="margin: 0; font-size: 1.2em; opacity: 0.9;">are getting married!</p>
      </div>
      
      <div style="padding: 0 20px;">
        <h3 style="color: #667eea; margin-bottom: 20px;">Dear ${guest.firstName},</h3>
        
        <p style="font-size: 1.1em; margin-bottom: 25px;">
          We're thrilled to invite you to celebrate our special day! Your presence would make our wedding celebration complete.
        </p>
        
        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
          <h4 style="margin: 0 0 15px 0; color: #333;">Wedding Details:</h4>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(wedding.weddingDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
          ${wedding.ceremonyVenue ? `<p style="margin: 5px 0;"><strong>Ceremony:</strong> ${wedding.ceremonyVenue.name}</p>` : ''}
          ${wedding.receptionVenue ? `<p style="margin: 5px 0;"><strong>Reception:</strong> ${wedding.receptionVenue.name}</p>` : ''}
        </div>
        
        <div style="text-align: center; margin: 35px 0;">
          <a href="${invitationUrl}" 
             style="display: inline-block; background: #667eea; color: white; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 1.1em;">
            View Invitation & RSVP
          </a>
        </div>
        
        <p style="margin-bottom: 25px;">
          Please RSVP by clicking the link above. We can't wait to celebrate with you!
        </p>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #666; font-size: 0.9em;">
          <p>With love,<br><strong>${wedding.brideName} & ${wedding.groomName}</strong></p>
          <p style="margin-top: 15px;">
            <a href="${invitationUrl}" style="color: #667eea;">View full invitation details</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Check email service status and configuration
 */
export const checkEmailService = functions.https.onRequest(
  {
    secrets: [sendGridApiKey],
    cors: true,
  },
  async (req, res) => {
    // CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      // Verify authentication
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const idToken = authHeader.split('Bearer ')[1];
      await admin.auth().verifyIdToken(idToken);

      // Check if SendGrid API key is configured
      const hasApiKey = !!sendGridApiKey.value();

      res.status(200).json({
        available: hasApiKey,
        provider: hasApiKey ? 'sendgrid' : 'none',
        features: hasApiKey ? ['delivery_tracking', 'templates', 'analytics'] : [],
        limitations: hasApiKey ? 'SendGrid free tier: 100 emails/day' : 'Email service not configured'
      });

    } catch (error) {
      functions.logger.error('Error checking email service:', error);
      res.status(500).json({ 
        available: false,
        provider: 'none',
        error: 'Service check failed'
      });
    }
  }
);

/**
 * Send RSVP confirmation emails
 */
export const sendRSVPConfirmation = functions.firestore
  .document('rsvps/{rsvpId}')
  .onCreate(async (snap) => {
    try {
      const rsvp = snap.data();
      
      // Get guest and wedding data
      const [guestDoc, weddingDoc] = await Promise.all([
        admin.firestore().collection('guests').doc(rsvp.guestId).get(),
        admin.firestore().collection('weddings').doc(rsvp.weddingId).get()
      ]);

      if (!guestDoc.exists || !weddingDoc.exists) {
        functions.logger.error('Guest or wedding not found for RSVP confirmation');
        return;
      }

      const guest = guestDoc.data();
      const wedding = weddingDoc.data();

      // Initialize SendGrid (in production, use environment variable)
      if (!process.env.SENDGRID_API_KEY) {
        functions.logger.warn('SendGrid API key not configured');
        return;
      }

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const attendanceStatus = rsvp.rsvpStatus === 'attending' ? 'confirmed your attendance' : 'let us know you cannot attend';
      
      const msg = {
        to: guest.email,
        from: {
          email: 'noreply@wedding-invitation-platform.com',
          name: `${wedding.brideName} & ${wedding.groomName}`
        },
        subject: `RSVP Confirmation - ${wedding.brideName} & ${wedding.groomName}'s Wedding`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #667eea;">Thank you for your RSVP!</h2>
            <p>Dear ${guest.firstName},</p>
            <p>We've received your RSVP and ${attendanceStatus} for our wedding celebration.</p>
            ${rsvp.rsvpStatus === 'attending' ? `
              <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h3 style="color: #2d5a2d; margin-top: 0;">We can't wait to celebrate with you! 🎉</h3>
              </div>
            ` : `
              <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0;">We're sorry you can't join us, but we understand. You'll be missed!</p>
              </div>
            `}
            <p>If you need to make any changes to your RSVP, please use your original invitation link.</p>
            <p>With love,<br><strong>${wedding.brideName} & ${wedding.groomName}</strong></p>
          </div>
        `
      };

      await sgMail.send(msg);
      functions.logger.info(`RSVP confirmation sent to ${guest.email}`);

    } catch (error) {
      functions.logger.error('Error sending RSVP confirmation:', error);
    }
  });
