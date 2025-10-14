import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserPermissions } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), '../uploads');

// MIME type mapping
const MIME_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  txt: 'text/plain',
  rtf: 'application/rtf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  bmp: 'image/bmp',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv: 'text/csv',
  zip: 'application/zip',
  rar: 'application/x-rar-compressed',
  '7z': 'application/x-7z-compressed',
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; documentId: string } }
) {
  try {
    // Authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const caseId = parseInt(params.id);
    const documentId = parseInt(params.documentId);

    if (isNaN(caseId) || isNaN(documentId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid case ID or document ID' },
        { status: 400 }
      );
    }

    // Check permissions
    const permissions = await getUserPermissions(session.user.group || null);

    // Verify case exists and user has access
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: { assignees: true },
    });

    if (!caseData) {
      return NextResponse.json(
        { success: false, error: 'Case not found' },
        { status: 404 }
      );
    }

    if (!permissions.viewOthers) {
      const isAssigned = caseData.assignees.some(
        (assignee) => assignee.username === session.user.username && assignee.status === 'active'
      );
      if (!isAssigned) {
        return NextResponse.json(
          { success: false, error: 'You do not have permission to access this case' },
          { status: 403 }
        );
      }
    }

    // Get document metadata
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    // Verify document belongs to this case
    if (document.caseId !== caseId) {
      return NextResponse.json(
        { success: false, error: 'Document does not belong to this case' },
        { status: 403 }
      );
    }

    // Build file path
    const filePath = path.join(UPLOAD_DIR, document.localFileName || '');

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { success: false, error: 'File not found on disk' },
        { status: 404 }
      );
    }

    // Read file
    const fileBuffer = await fs.readFile(filePath);

    // Determine MIME type
    const extension = document.extension?.toLowerCase() || '';
    const mimeType = MIME_TYPES[extension] || 'application/octet-stream';

    // Return file with appropriate headers
    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${document.displayName || document.localFileName}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error downloading document:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to download document' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove a document
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; documentId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const caseId = parseInt(params.id);
    const documentId = parseInt(params.documentId);
    if (isNaN(caseId) || isNaN(documentId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid case ID or document ID' },
        { status: 400 }
      );
    }

    // Check permissions - need deleteCases permission to delete documents
    const permissions = await getUserPermissions(session.user.group || null);
    if (!permissions.deleteCases) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to delete documents' },
        { status: 403 }
      );
    }

    // Verify case exists and user has access
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: { assignees: true },
    });

    if (!caseData) {
      return NextResponse.json(
        { success: false, error: 'Case not found' },
        { status: 404 }
      );
    }

    if (!permissions.viewOthers) {
      const isAssigned = caseData.assignees.some(
        (assignee) => assignee.username === session.user.username && assignee.status === 'active'
      );
      if (!isAssigned) {
        return NextResponse.json(
          { success: false, error: 'You do not have permission to access this case' },
          { status: 403 }
        );
      }
    }

    // Get document metadata
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    // Verify document belongs to this case
    if (document.caseId !== caseId) {
      return NextResponse.json(
        { success: false, error: 'Document does not belong to this case' },
        { status: 403 }
      );
    }

    // Delete file from disk
    const filePath = path.join(UPLOAD_DIR, document.localFileName || '');
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting file from disk:', error);
      // Continue with database deletion even if file deletion fails
    }

    // Delete database record
    await prisma.document.delete({
      where: { id: documentId },
    });

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
