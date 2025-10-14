# Authentication Setup - Auth.js v5

This application uses **Auth.js v5** (formerly NextAuth.js) for authentication.

## Overview

- **Provider**: Credentials-based authentication
- **Session Strategy**: JWT (JSON Web Tokens)
- **Password Handling**: Supports both legacy plaintext and bcrypt hashed passwords
- **Protected Routes**: All routes except `/login` require authentication

## Configuration Files

### 1. `/src/auth.ts`
Core Auth.js configuration with:
- Credentials provider setup
- User authentication logic
- JWT and session callbacks
- Password verification (legacy + hashed)

### 2. `/src/middleware.ts`
Route protection middleware that:
- Redirects unauthenticated users to `/login`
- Allows public access to login and auth API routes
- Preserves callback URL for post-login redirect

### 3. `/src/app/api/auth/[...nextauth]/route.ts`
API route handlers for Auth.js (handles sign in, sign out, etc.)

### 4. `/src/types/next-auth.d.ts`
TypeScript type extensions for Auth.js to include custom user fields:
- `username`
- `group` (user role/permission group)

## Environment Variables

Add to `.env`:

```env
AUTH_SECRET="your-secret-key-here"
```

**Generate a secure secret:**
```bash
openssl rand -base64 32
```

## Usage

### Login Page
- **URL**: `/login`
- **Demo Credentials**: 
  - Username: `admin`
  - Password: `admin`

### User Session

Access the current user session in client components:

```tsx
'use client';

import { useSession } from 'next-auth/react';

export function MyComponent() {
  const { data: session } = useSession();
  
  if (session?.user) {
    console.log(session.user.username);
    console.log(session.user.group);
  }
  
  return <div>Hello {session?.user?.name}</div>;
}
```

Access the current user session in server components:

```tsx
import { auth } from '@/auth';

export default async function MyPage() {
  const session = await auth();
  
  if (session?.user) {
    console.log(session.user.username);
  }
  
  return <div>Hello {session?.user?.name}</div>;
}
```

### Sign Out

```tsx
'use client';

import { signOut } from 'next-auth/react';

export function SignOutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: '/login' })}>
      Sign Out
    </button>
  );
}
```

### Protecting API Routes

```typescript
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Your API logic here
  return NextResponse.json({ data: 'Protected data' });
}
```

## Password Migration

The system currently supports both legacy (plaintext) and bcrypt hashed passwords for backward compatibility.

### To Hash Existing Passwords

```typescript
import bcrypt from 'bcryptjs';

const hashedPassword = await bcrypt.hash('plaintext-password', 10);
```

### Recommended: Migrate on Login

Update the authorization function in `src/auth.ts` to hash passwords on successful login:

```typescript
if (credentials.password === user.password) {
  // Password matches plaintext - hash it
  const hashedPassword = await bcrypt.hash(credentials.password as string, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });
}
```

## Components

### AuthProvider
Wraps the app with Auth.js session context (in `layout.tsx`)

### UserMenu
Displays user info and sign-out button in navigation

### Navigation
Top navigation bar with protected route links

## Security Notes

1. **Change AUTH_SECRET** - Never use the default secret in production
2. **Migrate Passwords** - Hash all plaintext passwords as soon as possible
3. **HTTPS Required** - Auth.js requires HTTPS in production
4. **Session Expiration** - Default JWT expiration is 30 days (configurable in `src/auth.ts`)

## Troubleshooting

### "Invalid username or password" Error
- Check database for user existence
- Verify user status is 'active'
- Confirm password matches (case-sensitive)

### Infinite Redirect Loop
- Clear browser cookies
- Check `AUTH_SECRET` is set in `.env`
- Verify middleware matcher patterns

### Session Not Persisting
- Ensure AuthProvider wraps your app in `layout.tsx`
- Check browser allows cookies
- Verify `AUTH_SECRET` environment variable

## Testing

Test with the seeded admin user:
- Username: `admin`
- Password: `admin` (from seed script)

You can create additional users through the Users management page at `/users`.
