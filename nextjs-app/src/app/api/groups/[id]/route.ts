import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/groups/[id] - Get single group
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const group = await prisma.group.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!group) {
      return NextResponse.json(
        { success: false, error: 'Group not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: group,
    });
  } catch (error) {
    console.error('Error fetching group:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch group' },
      { status: 500 }
    );
  }
}

// PATCH /api/groups/[id] - Update group
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const updated = await prisma.group.update({
      where: { id: parseInt(params.id) },
      data: body,
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating group:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update group' },
      { status: 500 }
    );
  }
}

// DELETE /api/groups/[id] - Delete group
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.group.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({
      success: true,
      message: 'Group deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting group:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete group' },
      { status: 500 }
    );
  }
}
