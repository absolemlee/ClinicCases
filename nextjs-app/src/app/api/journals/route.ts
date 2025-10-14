import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// GET /api/journals - List journals based on user permissions
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'unread'; // unread, read, all, archived
    const username = session.user.username;

    // Get user's group to check permissions
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const group = await prisma.group.findFirst({
      where: { groupName: user.grp || '' },
    });

    const writesJournals = group?.writesJournals === 1;
    const readsJournals = group?.readsJournals === 1;

    let whereClause: any = {};

    if (writesJournals && !readsJournals) {
      // Journal writers see their own journals
      whereClause.username = username;
    } else if (readsJournals) {
      // Journal readers see journals where they are listed as a reader
      whereClause.OR = [
        { reader: { contains: username } },
        { reader: { equals: username } },
      ];
    } else {
      // No permission
      return NextResponse.json({ success: false, error: 'No permission to view journals' }, { status: 403 });
    }

    // Apply filter
    if (filter === 'unread' && readsJournals) {
      whereClause.AND = [
        { NOT: { read: { contains: username } } },
        { NOT: { archived: { contains: username } } },
      ];
    } else if (filter === 'read' && readsJournals) {
      whereClause.AND = [
        { read: { contains: username } },
        { NOT: { archived: { contains: username } } },
      ];
    } else if (filter === 'archived') {
      whereClause.archived = { contains: username };
    }

    const journals = await prisma.journal.findMany({
      where: whereClause,
      orderBy: { dateAdded: 'desc' },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      data: journals,
      permissions: {
        writesJournals,
        readsJournals,
      },
    });
  } catch (error) {
    console.error('Error fetching journals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch journals' },
      { status: 500 }
    );
  }
}

// POST /api/journals - Create a new journal
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const username = session.user.username;

    // Check permission
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const group = await prisma.group.findFirst({
      where: { groupName: user.grp || '' },
    });

    if (group?.writesJournals !== 1) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to write journals' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { text, reader } = body;

    const journal = await prisma.journal.create({
      data: {
        username,
        text: text || '',
        reader: reader || '',
        dateAdded: new Date(),
        archived: '',
        read: '',
        commented: '',
        comments: '',
      },
    });

    return NextResponse.json({
      success: true,
      data: journal,
    });
  } catch (error) {
    console.error('Error creating journal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create journal' },
      { status: 500 }
    );
  }
}
