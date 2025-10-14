import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [totalCases, openCases, recentNotes, upcomingEvents] = await Promise.all([
      prisma.case.count({ where: { deleted: 0 } }),
      prisma.case.count({ where: { deleted: 0, dateClose: null } }),
      prisma.caseNote.count({
        where: {
          datestamp: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
      prisma.event.count({
        where: {
          start: {
            gte: new Date(),
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalCases,
        openCases,
        recentNotes,
        upcomingEvents,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
