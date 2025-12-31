'use client';

import { useState } from 'react';
import { useUser } from '@/lib/mock/user-context';

export function UserSwitcher() {
  const { currentUser, setCurrentUser, users } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  if (!currentUser) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm transition-all hover:bg-white/10"
      >
        <img
          src={currentUser.image || ''}
          alt={currentUser.name}
          className="h-6 w-6 rounded-full"
        />
        <span className="max-w-[100px] truncate text-white/80">{currentUser.name}</span>
        <svg
          className={`h-4 w-4 text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-white/10 bg-black/95 shadow-xl backdrop-blur-xl">
            <div className="border-b border-white/10 px-4 py-2">
              <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                Switch User (Dev Mode)
              </p>
            </div>
            <div className="max-h-64 overflow-y-auto py-1">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    setCurrentUser(user);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/5 ${
                    currentUser.id === user.id ? 'bg-white/10' : ''
                  }`}
                >
                  <img src={user.image || ''} alt={user.name} className="h-8 w-8 rounded-full" />
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-white">{user.name}</p>
                    <p className="truncate text-xs text-white/50">{user.email}</p>
                  </div>
                  {user.role === 'ADMIN' && (
                    <span className="rounded-full bg-instagram-purple/20 px-2 py-0.5 text-[10px] font-medium text-instagram-purple">
                      Admin
                    </span>
                  )}
                  {currentUser.id === user.id && (
                    <svg className="h-4 w-4 text-instagram-pink" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
