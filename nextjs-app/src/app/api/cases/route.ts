import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserPermissions } from '@/lib/permissions';

// GET /api/cases - List all cases
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const permissions = await getUserPermissions(session.user.group || null);
    
    // If user doesn't have viewOthers permission, only show their assigned cases
    const whereClause = permissions.viewOthers
      ? { deleted: 0 }
      : {
          deleted: 0,
          assignees: {
            some: {
              username: session.user.username,
              status: 'active',
            },
          },
        };

    const cases = await prisma.case.findMany({
      where: whereClause,
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
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const permissions = await getUserPermissions(session.user.group || null);
    if (!permissions.addCases) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to create cases' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Auto-generate case number in format YYYY-NNN
    const year = new Date().getFullYear();
    const yearPrefix = `${year}-`;
    
    // Find the last case number for this year
    const lastCase = await prisma.case.findFirst({
      where: {
        caseNumber: {
          startsWith: yearPrefix,
        },
      },
      orderBy: {
        caseNumber: 'desc',
      },
    });
    
    let nextNumber = 1;
    if (lastCase && lastCase.caseNumber) {
      const lastNumber = parseInt(lastCase.caseNumber.split('-')[1]);
      nextNumber = lastNumber + 1;
    }
    
    const caseNumber = `${yearPrefix}${String(nextNumber).padStart(3, '0')}`;
    
    const newCase = await prisma.case.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        caseNumber: caseNumber,
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
