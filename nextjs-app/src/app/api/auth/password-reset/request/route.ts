import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';

// POST /api/auth/password-reset/request - Request password reset
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findFirst({
      where: { email },
    });

    // Always return success for security (don't reveal if email exists)
    // But only generate token if user exists and has email
    if (user && user.email) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      // Store token in database
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });

      // Send password reset email via Resend API (HTTPS - no SMTP required)
      const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/password-reset/reset?token=${resetToken}`;
      
      const emailResult = await sendPasswordResetEmail(
        user.email,
        resetUrl,
        user.username
      );

      if (emailResult.success) {
        console.log('✅ Password reset email sent successfully to:', user.email);
      } else {
        // Log error but don't reveal to user (security - don't confirm email exists)
        console.error('❌ Failed to send password reset email:', emailResult.error);
        // Continue anyway - always return success message for security
      }
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with that email, reset instructions have been sent',
    });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
