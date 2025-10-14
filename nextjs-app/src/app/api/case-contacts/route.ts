import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/case-contacts - Create new case contact
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { caseId, name, relation, address, city, state, zip, phone, email, notes } = body;

    // Split name into first and last
    const nameParts = name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const newContact = await prisma.caseContact.create({
      data: {
        assocCase: parseInt(caseId),
        firstName,
        lastName,
        type: relation, // Using 'type' field for relation
        address,
        city,
        state,
        zip,
        phone,
        email,
        notes,
      },
    });

    return NextResponse.json({
      success: true,
      data: newContact,
    });
  } catch (error) {
    console.error('Error creating case contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create case contact' },
      { status: 500 }
    );
  }
}
