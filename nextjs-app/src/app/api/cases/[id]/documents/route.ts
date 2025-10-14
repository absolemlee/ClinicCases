import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserPermissions } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

// Configuration
const UPLOAD_DIR = path.join(process.cwd(), '../uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = [
  '.pdf', '.doc', '.docx', '.txt', '.rtf',
  '.jpg', '.jpeg', '.png', '.gif', '.bmp',
  '.xls', '.xlsx', '.csv',
  '.zip', '.rar', '.7z'
];

// POST endpoint to upload a document
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    if (isNaN(caseId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid case ID' },
        { status: 400 }
      );
    }

    // Check permissions
    const permissions = await getUserPermissions(session.user.group || null);
    if (!permissions.editCases) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to add documents' },
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

    // Ensure upload directory exists
    try {
      await fs.access(UPLOAD_DIR);
    } catch {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const displayName = formData.get('displayName') as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Validate file extension
    const originalName = file.name;
    const extension = path.extname(originalName).toLowerCase();
    
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json(
        { success: false, error: `File type ${extension} is not allowed` },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const localFileName = `${caseId}_${timestamp}_${randomString}${extension}`;
    const filePath = path.join(UPLOAD_DIR, localFileName);

    // Convert file to buffer and save
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, new Uint8Array(buffer));

    // Create database record
    const document = await prisma.document.create({
      data: {
        caseId: caseId,
        displayName: displayName || originalName,
        localFileName: localFileName,
        extension: extension.replace('.', ''),
        folder: 'case_documents',
        addedBy: session.user.username || '',
        timeAdded: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: document,
      message: 'Document uploaded successfully',
    });

  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}

// GET endpoint to list documents for a case
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    if (isNaN(caseId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid case ID' },
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

    // Get all documents for the case
    const documents = await prisma.document.findMany({
      where: { caseId: caseId },
      orderBy: { timeAdded: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: documents,
      count: documents.length,
    });

  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}
