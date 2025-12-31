import { BottomNav } from '@/components/navigation/bottom-nav';
import { UserSwitcher } from '@/components/navigation/user-switcher';
import { UserProvider } from '@/lib/mock/user-context';
import Link from 'next/link';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <div className="min-h-screen bg-black pb-20">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur-xl">
          <div className="flex h-14 items-center justify-between px-4">
            <Link href="/home" className="font-heading text-lg font-bold">
              <span className="gradient-text">Sharing</span>
              <span className="text-white/80"> Is Caring</span>
            </Link>
            <UserSwitcher />
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto max-w-lg">{children}</main>

        {/* Bottom navigation */}
        <BottomNav />
      </div>
    </UserProvider>
  );
}
