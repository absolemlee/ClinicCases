import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/users/[id] - Get single user
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PATCH /api/users/[id] - Update user
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { password, ...updateData } = body;

    // If password is being updated, it should be hashed in production
    const data = password 
      ? { ...updateData, password }
      : updateData;

    const updated = await prisma.user.update({
      where: { id: parseInt(params.id) },
      data,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updated;

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
