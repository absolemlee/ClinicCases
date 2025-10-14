import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/groups - List all groups
export async function GET() {
  try {
    const groups = await prisma.group.findMany({
      orderBy: { displayName: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: groups,
      count: groups.length,
    });
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch groups' },
      { status: 500 }
    );
  }
}

// POST /api/groups - Create new group
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      groupName,
      displayName,
      description,
      allowedTabs,
      addCases = 0,
      editCases = 0,
      deleteCases = 0,
      viewOthers = 0,
    } = body;

    const newGroup = await prisma.group.create({
      data: {
        groupName,
        displayName,
        description,
        allowedTabs,
        addCases,
        editCases,
        deleteCases,
        viewOthers,
      },
    });

    return NextResponse.json({
      success: true,
      data: newGroup,
    });
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create group' },
      { status: 500 }
    );
  }
}
