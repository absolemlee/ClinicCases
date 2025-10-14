import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// POST /api/journals/[id]/archive - Archive journal for current user
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const journalId = parseInt(params.id);
    if (isNaN(journalId)) {
      return NextResponse.json({ success: false, error: 'Invalid journal ID' }, { status: 400 });
    }

    const journal = await prisma.journal.findUnique({
      where: { id: journalId },
    });

    if (!journal) {
      return NextResponse.json({ success: false, error: 'Journal not found' }, { status: 404 });
    }

    const username = session.user.username;
    const archivedList = journal.archived ? journal.archived.split(',').filter(Boolean) : [];
    
    if (!archivedList.includes(username)) {
      archivedList.push(username);
    }

    const updatedJournal = await prisma.journal.update({
      where: { id: journalId },
      data: {
        archived: archivedList.join(','),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedJournal,
    });
  } catch (error) {
    console.error('Error archiving journal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to archive journal' },
      { status: 500 }
    );
  }
}
