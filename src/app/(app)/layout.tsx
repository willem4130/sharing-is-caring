import { BottomNav } from '@/components/navigation/bottom-nav';
import { SidebarNav } from '@/components/navigation/sidebar-nav';
import { UserSwitcher } from '@/components/navigation/user-switcher';
import { UserProvider } from '@/lib/mock/user-context';
import Link from 'next/link';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <div className="min-h-screen bg-black pb-20 lg:pb-0">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur-xl">
          <div className="flex h-14 items-center justify-between px-4 lg:pl-72 lg:pr-8">
            <Link href="/home" className="font-heading text-lg font-bold">
              <span className="gradient-text">Sharing</span>
              <span className="text-white/80"> Is Caring</span>
            </Link>
            <UserSwitcher />
          </div>
        </header>

        {/* Sidebar navigation (desktop only) */}
        <SidebarNav />

        {/* Main content - shifts right on desktop to account for sidebar */}
        <main className="mx-auto max-w-5xl px-0 md:px-4 lg:ml-64 lg:mr-0 lg:max-w-none lg:px-8">
          <div className="lg:max-w-4xl">{children}</div>
        </main>

        {/* Bottom navigation (mobile/tablet only) */}
        <BottomNav />
      </div>
    </UserProvider>
  );
}
