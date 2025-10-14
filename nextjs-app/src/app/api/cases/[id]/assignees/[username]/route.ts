import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/cases/[id]/assignees/[username] - Update assignee status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; username: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    const updated = await prisma.caseAssignee.updateMany({
      where: {
        caseId: parseInt(params.id),
        username: params.username,
      },
      data: {
        status,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating assignee:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update assignee' },
      { status: 500 }
    );
  }
}

// DELETE /api/cases/[id]/assignees/[username] - Remove user from case
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; username: string } }
) {
  try {
    await prisma.caseAssignee.deleteMany({
      where: {
        caseId: parseInt(params.id),
        username: params.username,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error removing assignee:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove assignee' },
      { status: 500 }
    );
  }
}
