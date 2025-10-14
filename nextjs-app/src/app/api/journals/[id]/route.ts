import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// GET /api/journals/[id] - Get a specific journal
export async function GET(
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

    // Check if user has permission to view this journal
    const username = session.user.username;
    const isAuthor = journal.username === username;
    const isReader = journal.reader?.includes(username);

    if (!isAuthor && !isReader) {
      return NextResponse.json({ success: false, error: 'No permission to view this journal' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: journal,
    });
  } catch (error) {
    console.error('Error fetching journal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch journal' },
      { status: 500 }
    );
  }
}

// PATCH /api/journals/[id] - Update a journal
export async function PATCH(
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
    const isAuthor = journal.username === username;

    if (!isAuthor) {
      return NextResponse.json({ success: false, error: 'Only the author can edit this journal' }, { status: 403 });
    }

    const body = await request.json();
    const { text, reader } = body;

    const updatedJournal = await prisma.journal.update({
      where: { id: journalId },
      data: {
        ...(text !== undefined && { text }),
        ...(reader !== undefined && { reader }),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedJournal,
    });
  } catch (error) {
    console.error('Error updating journal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update journal' },
      { status: 500 }
    );
  }
}

// DELETE /api/journals/[id] - Delete a journal
export async function DELETE(
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
    const isAuthor = journal.username === username;

    if (!isAuthor) {
      return NextResponse.json({ success: false, error: 'Only the author can delete this journal' }, { status: 403 });
    }

    await prisma.journal.delete({
      where: { id: journalId },
    });

    return NextResponse.json({
      success: true,
      message: 'Journal deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting journal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete journal' },
      { status: 500 }
    );
  }
}
