import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/case-notes - Create new case note
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { caseId, description, username = 'admin' } = body;

    const newNote = await prisma.caseNote.create({
      data: {
        caseId: parseInt(caseId),
        username, // Will come from authentication in the future
        description,
        datestamp: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: newNote,
    });
  } catch (error) {
    console.error('Error creating case note:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create case note' },
      { status: 500 }
    );
  }
}
