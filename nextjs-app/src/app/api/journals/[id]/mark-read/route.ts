import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// POST /api/journals/[id]/mark-read - Mark journal as read
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
    const readList = journal.read ? journal.read.split(',').filter(Boolean) : [];
    
    if (!readList.includes(username)) {
      readList.push(username);
    }

    const updatedJournal = await prisma.journal.update({
      where: { id: journalId },
      data: {
        read: readList.join(','),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedJournal,
    });
  } catch (error) {
    console.error('Error marking journal as read:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to mark journal as read' },
      { status: 500 }
    );
  }
}
