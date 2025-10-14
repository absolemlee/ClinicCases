'use client';

import { useState } from 'react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show navigation on login page
  if (pathname === '/login') {
    return null;
  }

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile-first: Top bar with hamburger */}
        <div className="flex items-center justify-between h-16">
          {/* Logo - always visible */}
          <Link href="/home" className="flex-shrink-0">
            <span className="text-lg sm:text-xl font-bold text-white">ClinicCases</span>
          </Link>

          {/* Desktop navigation - hidden on mobile/tablet */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
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

          {/* Right side: User menu (desktop) and mobile menu button */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <UserMenu />
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile/Tablet menu - slides down when open */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href as any}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            
            {/* User menu in mobile */}
            <div className="pt-4 mt-4 border-t border-gray-700">
              <UserMenu />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
