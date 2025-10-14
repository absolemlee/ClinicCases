import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// POST /api/journals/[id]/comment - Add comment to journal
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
    const isAuthor = journal.username === username;
    const isReader = journal.reader?.includes(username);

    if (!isAuthor && !isReader) {
      return NextResponse.json({ success: false, error: 'No permission to comment on this journal' }, { status: 403 });
    }

    const body = await request.json();
    const { comment } = body;

    if (!comment || !comment.trim()) {
      return NextResponse.json({ success: false, error: 'Comment text is required' }, { status: 400 });
    }

    // Parse existing comments (stored as JSON array)
    let comments: Array<{ username: string; text: string; date: string }> = [];
    if (journal.comments) {
      try {
        comments = JSON.parse(journal.comments);
      } catch (e) {
        comments = [];
      }
    }

    // Add new comment
    comments.push({
      username,
      text: comment,
      date: new Date().toISOString(),
    });

    const updatedJournal = await prisma.journal.update({
      where: { id: journalId },
      data: {
        comments: JSON.stringify(comments),
        commented: 'yes',
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedJournal,
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add comment' },
      { status: 500 }
    );
  }
}
