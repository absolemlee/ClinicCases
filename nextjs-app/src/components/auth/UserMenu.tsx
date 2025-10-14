'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

export function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!session?.user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {session.user.name?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-white">{session.user.name || session.user.username}</p>
          {session.user.group && (
            <p className="text-xs text-gray-400">{session.user.group}</p>
          )}
        </div>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-20">
            <div className="p-3 border-b border-gray-700">
              <p className="text-sm font-medium text-white">{session.user.username}</p>
              {session.user.email && (
                <p className="text-xs text-gray-400 mt-1">{session.user.email}</p>
              )}
            </div>
            <div className="py-1">
              <Link
                href={"/profile" as any}
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                My Profile
              </Link>
              <Link
                href={"/preferences" as any}
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Preferences
              </Link>
            </div>
            <div className="border-t border-gray-700 py-1">
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
