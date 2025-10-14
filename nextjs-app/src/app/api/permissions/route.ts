import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserPermissions } from '@/lib/permissions';

export const dynamic = 'force-dynamic';

// GET /api/permissions - Get user permissions
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const group = searchParams.get('group') || session.user.group || null;

    const permissions = await getUserPermissions(group);

    return NextResponse.json({
      success: true,
      data: permissions,
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch permissions' },
      { status: 500 }
    );
  }
}
