'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/lib/mock/user-context';
import { navItems } from './nav-items';

export function SidebarNav() {
  const pathname = usePathname();
  const { currentUser } = useUser();

  return (
    <aside className="fixed left-0 top-14 bottom-0 z-40 hidden w-64 border-r border-white/10 bg-black lg:block">
      <nav className="flex h-full flex-col px-3 py-6">
        {/* Navigation Links */}
        <div className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-all ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label === 'Profile'
                  ? item.icon(isActive, currentUser?.image)
                  : item.icon(isActive)}
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User info at bottom */}
        {currentUser && (
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center gap-3 rounded-xl px-4 py-3">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-white/10">
                {currentUser.image ? (
                  <img
                    src={currentUser.image}
                    alt={currentUser.name || 'User'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white/50">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {currentUser.name || 'Anonymous'}
                </p>
                <p className="truncate text-xs text-white/50">
                  {currentUser.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}
