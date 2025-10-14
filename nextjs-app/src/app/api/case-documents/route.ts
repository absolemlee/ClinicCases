import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/case-documents - Create new case document
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { caseId, name, description, fileUrl } = body;

    const newDocument = await prisma.document.create({
      data: {
        caseId: parseInt(caseId),
        displayName: name,
        editableText: description,
        localFileName: fileUrl, // Temporarily using localFileName for URL
        timeAdded: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: newDocument,
    });
  } catch (error) {
    console.error('Error creating case document:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create case document' },
      { status: 500 }
    );
  }
}
