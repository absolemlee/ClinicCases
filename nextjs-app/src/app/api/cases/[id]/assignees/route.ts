import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/cases/[id]/assignees - Assign user to case
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { username, status = 'active' } = body;

    const assignment = await prisma.caseAssignee.create({
      data: {
        caseId: parseInt(params.id),
        username,
        status,
        dateAssigned: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    console.error('Error assigning user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to assign user' },
      { status: 500 }
    );
  }
}

// GET /api/cases/[id]/assignees - List case assignees
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const assignees = await prisma.caseAssignee.findMany({
      where: {
        caseId: parseInt(params.id),
      },
      orderBy: {
        dateAssigned: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: assignees,
    });
  } catch (error) {
    console.error('Error fetching assignees:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch assignees' },
      { status: 500 }
    );
  }
}
