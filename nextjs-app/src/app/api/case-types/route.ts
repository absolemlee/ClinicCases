import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/case-types - List all case types
export async function GET() {
  try {
    const caseTypes = await prisma.caseType.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: caseTypes,
      count: caseTypes.length,
    });
  } catch (error) {
    console.error('Error fetching case types:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch case types' },
      { status: 500 }
    );
  }
}

// POST /api/case-types - Create new case type
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, name } = body;

    const newCaseType = await prisma.caseType.create({
      data: {
        code,
        name,
      },
    });

    return NextResponse.json({
      success: true,
      data: newCaseType,
    });
  } catch (error) {
    console.error('Error creating case type:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create case type' },
      { status: 500 }
    );
  }
}
