import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/case-columns - Get all case column configurations
export async function GET() {
  try {
    const columns = await prisma.caseColumn.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: columns,
    });
  } catch (error) {
    console.error('Error fetching case columns:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch case columns' },
      { status: 500 }
    );
  }
}
