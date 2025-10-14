import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/users - List all users
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  try {
    const where: any = {};
    
    if (status) {
      where.status = status;
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

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        username,
        password, // In production, this should be hashed!
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
