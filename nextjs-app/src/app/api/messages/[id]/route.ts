import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/messages/[id] - Get single message
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const message = await prisma.message.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        case: {
          select: {
            caseNumber: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error('Error fetching message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch message' },
      { status: 500 }
    );
  }
}

// PATCH /api/messages/[id] - Update message (mark as read, archive, etc.)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { archived, deleted } = body;

    const updated = await prisma.message.update({
      where: { id: parseInt(params.id) },
      data: {
        ...(archived !== undefined && { archived: archived ? 1 : 0 }),
        ...(deleted !== undefined && { deleted: deleted ? 1 : 0 }),
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update message' },
      { status: 500 }
    );
  }
}

// DELETE /api/messages/[id] - Hard delete message
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.message.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
