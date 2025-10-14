import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const caseId = parseInt(params.id);

    if (isNaN(caseId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid case ID' },
        { status: 400 }
      );
    }

    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        assignees: {
          orderBy: { dateAssigned: 'desc' },
        },
        notes: {
          orderBy: { datestamp: 'desc' },
        },
        contacts: {
          orderBy: { id: 'desc' },
        },
        documents: {
          orderBy: { timeAdded: 'desc' },
        },
        events: {
          orderBy: { start: 'desc' },
          include: {
            responsibles: true,
          },
        },
      },
    });

    if (!caseData) {
      return NextResponse.json(
        { success: false, error: 'Case not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: caseData,
    });
  } catch (error) {
    console.error('Error fetching case:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch case' },
      { status: 500 }
    );
  }
}
