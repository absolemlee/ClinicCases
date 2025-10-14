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

export async function PUT(
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

    // Check if user has permission to edit cases
    const permissions = await getUserPermissions(session.user.group || null);
    if (!permissions.editCases) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to edit cases' },
        { status: 403 }
      );
    }

    // Check if case exists
    const existingCase = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        assignees: true,
      },
    });

    if (!existingCase) {
      return NextResponse.json(
        { success: false, error: 'Case not found' },
        { status: 404 }
      );
    }

    // If user can't view others' cases, check if they're assigned
    if (!permissions.viewOthers) {
      const isAssigned = existingCase.assignees.some(
        (assignee) => assignee.username === session.user.username && assignee.status === 'active'
      );
      if (!isAssigned) {
        return NextResponse.json(
          { success: false, error: 'You do not have permission to edit this case' },
          { status: 403 }
        );
      }
    }

    const body = await request.json();

    // Update the case - only fields that exist in the schema
    const updatedCase = await prisma.case.update({
      where: { id: caseId },
      data: {
        firstName: body.firstName || null,
        middleName: body.middleName || null,
        lastName: body.lastName || null,
        caseType: body.caseType || null,
        clinicType: body.clinicType || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedCase,
    });
  } catch (error) {
    console.error('Error updating case:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update case' },
      { status: 500 }
    );
  }
}
