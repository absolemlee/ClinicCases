import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// GET /api/board/[id] - Get a specific board post
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const postId = parseInt(params.id);
    if (isNaN(postId)) {
      return NextResponse.json({ success: false, error: 'Invalid post ID' }, { status: 400 });
    }

    const post = await prisma.boardPost.findUnique({
      where: { id: postId },
      include: {
        viewers: true,
        attachments: true,
      },
    });

    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    // Check if user has permission to view
    const username = session.user.username;
    const userGroup = session.user.group || '';
    const canView = post.viewers.some(
      (v) => v.viewer === username || v.viewer === userGroup || v.viewer.startsWith('All ')
    );

    if (!canView) {
      return NextResponse.json({ success: false, error: 'No permission to view this post' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Error fetching board post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch board post' },
      { status: 500 }
    );
  }
}

// PATCH /api/board/[id] - Update a board post
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const postId = parseInt(params.id);
    if (isNaN(postId)) {
      return NextResponse.json({ success: false, error: 'Invalid post ID' }, { status: 400 });
    }

    const post = await prisma.boardPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    const username = session.user.username;
    const isAuthor = post.author === username;

    // Check if user is admin (can edit any post)
    const user = await prisma.user.findUnique({ where: { username } });
    const group = await prisma.group.findFirst({ where: { groupName: user?.grp || '' } });
    const isAdmin = group?.groupName?.toLowerCase().includes('admin');

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Only the author or admin can edit this post' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, text, color, viewers } = body;

    // Update the post
    const updatedPost = await prisma.boardPost.update({
      where: { id: postId },
      data: {
        ...(title !== undefined && { title }),
        ...(text !== undefined && { body: text }),
        ...(color !== undefined && { color }),
        timeEdited: new Date(),
      },
    });

    // Update viewers if provided
    if (viewers && Array.isArray(viewers)) {
      // Delete old viewers
      await prisma.boardViewer.deleteMany({
        where: { postId },
      });

      // Add new viewers one by one (SQLite limitation)
      for (const viewer of viewers) {
        await prisma.boardViewer.create({
          data: {
            postId,
            viewer,
          },
        });
      }
    }

    // Fetch the complete updated post
    const completePost = await prisma.boardPost.findUnique({
      where: { id: postId },
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
    console.error('Error updating board post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update board post' },
      { status: 500 }
    );
  }
}

// DELETE /api/board/[id] - Delete a board post
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const postId = parseInt(params.id);
    if (isNaN(postId)) {
      return NextResponse.json({ success: false, error: 'Invalid post ID' }, { status: 400 });
    }

    const post = await prisma.boardPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    const username = session.user.username;
    const isAuthor = post.author === username;

    // Check if user is admin (can delete any post)
    const user = await prisma.user.findUnique({ where: { username } });
    const group = await prisma.group.findFirst({ where: { groupName: user?.grp || '' } });
    const isAdmin = group?.groupName?.toLowerCase().includes('admin');

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Only the author or admin can delete this post' },
        { status: 403 }
      );
    }

    // Delete the post (cascades to viewers and attachments)
    await prisma.boardPost.delete({
      where: { id: postId },
    });

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting board post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete board post' },
      { status: 500 }
    );
  }
}
