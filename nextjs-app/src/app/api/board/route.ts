import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// GET /api/board - List board posts visible to current user
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const username = session.user.username;
    const userGroup = session.user.group || '';

    // Get posts where user is listed as viewer (by username or group)
    const posts = await prisma.boardPost.findMany({
      where: {
        viewers: {
          some: {
            OR: [
              { viewer: username },
              { viewer: userGroup },
              { viewer: { startsWith: 'All ' } }, // Group identifiers like "All Administrators"
            ],
          },
        },
        ...(search && {
          OR: [
            { title: { contains: search } },
            { body: { contains: search } },
          ],
        }),
      },
      include: {
        viewers: true,
        attachments: true,
      },
      orderBy: { timeAdded: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error('Error fetching board posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch board posts' },
      { status: 500 }
    );
  }
}

// POST /api/board - Create a new board post
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const username = session.user.username;
    const body = await request.json();
    const { title, text, color, viewers } = body;

    // Create the post
    const post = await prisma.boardPost.create({
      data: {
        title: title || '',
        body: text || '',
        color: color || '#3b82f6',
        author: username,
        timeAdded: new Date(),
        timeEdited: new Date(),
      },
    });

    // Add viewers (SQLite limitation - create one by one)
    if (viewers && Array.isArray(viewers)) {
      for (const viewer of viewers) {
        await prisma.boardViewer.create({
          data: {
            postId: post.id,
            viewer,
          },
        });
      }
    }

    // Fetch the complete post with relations
    const completePost = await prisma.boardPost.findUnique({
      where: { id: post.id },
      include: {
        viewers: true,
        attachments: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: completePost,
    });
  } catch (error) {
    console.error('Error creating board post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create board post' },
      { status: 500 }
    );
  }
}
