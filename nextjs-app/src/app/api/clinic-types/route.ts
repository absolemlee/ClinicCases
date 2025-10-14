import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/clinic-types - List all clinic types
export async function GET() {
  try {
    const clinicTypes = await prisma.clinicType.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: clinicTypes,
      count: clinicTypes.length,
    });
  } catch (error) {
    console.error('Error fetching clinic types:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clinic types' },
      { status: 500 }
    );
  }
}

// POST /api/clinic-types - Create new clinic type
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, name } = body;

    const newClinicType = await prisma.clinicType.create({
      data: {
        code,
        name,
      },
    });

    return NextResponse.json({
      success: true,
      data: newClinicType,
    });
  } catch (error) {
    console.error('Error creating clinic type:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create clinic type' },
      { status: 500 }
    );
  }
}
