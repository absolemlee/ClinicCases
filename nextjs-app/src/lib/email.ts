import { Resend } from 'resend';

// Initialize Resend with API key from environment
// Use a dummy key for build time if not set
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');

/**
 * Send password reset email to user
 * Uses Resend API (HTTPS) - no SMTP required
 */
export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
  username: string
) {
  // Check if API key is configured
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_dummy_key_for_build') {
    console.warn('⚠️  RESEND_API_KEY not configured - email not sent');
    console.log('Reset URL would be:', resetUrl);
    return { 
      success: false, 
      error: 'Email service not configured. Check RESEND_API_KEY environment variable.' 
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'ClinicCases <onboarding@resend.dev>',
      to,
      subject: 'Password Reset Request - ClinicCases',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6; 
                color: #333; 
                margin: 0;
                padding: 0;
                background-color: #f4f4f5;
              }
              .container { 
                max-width: 600px; 
                margin: 40px auto; 
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                overflow: hidden;
              }
              .header {
                background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                padding: 30px 20px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                color: white;
                font-size: 24px;
              }
              .content {
                padding: 40px 30px;
              }
              .button { 
                display: inline-block; 
                padding: 14px 32px; 
                background-color: #2563eb; 
                color: white !important; 
                text-decoration: none; 
                border-radius: 6px; 
                margin: 24px 0;
                font-weight: 600;
                text-align: center;
              }
              .button:hover {
                background-color: #1d4ed8;
              }
              .link-box {
                background-color: #f4f4f5;
                padding: 16px;
                border-radius: 6px;
                word-break: break-all;
                font-size: 13px;
                color: #2563eb;
                margin: 20px 0;
              }
              .warning {
                background-color: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 12px 16px;
                margin: 20px 0;
                border-radius: 4px;
              }
              .footer { 
                background-color: #f9fafb;
                padding: 20px 30px;
                font-size: 13px; 
                color: #6b7280;
                border-top: 1px solid #e5e7eb;
              }
              .footer p {
                margin: 5px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔒 ClinicCases</h1>
              </div>
              
              <div class="content">
                <h2 style="margin-top: 0; color: #111827;">Password Reset Request</h2>
                <p>Hello <strong>${username}</strong>,</p>
                <p>We received a request to reset your password for your ClinicCases account. Click the button below to create a new password:</p>
                
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Reset My Password</a>
                </div>
                
                <p style="font-size: 14px; color: #6b7280;">Or copy and paste this link into your browser:</p>
                <div class="link-box">${resetUrl}</div>
                
                <div class="warning">
                  <strong>⏰ This link expires in 1 hour</strong> for security reasons.
                </div>
                
                <p style="margin-top: 30px;">If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                
                <p style="font-size: 14px; color: #6b7280;">For security reasons, if you continue to receive these emails without requesting them, please contact your system administrator.</p>
              </div>
              
              <div class="footer">
                <p><strong>ClinicCases</strong> - Case Management System</p>
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>If you need assistance, contact your system administrator.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      // Plain text fallback for email clients that don't support HTML
      text: `
Password Reset Request - ClinicCases

Hello ${username},

You requested to reset your password for ClinicCases. Click the link below to proceed:

${resetUrl}

This link expires in 1 hour.

If you didn't request this password reset, please ignore this email or contact your administrator.

---
ClinicCases - Case Management System
This is an automated message. Please do not reply.
      `.trim(),
    });

    if (error) {
      console.error('Resend API error:', error);
      return { success: false, error };
    }

    console.log('Password reset email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return { success: false, error };
  }
}

/**
 * Send welcome email to new user (optional - for future use)
 */
export async function sendWelcomeEmail(
  to: string,
  username: string,
  temporaryPassword: string
) {
  // Check if API key is configured
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_dummy_key_for_build') {
    console.warn('⚠️  RESEND_API_KEY not configured - welcome email not sent');
    return { 
      success: false, 
      error: 'Email service not configured. Check RESEND_API_KEY environment variable.' 
    };
  }

  try {
    const loginUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login`;
    
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'ClinicCases <onboarding@resend.dev>',
      to,
      subject: 'Welcome to ClinicCases',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .credentials { background: #f4f4f5; padding: 16px; border-radius: 6px; margin: 20px 0; }
              .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Welcome to ClinicCases!</h2>
              <p>Hello <strong>${username}</strong>,</p>
              <p>Your account has been created. Use the credentials below to log in:</p>
              
              <div class="credentials">
                <p><strong>Username:</strong> ${username}</p>
                <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
              </div>
              
              <a href="${loginUrl}" class="button">Log In to ClinicCases</a>
              
              <p><strong>Important:</strong> You will be prompted to change your password on first login.</p>
              
              <p>If you have any questions, please contact your administrator.</p>
            </div>
          </body>
        </html>
      `,
      text: `
Welcome to ClinicCases!

Hello ${username},

Your account has been created. Use the credentials below to log in:

Username: ${username}
Temporary Password: ${temporaryPassword}

Login URL: ${loginUrl}

Important: You will be prompted to change your password on first login.

If you have any questions, please contact your administrator.
      `.trim(),
    });

    if (error) {
      console.error('Resend API error:', error);
      return { success: false, error };
    }

    console.log('Welcome email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error };
  }
}
