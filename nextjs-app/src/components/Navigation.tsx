'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserMenu } from './auth/UserMenu';

const navigation = [
  { name: 'Home', href: '/home' },
  { name: 'Cases', href: '/cases' },
  { name: 'Board', href: '/board' },
  { name: 'Messages', href: '/messages' },
  { name: 'Journals', href: '/journals' },
  { name: 'Users', href: '/users' },
  { name: 'Groups', href: '/groups' },
  { name: 'Utilities', href: '/utilities' },
];

export function Navigation() {
  const pathname = usePathname();

  // Don't show navigation on login page
  if (pathname === '/login') {
    return null;
  }

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/home" className="flex-shrink-0">
              <span className="text-xl font-bold text-white">ClinicCases</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navigation.map((item) => {
                  const isActive = pathname?.startsWith(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href as any}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
