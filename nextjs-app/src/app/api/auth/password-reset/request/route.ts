import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

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
    // But only generate token if user exists
    if (user) {
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

      // In a production environment, you would send an email here
      // For now, log the reset URL to console
      const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/password-reset/reset?token=${resetToken}`;
      
      console.log('='.repeat(80));
      console.log('PASSWORD RESET REQUESTED');
      console.log('='.repeat(80));
      console.log('User:', user.username);
      console.log('Email:', user.email);
      console.log('Reset URL:', resetUrl);
      console.log('Token expires:', resetTokenExpiry.toISOString());
      console.log('='.repeat(80));

      // TODO: Implement email sending
      // await sendEmail({
      //   to: email,
      //   subject: 'Password Reset Request',
      //   html: `Click this link to reset your password: <a href="${resetUrl}">${resetUrl}</a>`,
      // });
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
