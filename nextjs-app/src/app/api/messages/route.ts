import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/messages - List messages (inbox)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folder = searchParams.get('folder') || 'inbox';

  try {
    const where: any = {};

    // Filter by folder type
    switch (folder) {
      case 'inbox':
        where.to = { not: null }; // Messages received
        break;
      case 'sent':
        where.from = { not: null }; // Messages sent
        break;
      case 'archived':
        where.archived = 1;
        break;
    }

    const messages = await prisma.message.findMany({
      where,
      include: {
        case: {
          select: {
            caseNumber: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { timeSent: 'desc' },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      data: messages,
      count: messages.length,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/messages - Create new message
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { assocCase, to, from, subject, messageBody } = body;

    const newMessage = await prisma.message.create({
      data: {
        assocCase: assocCase ? parseInt(assocCase) : null,
        to,
        from,
        subject,
        body: messageBody,
        timeSent: new Date(),
        archived: 0,
        readFlag: 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create message' },
      { status: 500 }
    );
  }
}
