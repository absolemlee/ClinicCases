import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const dynamic = 'force-dynamic';

// POST /api/board/[id]/attachments - Upload attachment to board post
export async function POST(
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

    // Check if post exists
    const post = await prisma.boardPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    const username = session.user.username;

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), '..', 'uploads', 'board');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || '';
    const localFileName = `board_${postId}_${timestamp}.${extension}`;
    const filePath = join(uploadsDir, localFileName);

    // Write file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, new Uint8Array(buffer));

    // Create attachment record
    const attachment = await prisma.boardAttachment.create({
      data: {
        name: file.name,
        localFileName,
        extension,
        username,
        postId,
        timeAdded: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: attachment,
    });
  } catch (error) {
    console.error('Error uploading attachment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload attachment' },
      { status: 500 }
    );
  }
}

// DELETE /api/board/[id]/attachments/[attachmentId] would go in a separate file
// For now, we'll handle deletion through the main post deletion
