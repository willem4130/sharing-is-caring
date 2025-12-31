'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/lib/mock/user-context';
import { navItems } from './nav-items';

export function BottomNav() {
  const pathname = usePathname();
  const { currentUser } = useUser();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/90 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                isActive ? 'text-white' : 'text-white/50 hover:text-white/80'
              }`}
            >
              {item.label === 'Profile'
                ? item.icon(isActive, currentUser?.image)
                : item.icon(isActive)}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
      {/* Safe area for iOS */}
      <div className="h-safe-area-inset-bottom bg-black" />
    </nav>
  );
}
