import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/case-events - Create new case event
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { caseId, description, date, location, notes } = body;

    const newEvent = await prisma.event.create({
      data: {
        caseId: parseInt(caseId),
        task: description, // Using 'task' field for description
        start: new Date(date),
        location,
        notes,
        timeAdded: new Date(),
        status: 'pending',
        allDay: 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: newEvent,
    });
  } catch (error) {
    console.error('Error creating case event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create case event' },
      { status: 500 }
    );
  }
}
