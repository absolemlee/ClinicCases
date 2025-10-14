import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// POST /api/upload - Handle file uploads
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const caseId = formData.get('caseId') as string;
    const displayName = formData.get('displayName') as string;
    const folder = formData.get('folder') as string || 'general';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', folder);
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${timestamp}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const filepath = join(uploadsDir, uniqueFilename);

    // Write file to disk
    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);
    await writeFile(filepath, buffer);

    // Store metadata in database
    const document = await prisma.document.create({
      data: {
        caseId: caseId ? parseInt(caseId) : null,
        displayName: displayName || file.name,
        localFileName: uniqueFilename,
        extension: fileExtension || null,
        folder,
        timeAdded: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...document,
        url: `/uploads/${folder}/${uniqueFilename}`,
      },
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
