import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/cases - List all cases
export async function GET() {
  try {
    const cases = await prisma.case.findMany({
      where: { deleted: 0 },
      include: {
        assignees: {
          where: { status: 'active' },
        },
        notes: {
          orderBy: { datestamp: 'desc' },
          take: 5,
        },
      },
      orderBy: { timeOpened: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      data: cases,
      count: cases.length,
    });
  } catch (error) {
    console.error('Error fetching cases:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cases' },
      { status: 500 }
    );
  }
}

// POST /api/cases - Create a new case
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newCase = await prisma.case.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        caseNumber: body.caseNumber,
        dateOpen: body.dateOpen || new Date().toISOString().split('T')[0],
        timeOpened: new Date(),
        openedBy: body.openedBy || 'system',
        caseType: body.caseType,
        clinicType: body.clinicType,
      },
    });

    return NextResponse.json({
      success: true,
      data: newCase,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating case:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create case' },
      { status: 500 }
    );
  }
}
