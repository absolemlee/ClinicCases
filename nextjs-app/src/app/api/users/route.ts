import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { auth } from '@/auth';
import { createUserCreationJournal } from '@/lib/systemJournal';

// GET /api/users - List all users
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const filter = searchParams.get('filter');

  try {
    const where: any = {};
    
    if (status) {
      where.status = status;
    }

    // Filter for journal readers
    if (filter === 'journal_readers') {
      const groups = await prisma.group.findMany({
        where: { readsJournals: 1 },
        select: { groupName: true },
      });
      const groupNames = groups.map((g) => g.groupName);
      where.grp = { in: groupNames };
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { lastName: 'asc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        grp: true,
        status: true,
        mobilePhone: true,
        officePhone: true,
        dateCreated: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user
export async function POST(request: Request) {
  try {
    // Get the current user (creator)
    const session = await auth();
    const creatorUsername = session?.user?.username || 'system';

    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      username,
      password,
      grp,
      status = 'inactive',
      mobilePhone,
      officePhone,
      homePhone,
    } = body;

    // Check if username already exists
    const existing = await prisma.user.findUnique({
      where: { username },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Username already exists' },
        { status: 400 }
      );
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        username,
        password: hashedPassword,
        grp,
        status,
        mobilePhone,
        officePhone,
        homePhone,
        dateCreated: new Date(),
        newUser: '1',
        forceNewPassword: 1,
      },
    });

    // Create automatic system journal entry for the new user
    try {
      await createUserCreationJournal(username, creatorUsername, {
        firstName,
        lastName,
        email,
        group: grp,
      });
      console.log(`✓ System journal created for new user: ${username}`);
    } catch (journalError) {
      // Don't fail user creation if journal fails, just log it
      console.error('Failed to create system journal:', journalError);
    }

    return NextResponse.json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
