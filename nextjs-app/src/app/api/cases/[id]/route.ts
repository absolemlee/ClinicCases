import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserPermissions } from '@/lib/permissions';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

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

    // Check if user has permission to view this case
    const permissions = await getUserPermissions(session.user.group || null);
    if (!permissions.viewOthers) {
      // Check if user is assigned to this case
      const isAssigned = caseData.assignees.some(
        (assignee) => assignee.username === session.user.username && assignee.status === 'active'
      );
      if (!isAssigned) {
        return NextResponse.json(
          { success: false, error: 'You do not have permission to view this case' },
          { status: 403 }
        );
      }
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
